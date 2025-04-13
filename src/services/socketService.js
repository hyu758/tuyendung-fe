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
  }

  // Khởi tạo kết nối WebSocket
  init() {
    if (this.connecting || this.connected) return;
    this.connecting = true;

    // Lấy store notification
    this.notificationStore = useNotificationStore();

    try {
      // Thử kết nối với WebSocket API
      // Có hai cách định nghĩa đường dẫn WebSocket, thử cả hai để xem cái nào hoạt động
      try {
        this.socket = new WebSocket(`${SOCKET_URL}/api/ws/notifications/`);
        console.log('Thử kết nối WebSocket qua /api/ws/notifications/');
      } catch (error) {
        console.error('Lỗi kết nối đường dẫn 1, thử đường dẫn 2:', error);
        this.socket = new WebSocket(`${SOCKET_URL}/ws/notifications/`);
        console.log('Thử kết nối WebSocket qua /ws/notifications/');
      }

      // Xử lý sự kiện kết nối thành công
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.connected = true;
        this.connecting = false;
      };

      // Xử lý sự kiện khi nhận được thông báo
      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('🔔 Received WebSocket message:', data);
          
          // Xử lý các loại message
          if (data.type === 'auth_required') {
            // Nhận được yêu cầu xác thực, gửi token
            const token = localStorage.getItem('token');
            if (token) {
              console.log('Gửi token xác thực WebSocket');
              this.socket.send(JSON.stringify({
                type: 'authenticate',
                token: token
              }));
            }
          } 
          else if (data.type === 'auth_success') {
            console.log('✅ WebSocket authentication successful');
          }
          else if (data.type === 'auth_fail') {
            console.error('❌ WebSocket authentication failed');
            this.disconnect();
          }
          else if (data.type === 'new_message' || (data.data && data.data.type === 'new_message')) {
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
              created_at: messageData.created_at || new Date().toISOString()
            };
            
            console.log('💬 Tin nhắn mới được chuyển đổi:', newMessage);
            
            // Xác định người dùng hiện tại
            const currentUserId = chatStore.userInfo?.user_id;
            
            // Đảm bảo rằng người gửi hoặc người nhận tương ứng với ID cuộc trò chuyện đang mở
            const otherPartyId = currentUserId === newMessage.sender 
                                ? newMessage.recipient 
                                : newMessage.sender;
            
            console.log('ID của bên còn lại trong cuộc trò chuyện:', otherPartyId);
            console.log('So sánh với ID cuộc trò chuyện đang mở:', chatStore.activeConversation);
            
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
            
            // Hiển thị thông báo mới (chỉ khi là người nhận tin nhắn)
            if (currentUserId === newMessage.recipient) {
              this.notificationStore.showNewMessageNotification(messageData);
            }
          }
          else {
            // Nếu là thông báo notification, cập nhật UI
            console.log('🔔 Regular notification received');
            
            // Cập nhật số lượng thông báo chưa đọc
            this.notificationStore.fetchUnreadCount();
            
            // Nếu dropdown đang không mở, tải trước danh sách thông báo
            if (!this.notificationStore.isDropdownOpen) {
              this.notificationStore.fetchNotifications(true);
            }
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error, 'Raw data:', event.data);
        }
      };

      // Xử lý sự kiện đóng kết nối
      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        this.connected = false;
        this.connecting = false;
        
        // Tự động kết nối lại sau 3 giây nếu không phải là đóng có chủ ý
        if (event.code !== 1000) {
          setTimeout(() => {
            console.log('Trying to reconnect WebSocket...');
            this.init();
          }, 3000);
        }
      };

      // Xử lý lỗi
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.connecting = false;
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      this.connecting = false;
    }
  }

  // Đóng kết nối WebSocket
  disconnect() {
    if (this.socket && this.connected) {
      this.socket.close(1000, 'User logout'); // 1000 là mã đóng kết nối bình thường
      this.socket = null;
      this.connected = false;
      this.connecting = false;
    }
  }
}

// Tạo và export instance của SocketService
const socketService = new SocketService();
export default socketService; 