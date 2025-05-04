import { io } from 'socket.io-client';
import { useNotificationStore } from '../stores/notification';
import { useChatStore } from '../stores/chat';

// URL của WebSocket API - sử dụng giá trị mặc định nếu biến môi trường không tồn tại
const API_URL = import.meta.env.VITE_APP_API_URL || 'http://127.0.0.1:8000';
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
      console.log('WebSocket đã kết nối hoặc đang kết nối, không khởi tạo lại');
      return;
    }

    this.connecting = true;
    this.connectionAttempts++;
    console.log(`Đang thử kết nối WebSocket lần thứ ${this.connectionAttempts}`);

    // Lấy store notification
    this.notificationStore = useNotificationStore();

    // Chỉ sử dụng WebSocket thuần, không dùng Socket.IO
    this.useSocketIO = false;
    this.connectWebSocket();
  }

  // Kết nối socket.io - Không sử dụng nữa
  connectSocketIO() {
    if (!this.enableSocketIO) {
      console.log('Socket.IO đã bị vô hiệu hóa');
      this.connecting = false;
      this.tryAlternativeConnection();
      return;
    }
    
    try {
      console.log('Đang thử kết nối qua Socket.IO tới:', API_URL);
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
        console.log('Socket.IO connected với ID:', this.socket.id);
        this.connected = true;
        this.connecting = false;
        this.connectionAttempts = 0;
        
        // Xác thực kết nối
        this.authenticateConnection();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected, reason:', reason);
        this.connected = false;
        this.connecting = false;
        
        if (reason !== 'io client disconnect') {
          setTimeout(() => {
            console.log('Đang thử kết nối lại Socket.IO...');
            this.init();
          }, 3000);
        }
      });

      this.socket.on('message', (data) => {
        console.log('Nhận tin nhắn qua Socket.IO:', data);
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
      console.log('Đang thử kết nối qua WebSocket thuần tới:', `${SOCKET_URL}/api/ws/notifications/`);
      this.useSocketIO = false;
      
      try {
        this.socket = new WebSocket(`${SOCKET_URL}/api/ws/notifications/`);
        console.log('Đang kết nối WebSocket qua /api/ws/notifications/');
      } catch (error) {
        console.error('Lỗi kết nối đường dẫn 1, thử đường dẫn 2:', error);
        this.socket = new WebSocket(`${SOCKET_URL}/ws/notifications/`);
        console.log('Đang kết nối WebSocket qua /ws/notifications/');
      }

      // Xử lý sự kiện kết nối thành công
      this.socket.onopen = () => {
        console.log('WebSocket kết nối thành công!');
        this.connected = true;
        this.connecting = false;
        this.connectionAttempts = 0;
        
        // Xác thực kết nối
        this.authenticateConnection();
      };

      // Xử lý sự kiện khi nhận được thông báo
      this.socket.onmessage = (event) => {
        console.log('WebSocket raw data:', event.data);
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('Lỗi xử lý dữ liệu WebSocket:', error, 'Raw data:', event.data);
        }
      };

      // Xử lý sự kiện đóng kết nối
      this.socket.onclose = (event) => {
        console.log('WebSocket bị đóng với mã:', event.code, 'Lý do:', event.reason);
        this.connected = false;
        this.connecting = false;
        
        // Tự động kết nối lại sau 3 giây nếu không phải là đóng có chủ ý
        if (event.code !== 1000) {
          setTimeout(() => {
            console.log('Đang thử kết nối lại WebSocket...');
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
      console.log('Đã vượt quá số lần thử kết nối tối đa');
      return;
    }

    if (this.useSocketIO && this.enableSocketIO) {
      console.log('Socket.IO thất bại, chuyển sang WebSocket thuần');
      this.connectWebSocket();
    } else {
      console.log('WebSocket thuần thất bại, không thử Socket.IO');
      // Chỉ tăng số lần thử và thử lại WebSocket
      this.connectionAttempts++;
      
      // Thử lại WebSocket sau 3 giây
      setTimeout(() => {
        console.log('Thử kết nối lại WebSocket...');
        this.connectWebSocket();
      }, 3000);
    }
  }

  // Xác thực kết nối
  authenticateConnection() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Không có token, không thể xác thực WebSocket');
      return;
    }

    console.log('Đang gửi token để xác thực WebSocket');
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
    console.log('🔔 Đã nhận tin nhắn WebSocket:', data);
    
    // Xử lý các loại message
    if (data.type === 'auth_required') {
      this.authenticateConnection();
    } 
    else if (data.type === 'auth_success') {
      console.log('✅ WebSocket xác thực thành công');
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
        console.log(`Gọi ${this.messageHandlers.length} message handlers đã đăng ký`);
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
      console.log('🔔 Nhận thông báo thông thường');
      this.handleRegularNotification();
    }
  }

  // Xử lý tin nhắn mới
  handleNewMessage(data) {
    // Lấy dữ liệu tin nhắn đúng cách (có thể nằm trong data.data hoặc trực tiếp trong data)
    const messageData = data.data?.type === 'new_message' ? data.data : data;
    console.log('📩 New message received via WebSocket. Original data:', data);
    console.log('📩 Extracted message data:', messageData);
    
    // Lấy chatStore
    const chatStore = useChatStore();
    console.log('Current chatStore state:', {
      activeConversation: chatStore.activeConversation,
      messagesCount: chatStore.messages.length,
      userInfo: chatStore.userInfo
    });
    
    // Cập nhật số lượng tin nhắn chưa đọc
    chatStore.fetchUnreadMessages();
    
    // Tạo đối tượng tin nhắn từ dữ liệu nhận được
    const newMessage = {
      id: parseInt(messageData.message_id, 10),
      sender: parseInt(messageData.sender_id, 10),
      recipient: parseInt(messageData.recipient_id, 10),
      content: messageData.content,
      is_read: messageData.is_read || false,
      created_at: messageData.created_at || new Date().toISOString(),
      recipient_fullname: messageData.recipient_fullname || null
    };
    
    console.log('💬 Tin nhắn mới được chuyển đổi:', newMessage);
    
    // Xác định người dùng hiện tại
    const currentUserId = chatStore.userInfo?.user_id;
    if (!currentUserId) {
      console.error('Không có thông tin người dùng hiện tại, không thể xử lý tin nhắn');
      return;
    }
    
    // Kiểm tra xem tin nhắn có liên quan đến người dùng hiện tại không
    if (newMessage.sender !== currentUserId && newMessage.recipient !== currentUserId) {
      console.log('❌ Tin nhắn không liên quan đến người dùng hiện tại, bỏ qua');
      return;
    }
    
    // Đảm bảo rằng người gửi hoặc người nhận tương ứng với ID cuộc trò chuyện đang mở
    const otherPartyId = currentUserId === newMessage.sender 
                       ? newMessage.recipient 
                       : newMessage.sender;
    
    console.log('ID của bên còn lại trong cuộc trò chuyện:', otherPartyId);
    console.log('So sánh với ID cuộc trò chuyện đang mở:', chatStore.activeConversation);
    
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
        console.log(`Đã lưu thông tin người dùng ${targetUserId} vào cache từ socket: ${newMessage.recipient_fullname}`);
      }
    }
    
    // Kiểm tra tin nhắn thuộc về cuộc trò chuyện nào (từ người gửi hoặc người nhận) rồi mới cập nhật
    // Cập nhật lastMessages trước khi thêm tin nhắn vào store
    if (newMessage.sender === currentUserId || newMessage.recipient === currentUserId) {
      // Chắc chắn otherPartyId là số
      const otherPartyIdNum = typeof otherPartyId === 'string' ? parseInt(otherPartyId, 10) : otherPartyId;
      
      // Kiểm tra xem có tin nhắn cũ trong lastMessages không
      const oldMessage = chatStore.lastMessages[otherPartyIdNum];
      
      // Chỉ cập nhật nếu tin nhắn mới hơn tin nhắn cũ
      if (!oldMessage || new Date(newMessage.created_at) > new Date(oldMessage.created_at)) {
        chatStore.lastMessages[otherPartyIdNum] = newMessage;
        console.log(`✅ Đã cập nhật tin nhắn cuối cùng trong lastMessages cho người dùng ${otherPartyIdNum}: "${newMessage.content}"`);
      } else {
        console.log(`⚠️ Không cập nhật lastMessages vì tin nhắn cũ hơn tin nhắn hiện tại cho ${otherPartyIdNum}`);
      }
    } else {
      console.log('❌ Tin nhắn không thuộc về người dùng hiện tại, không cập nhật lastMessages');
    }
    
    // Thêm tin nhắn mới vào store - bất kể tin nhắn của ai
    const result = chatStore.addMessage(newMessage);
    console.log('Kết quả thêm tin nhắn:', result);
    
    // Kiểm tra nếu cuộc trò chuyện này đang mở
    const isActiveConversation = chatStore.activeConversation === otherPartyId;
    console.log('Đây có phải là cuộc trò chuyện đang mở không?', isActiveConversation);
    
    if (isActiveConversation) {
      console.log('✅ Đây là cuộc trò chuyện đang mở, đánh dấu là đã đọc');
      
      // Nếu người dùng hiện tại là người nhận, đánh dấu tin nhắn là đã đọc
      if (currentUserId === newMessage.recipient) {
        console.log('👁️ Người dùng hiện tại là người nhận, đánh dấu tin nhắn đã đọc');
        chatStore.markMessageAsRead(newMessage.id);
      }
    } else {
      console.log('❌ Đây không phải cuộc trò chuyện đang mở');
      
      // Cập nhật danh sách cuộc trò chuyện
      chatStore.updateConversation(newMessage.sender, newMessage.recipient);
      
      // Đưa cuộc trò chuyện lên đầu
      chatStore.sortConversationToTop(newMessage);
    }
    
    // Luôn tải tin nhắn mới nhất cho tất cả cuộc trò chuyện để cập nhật giao diện
    // Lưu ý: Điều này đảm bảo danh sách cuộc trò chuyện luôn có tin nhắn mới nhất
    setTimeout(() => {
      console.log('🔄 Đang tải tin nhắn mới nhất cho tất cả cuộc trò chuyện sau khi nhận tin nhắn mới');
      chatStore.fetchLatestMessages().then(() => {
        console.log('✅ Đã cập nhật tin nhắn mới nhất cho tất cả cuộc trò chuyện');
      });
    }, 500);
    
    // Hiển thị thông báo mới (chỉ khi là người nhận tin nhắn)
    if (currentUserId === newMessage.recipient) {
      this.notificationStore.showNewMessageNotification(messageData);
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
      console.log('Đã gửi tin nhắn qua WebSocket:', message);
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
        console.log('Đóng kết nối Socket.IO');
        this.socket.disconnect();
      }
    } else {
      if (this.connected) {
        console.log('Đóng kết nối WebSocket');
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
      console.log('Đăng ký message handler mới');
      this.messageHandlers.push(handler);
    } else {
      console.log('Message handler đã được đăng ký trước đó');
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
      console.log('Hủy đăng ký message handler');
      this.messageHandlers.splice(index, 1);
    } else {
      console.log('Không tìm thấy message handler để hủy đăng ký');
    }
  }
}

// Tạo và export instance của SocketService
const socketService = new SocketService();
export default socketService; 