import { io } from 'socket.io-client';
import { useNotificationStore } from '../stores/notification';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';

// URL của WebSocket API - sử dụng biến môi trường hoặc fallback về localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const SOCKET_URL = API_URL.replace(/^http/, 'ws');

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.connecting = false;
    this.notificationStore = null;
    this.useSocketIO = false; // Flag để quyết định dùng Socket.IO hay WebSocket thuần
    this.connectionAttempts = 0;
    this.maxConnectionAttempts = 5; // Tăng số lần thử
    
    // Vô hiệu hóa Socket.IO hoàn toàn
    this.enableSocketIO = false;
  }

  // Khởi tạo kết nối WebSocket
  init() {
    if (this.connecting || this.connected) {
      return;
    }

    this.connecting = true;
    this.connectionAttempts++;

    // Lấy store notification
    this.notificationStore = useNotificationStore();

    // Chỉ sử dụng WebSocket thuần, không dùng Socket.IO
    this.useSocketIO = false;
    this.connectWebSocket();
  }

  // Kết nối socket.io - Không sử dụng nữa
  connectSocketIO() {
    if (!this.enableSocketIO) {
      this.connecting = false;
      this.tryAlternativeConnection();
      return;
    }
    
    try {
      this.useSocketIO = true;
      
      this.socket = io(API_URL, {
        path: '/socket.io/',
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      this.socket.on('connect', () => {
        this.connected = true;
        this.connecting = false;
        this.connectionAttempts = 0;
        
        // Xác thực kết nối
        this.authenticateConnection();
      });

      this.socket.on('disconnect', (reason) => {
        this.connected = false;
        this.connecting = false;
        
        if (reason !== 'io client disconnect') {
          setTimeout(() => {
            this.init();
          }, 3000);
        }
      });

      this.socket.on('message', (data) => {
        this.handleMessage(data);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        this.connecting = false;
        this.tryAlternativeConnection();
      });
    } catch (error) {
      console.error('Error initializing Socket.IO:', error);
      this.connecting = false;
      this.tryAlternativeConnection();
    }
  }

  // Kết nối WebSocket thông thường
  connectWebSocket() {
    try {
      this.useSocketIO = false;
      
      try {
        this.socket = new WebSocket(`${SOCKET_URL}/api/ws/notifications/`);
      } catch (error) {
        console.error('Lỗi kết nối đường dẫn 1, thử đường dẫn 2:', error);
        this.socket = new WebSocket(`${SOCKET_URL}/ws/notifications/`);
      }

      // Xử lý sự kiện kết nối thành công
      this.socket.onopen = () => {
        this.connected = true;
        this.connecting = false;
        this.connectionAttempts = 0;
        
        // Xác thực kết nối
        this.authenticateConnection();
      };

      // Xử lý sự kiện khi nhận được thông báo
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Lỗi xử lý dữ liệu WebSocket:', error, 'Raw data:', event.data);
        }
      };

      // Xử lý sự kiện đóng kết nối
      this.socket.onclose = (event) => {
        this.connected = false;
        this.connecting = false;
        
        // Tự động kết nối lại sau 3 giây nếu không phải là đóng có chủ ý
        if (event.code !== 1000) {
          setTimeout(() => {
            this.init();
          }, 3000);
        }
      };

      // Xử lý lỗi
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connecting = false;
        this.tryAlternativeConnection();
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.connecting = false;
      this.tryAlternativeConnection();
    }
  }

  // Thử phương thức kết nối thay thế nếu phương thức hiện tại thất bại
  tryAlternativeConnection() {
    if (this.connectionAttempts >= this.maxConnectionAttempts) {
      return;
    }

    if (this.useSocketIO && this.enableSocketIO) {
      this.connectWebSocket();
    } else {
      // Chỉ tăng số lần thử và thử lại WebSocket
      this.connectionAttempts++;
      
      // Thử lại WebSocket sau 3 giây
      setTimeout(() => {
        this.connectWebSocket();
      }, 3000);
    }
  }

  // Xác thực kết nối
  authenticateConnection() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    if (this.useSocketIO) {
      this.socket.emit('authenticate', { token });
    } else {
      this.socket.send(JSON.stringify({
        type: 'authenticate',
        token: token
      }));
    }
  }

  // Xử lý tin nhắn nhận được
  handleMessage(data) {
    
    // Xử lý các loại message
    if (data.type === 'auth_required') {
      this.authenticateConnection();
    } 
    else if (data.type === 'auth_success') {
      // Authentication successful
    }
    else if (data.type === 'auth_fail') {
      console.error('❌ WebSocket xác thực thất bại');
      this.disconnect();
    }
    else if (data.type === 'new_message' || (data.data && data.data.type === 'new_message')) {
      // Xử lý tin nhắn mới
      this.handleNewMessage(data);
      
      // Gọi tất cả các message handlers đã đăng ký
      if (this.messageHandlers && this.messageHandlers.length > 0) {
        this.messageHandlers.forEach(handler => {
          try {
            handler(data);
          } catch (error) {
            console.error('Lỗi khi gọi message handler:', error);
          }
        });
      }
    }
    else {
      // Xử lý thông báo thông thường
      this.handleRegularNotification();
    }
  }

  // Xử lý tin nhắn mới
  handleNewMessage(data) {
    // Lấy dữ liệu tin nhắn đúng cách (có thể nằm trong data.data hoặc trực tiếp trong data)
    const messageData = data.data?.type === 'new_message' ? data.data : data;
    
    // Lấy chatStore và authStore
    const chatStore = useChatStore();
    const authStore = useAuthStore();
    
    // Tạo đối tượng tin nhắn từ dữ liệu nhận được
    const newMessage = {
      id: parseInt(messageData.message_id, 10),
      sender: parseInt(messageData.sender_id, 10),
      recipient: parseInt(messageData.recipient_id, 10),
      content: messageData.content,
      is_read: false, // Tin nhắn mới luôn chưa đọc
      created_at: messageData.created_at || new Date().toISOString(),
      recipient_fullname: messageData.recipient_fullname || null
    };
    
    // Xác định người dùng hiện tại từ authStore thay vì chatStore
    const currentUserId = authStore.userInfo?.user_id;
    
    if (!currentUserId) {
      console.error('Không có thông tin người dùng hiện tại, không thể xử lý tin nhắn');
      console.error('AuthStore token:', authStore.token ? 'Có token' : 'Không có token');
      console.error('AuthStore user:', authStore.user);
      return;
    }
    
    // Kiểm tra xem tin nhắn có liên quan đến người dùng hiện tại không
    if (newMessage.sender !== currentUserId && newMessage.recipient !== currentUserId) {
      return;
    }
    
    // Xác định ID của người đối thoại (không phải người dùng hiện tại)
    const otherPartyId = currentUserId === newMessage.sender 
                       ? newMessage.recipient 
                       : newMessage.sender;
    
    // Lưu thông tin recipient_fullname vào userInfoCache từ tin nhắn socket nếu có
    if (newMessage.recipient_fullname) {
      // Xác định ID người dùng cần lưu thông tin
      const targetUserId = currentUserId === newMessage.sender 
                         ? newMessage.recipient 
                         : newMessage.sender;
                         
      if (!chatStore.userInfoCache[targetUserId]) {
        chatStore.userInfoCache[targetUserId] = {
          user_id: targetUserId,
          fullname: newMessage.recipient_fullname,
          avatar: null
        };
      }
    }
    
    // Cập nhật lastMessages với thông tin is_read đúng
    const otherPartyIdNum = typeof otherPartyId === 'string' ? parseInt(otherPartyId, 10) : otherPartyId;
    
    // Luôn cập nhật lastMessages với tin nhắn mới (tin nhắn socket luôn mới nhất)
    chatStore.lastMessages[otherPartyIdNum] = newMessage;
    
    // Kiểm tra nếu cuộc trò chuyện này đang mở
    const isActiveConversation = chatStore.activeConversation === otherPartyId;
    
    if (isActiveConversation) {
      // Nếu đang trong cuộc trò chuyện, thêm tin nhắn vào store
      chatStore.addMessage(newMessage, otherPartyIdNum);
      
      // Nếu người dùng hiện tại là người nhận, đánh dấu tin nhắn là đã đọc
      if (currentUserId === newMessage.recipient) {
        chatStore.markMessageAsRead(newMessage.id);
        // Cập nhật lại lastMessages với is_read = true
        chatStore.lastMessages[otherPartyIdNum].is_read = true;
      }
    } else {
      // Nếu không phải cuộc trò chuyện đang mở
      // CHỈ cập nhật số lượng tin nhắn chưa đọc khi người khác gửi đến cho mình
      if (currentUserId === newMessage.recipient && currentUserId !== newMessage.sender) {
        // Cập nhật unread count mà không gọi API
        chatStore.unreadCount++;
      }
      
      // Cập nhật cuộc trò chuyện để đưa lên đầu danh sách
      chatStore.updateConversation(newMessage.sender, newMessage.recipient);
      chatStore.sortConversationToTop(newMessage);
    }
  }

  // Xử lý thông báo thông thường
  handleRegularNotification() {
    // Cập nhật số lượng thông báo chưa đọc
    this.notificationStore.fetchUnreadCount();
    
    // Nếu dropdown đang không mở, tải trước danh sách thông báo
    if (!this.notificationStore.isDropdownOpen) {
      this.notificationStore.fetchNotifications(true);
    }
  }

  // Gửi tin nhắn qua WebSocket (dùng cho debug)
  sendMessage(message) {
    if (!this.connected) {
      console.error('Không thể gửi tin nhắn: WebSocket chưa kết nối');
      return false;
    }

    try {
      if (this.useSocketIO) {
        this.socket.emit('message', message);
      } else {
        this.socket.send(JSON.stringify(message));
      }
      return true;
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn WebSocket:', error);
      return false;
    }
  }

  // Đóng kết nối WebSocket
  disconnect() {
    if (!this.socket) return;

    if (this.useSocketIO) {
      if (this.connected) {
        this.socket.disconnect();
      }
    } else {
      if (this.connected) {
        this.socket.close(1000, 'User logout'); // 1000 là mã đóng kết nối bình thường
      }
    }

    this.socket = null;
    this.connected = false;
    this.connecting = false;
  }
  
  // Mảng để lưu trữ các hàm xử lý tin nhắn
  messageHandlers = [];
  
  // Đăng ký hàm xử lý tin nhắn
  onMessage(handler) {
    if (typeof handler !== 'function') {
      console.error('onMessage handler phải là hàm');
      return;
    }
    
    // Kiểm tra xem handler đã được đăng ký chưa
    if (!this.messageHandlers.includes(handler)) {
      this.messageHandlers.push(handler);
    }
  }
  
  // Hủy đăng ký hàm xử lý tin nhắn
  offMessage(handler) {
    if (typeof handler !== 'function') {
      console.error('offMessage handler phải là hàm');
      return;
    }
    
    const index = this.messageHandlers.indexOf(handler);
    if (index !== -1) {
      this.messageHandlers.splice(index, 1);
    }
  }
}

// Tạo và export instance của SocketService
const socketService = new SocketService();
export default socketService; 