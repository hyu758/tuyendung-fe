import { io } from 'socket.io-client';
import { useNotificationStore } from '../stores/notification';

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
          console.log('Received WebSocket message:', data);
          
          // Xử lý các loại message
          if (data.type === 'auth_required') {
            // Nhận được yêu cầu xác thực, gửi token
            const token = localStorage.getItem('token');
            if (token) {
              this.socket.send(JSON.stringify({
                type: 'authenticate',
                token: token
              }));
            }
          } 
          else if (data.type === 'auth_success') {
            console.log('WebSocket authentication successful');
          }
          else if (data.type === 'auth_fail') {
            console.error('WebSocket authentication failed');
            this.disconnect();
          }
          else {
            // Nếu là thông báo notification, cập nhật UI
            // Cập nhật số lượng thông báo chưa đọc
            this.notificationStore.fetchUnreadCount();
            
            // Nếu dropdown đang không mở, tải trước danh sách thông báo
            if (!this.notificationStore.isDropdownOpen) {
              this.notificationStore.fetchNotifications(true);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
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