import { defineStore } from 'pinia'
import { chatService } from '../services/api'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    lastMessages: {}, // Map lưu tin nhắn cuối cùng của mỗi cuộc trò chuyện
    loading: false,
    error: null,
    unreadCount: 0,
    page: 1,
    hasMoreMessages: true,
    userInfo: null,
    userInfoCache: {} // Cache thông tin người dùng
  }),
  
  getters: {
    hasConversations: (state) => state.conversations.length > 0,
    sortedMessages: (state) => {
      return [...state.messages].sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
      )
    },
    hasUnreadMessages: (state) => state.unreadCount > 0
  },
  
  actions: {
    // Thêm action để lưu tin nhắn cuối cùng
    setLastMessage(userId, message) {
      this.lastMessages[userId] = message;
      console.log(`Đã lưu tin nhắn cuối cùng cho người dùng ${userId}:`, message.content);
    },
    
    async fetchConversations() {
      this.loading = true
      this.error = null
      
      // Lấy thông tin người dùng hiện tại
      const authStore = useAuthStore()
      this.userInfo = authStore.userInfo
      
      try {
        console.log('Đang tải danh sách cuộc trò chuyện')
        const response = await chatService.getConversations()
        this.conversations = response.data.data
        console.log('Đã tải xong danh sách cuộc trò chuyện:', this.conversations)
        this.loading = false
        return this.conversations
      } catch (error) {
        console.error('Lỗi khi lấy danh sách cuộc trò chuyện:', error)
        this.error = error.response?.data?.message || 'Không thể lấy danh sách cuộc trò chuyện'
        this.loading = false
        throw error
      }
    },
    
    async fetchLatestMessages() {
      try {
        console.log('Đang tải tin nhắn mới nhất cho tất cả cuộc trò chuyện');
        const response = await chatService.getLatestMessages();
        
        if (response.data.status === 200 && response.data.data) {
          const latestMessages = response.data.data;
          console.log('Đã tải xong tin nhắn mới nhất:', latestMessages);
          
          // Tạo map để lưu tin nhắn mới nhất cho mỗi người dùng
          const userLatestMessages = new Map();
          
          // Lọc tin nhắn cho mỗi người gửi/nhận
          latestMessages.forEach(message => {
            const currentUserId = this.userInfo?.user_id;
            if (!currentUserId) return;
            
            // Xác định ID của người đối thoại (không phải người dùng hiện tại)
            const otherUserId = message.sender === currentUserId 
              ? message.recipient 
              : message.sender;
              
            // Chỉ xử lý tin nhắn liên quan đến người dùng hiện tại
            if (message.sender === currentUserId || message.recipient === currentUserId) {
              console.log(`Xử lý tin nhắn cuối cùng cho cuộc trò chuyện với ${otherUserId}: "${message.content}"`);
              
              // Lưu thông tin recipient_fullname vào userInfoCache nếu chưa có
              if (message.recipient_fullname && message.recipient !== currentUserId) {
                // Nếu người nhận không phải là người dùng hiện tại, lưu thông tin người nhận
                if (!this.userInfoCache[message.recipient]) {
                  this.userInfoCache[message.recipient] = {
                    user_id: message.recipient,
                    fullname: message.recipient_fullname,
                    avatar: null
                  };
                  console.log(`Đã lưu thông tin người dùng ${message.recipient} vào cache: ${message.recipient_fullname}`);
                }
              } else if (message.recipient_fullname && message.sender !== currentUserId) {
                // Nếu người gửi không phải là người dùng hiện tại, dùng thông tin này cho người gửi
                if (!this.userInfoCache[message.sender]) {
                  this.userInfoCache[message.sender] = {
                    user_id: message.sender,
                    fullname: message.recipient_fullname,
                    avatar: null
                  };
                  console.log(`Đã lưu thông tin người dùng ${message.sender} vào cache: ${message.recipient_fullname}`);
                }
              }
              
              // Kiểm tra xem đã có tin nhắn cho người này chưa
              if (!userLatestMessages.has(otherUserId) || 
                  new Date(message.created_at) > new Date(userLatestMessages.get(otherUserId).created_at)) {
                userLatestMessages.set(otherUserId, message);
                
                // Lưu tin nhắn cuối cùng vào lastMessages
                this.lastMessages[otherUserId] = message;
                console.log(`✅ Đã cập nhật tin nhắn cuối cùng cho ${otherUserId}: "${message.content}"`);
              }
            } else {
              console.log(`Bỏ qua tin nhắn không liên quan tới người dùng ${currentUserId}:`, message);
            }
          });
          
          // Thêm các tin nhắn đã lọc vào store
          userLatestMessages.forEach(message => {
            this.addMessage(message);
          });
          
          return Array.from(userLatestMessages.values());
        }
        return [];
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn mới nhất cho tất cả cuộc trò chuyện:', error);
        return [];
      }
    },
    
    async fetchMessages(userId, refresh = false) {
      console.log('fetchMessages được gọi với userId:', userId, 'refresh:', refresh);
      
      // Nếu đang tải tin nhắn cho người dùng này, bỏ qua để tránh gọi nhiều lần
      if (this.loading && this.activeConversation === userId) {
        console.log(`Đang tải tin nhắn cho ${userId}, bỏ qua yêu cầu trùng lặp`);
        return [];
      }
      
      // Đặt activeConversation trước để tránh các cuộc gọi song song khác
      this.activeConversation = userId;
      
      if (refresh) {
        // Đặt về trang 1 và đánh dấu có thể tải thêm
        this.page = 1;
        this.hasMoreMessages = true;
        
        // Khi refresh, không xóa tin nhắn ngay lập tức để giữ UI
        // Tin nhắn cũ sẽ được thay thế sau khi có dữ liệu mới
      }
      
      if (!this.hasMoreMessages && !refresh) return [];
      
      this.loading = true;
      this.error = null;
      
      try {
        // Số trang cần tải trong lần đầu tiên (nếu refresh)
        const initialPages = refresh ? 2 : 1;
        const limit = 20; // Số lượng tin nhắn mỗi trang
        
        // Mảng chứa tất cả tin nhắn mới
        let allNewMessages = [];
        let hasMorePagesAvailable = true;
        
        // Tải nhiều trang cùng một lúc nếu là refresh
        const fetchPromises = [];
        
        for (let i = 0; i < initialPages && hasMorePagesAvailable; i++) {
          const currentPage = refresh ? i + 1 : this.page;
          
          // Thêm promise vào mảng
          fetchPromises.push(
            chatService.getMessages(userId, {
              page: currentPage,
              limit: limit
            }).then(response => {
              const pageMessages = response.data.data.results || [];
              const totalPages = response.data.data.total_pages || 0;
              
              console.log(`Đã tải ${pageMessages.length} tin nhắn từ trang ${currentPage}/${totalPages}`);
              
              // Cập nhật thông tin lastMessages nếu đây là trang đầu tiên
              if (currentPage === 1 && pageMessages.length > 0) {
                const latestMsg = pageMessages[0]; // Tin nhắn mới nhất ở đầu
                
                // Lưu thông tin recipient_fullname vào userInfoCache nếu có
                if (latestMsg.recipient_fullname) {
                  const currentUserId = this.userInfo?.user_id;
                  if (currentUserId) {
                    // Xác định người dùng cần lưu thông tin
                    const otherUserId = latestMsg.sender === currentUserId 
                      ? latestMsg.recipient 
                      : latestMsg.sender;
                    
                    if (!this.userInfoCache[otherUserId]) {
                      this.userInfoCache[otherUserId] = {
                        user_id: otherUserId,
                        fullname: latestMsg.recipient_fullname,
                        avatar: null
                      };
                      console.log(`Đã lưu thông tin người dùng ${otherUserId} vào cache: ${latestMsg.recipient_fullname}`);
                    }
                  }
                }
                
                // Cập nhật tin nhắn mới nhất
                this.lastMessages[userId] = latestMsg;
                console.log('Cập nhật tin nhắn cuối cùng:', latestMsg.content);
              }
              
              // Kiểm tra xem còn trang nào tiếp theo không
              hasMorePagesAvailable = currentPage < totalPages;
              
              // Cập nhật hasMoreMessages cho lần tải tiếp theo
              if (currentPage === this.page) {
                this.hasMoreMessages = hasMorePagesAvailable;
                // Tăng page lên 1 cho lần tải tiếp theo
                this.page = currentPage + 1;
              }
              
              return pageMessages;
            }).catch(error => {
              console.error(`Lỗi khi tải trang ${currentPage}:`, error);
              return [];
            })
          );
        }
        
        // Đợi tất cả các promise hoàn thành
        const resultsArray = await Promise.all(fetchPromises);
        
        // Gộp tất cả tin nhắn từ các trang
        allNewMessages = resultsArray.flat();
        
        if (refresh) {
          // Nếu là refresh, thay thế danh sách tin nhắn cũ
          // Tạo một Set để theo dõi ID tin nhắn
          const messageIds = new Set(allNewMessages.map(msg => msg.id));
          
          // Giữ lại những tin nhắn cũ mà không có trong danh sách mới (nếu cần)
          const oldMessagesToKeep = this.messages.filter(msg => !messageIds.has(msg.id));
          
          // Kết hợp tin nhắn mới và tin nhắn cũ cần giữ lại
          this.messages = [...allNewMessages, ...oldMessagesToKeep];
          
          // Sắp xếp lại theo thời gian tăng dần (cũ nhất lên đầu)
          this.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
          // Nếu không phải refresh, thêm tin nhắn mới vào đầu danh sách hiện tại
          // Loại bỏ trùng lặp
          const messageIds = new Set(this.messages.map(msg => msg.id));
          const uniqueNewMessages = allNewMessages.filter(msg => !messageIds.has(msg.id));
          
          // Thêm vào và sắp xếp lại
          this.messages = [...this.messages, ...uniqueNewMessages].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        }
        
        console.log('Số lượng tin nhắn sau khi tải:', this.messages.length);
        
        return allNewMessages;
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error);
        this.error = error.response?.data?.message || 'Không thể lấy tin nhắn';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async sendMessage(recipientId, content) {
      this.loading = true
      this.error = null
      
      try {
        const response = await chatService.sendMessage(recipientId, content)
        const newMessage = response.data.data
        
        // Thêm tin nhắn mới vào danh sách
        this.addMessage(newMessage)
        
        // Lưu tin nhắn mới nhất vào lastMessages
        this.lastMessages[recipientId] = newMessage;
        
        // Đưa cuộc trò chuyện này lên đầu danh sách
        this.sortConversationToTop(newMessage)
        
        this.loading = false
        
        return newMessage
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn:', error)
        this.error = error.response?.data?.message || 'Không thể gửi tin nhắn'
        this.loading = false
        throw error
      }
    },
    
    async fetchUnreadMessages() {
      try {
        const response = await chatService.getUnreadMessages()
        this.unreadCount = response.data.data.total || 0
        return response.data.data.results
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn chưa đọc:', error)
        throw error
      }
    },
    
    async markMessageAsRead(messageId) {
      try {
        console.log('Đánh dấu tin nhắn đã đọc:', messageId);
        
        // Chuyển đổi messageId sang số nếu cần
        const numericMessageId = parseInt(messageId, 10);
        
        // Gọi API để đánh dấu tin nhắn là đã đọc trên server
        await chatService.markMessageAsRead(numericMessageId);
        console.log('Đã đánh dấu tin nhắn đã đọc trên server:', numericMessageId);
        
        // Tìm tin nhắn trong danh sách
        const messageIndex = this.messages.findIndex(message => message.id === numericMessageId);
        console.log('Vị trí tin nhắn trong danh sách:', messageIndex);
        
        if (messageIndex !== -1) {
          // Cập nhật tin nhắn là đã đọc trong store
          this.messages[messageIndex].is_read = true;
          console.log('Đã cập nhật trạng thái tin nhắn trong store');
          
          // Cập nhật tin nhắn trong lastMessages nếu cần
          const message = this.messages[messageIndex];
          const otherUserId = message.sender;
          if (this.lastMessages[otherUserId] && this.lastMessages[otherUserId].id === numericMessageId) {
            this.lastMessages[otherUserId].is_read = true;
          }
          
          // Giảm số lượng tin nhắn chưa đọc nếu tin nhắn chưa được đánh dấu là đã đọc trước đó
          if (this.unreadCount > 0) {
            this.unreadCount -= 1;
            console.log('Đã giảm số lượng tin nhắn chưa đọc:', this.unreadCount);
          }
        }
      } catch (error) {
        console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
      }
    },
    
    resetStore() {
      this.conversations = []
      this.activeConversation = null
      this.messages = []
      this.lastMessages = {}
      this.loading = false
      this.error = null
      this.page = 1
      this.hasMoreMessages = true
      this.userInfo = null
    },
    
    resetActiveConversation() {
      console.log('Reset activeConversation từ:', this.activeConversation, 'thành null');
      // Reset các trạng thái liên quan đến cuộc trò chuyện hiện tại
      this.activeConversation = null;
      this.messages = [];
      this.page = 1;
      this.hasMoreMessages = true;
      this.loading = false;
    },
    
    async fetchUserInfo(userId) {
      // Kiểm tra cache trước khi gọi API
      if (this.userInfoCache[userId]) {
        console.log(`Lấy thông tin người dùng ${userId} từ cache`);
        return this.userInfoCache[userId];
      }
      
      try {
        // Gọi API để lấy thông tin người dùng
        console.log(`Gọi API lấy thông tin người dùng ${userId}`);
        const response = await axios.get(`/api/users/${userId}/info/`);
        
        if (response.data.status === 200) {
          // Lưu vào cache
          this.userInfoCache[userId] = response.data.data;
          return response.data.data;
        }
        return null;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return null;
      }
    },
    
    addMessage(message) {
      // Lưu ý: đảm bảo id message là số
      const messageId = typeof message.id === 'string' ? parseInt(message.id, 10) : message.id;
      
      // Kiểm tra xem tin nhắn có tồn tại chưa
      const existingMessageIndex = this.messages.findIndex(m => {
        const mId = typeof m.id === 'string' ? parseInt(m.id, 10) : m.id;
        return mId === messageId;
      });
      
      console.log('Đang thêm tin nhắn mới vào store. ID:', messageId, 'Đã tồn tại:', existingMessageIndex !== -1);
      console.log('Tin nhắn hiện tại trong store:', this.messages.length);
      
      if (existingMessageIndex === -1) {
        // Đảm bảo created_at là đối tượng Date
        if (typeof message.created_at === 'string') {
          try {
            const date = new Date(message.created_at);
            if (!isNaN(date)) {
              message.created_at = date.toISOString();
            }
          } catch (e) {
            console.error('Lỗi chuyển đổi thời gian tin nhắn:', e);
            message.created_at = new Date().toISOString();
          }
        } else {
          message.created_at = new Date().toISOString();
        }
        
        // Thêm tin nhắn mới vào danh sách
        this.messages.push(message);
        console.log('Đã thêm tin nhắn mới vào store. Số lượng tin nhắn hiện tại:', this.messages.length);
        
        // Cập nhật tin nhắn cuối cùng nếu cần
        const currentUserId = this.userInfo?.user_id;
        if (currentUserId) {
          // Xác định ID của người đối thoại trong cuộc trò chuyện này
          const otherUserId = message.sender === currentUserId
            ? message.recipient
            : message.sender;
          
          // Đảm bảo otherUserId là số
          const otherUserIdNum = typeof otherUserId === 'string' ? parseInt(otherUserId, 10) : otherUserId;
          
          // Chỉ cập nhật lastMessages nếu tin nhắn thuộc về cuộc trò chuyện giữa currentUser và otherUser
          const isPartOfConversation = 
            (message.sender === currentUserId && message.recipient === otherUserIdNum) ||
            (message.sender === otherUserIdNum && message.recipient === currentUserId);
          
          if (isPartOfConversation) {
            console.log(`Kiểm tra cập nhật tin nhắn cuối cùng cho ${otherUserIdNum}:`, message.content);
            
            // Lấy tin nhắn cũ (nếu có)
            const oldMessage = this.lastMessages[otherUserIdNum];
            
            // Cập nhật lastMessages nếu tin nhắn này mới hơn hoặc chưa có tin nhắn cũ
            if (!oldMessage || new Date(message.created_at) > new Date(oldMessage.created_at)) {
              this.lastMessages[otherUserIdNum] = message;
              console.log(`✅ Đã cập nhật tin nhắn cuối cùng cho ${otherUserIdNum}:`, message.content);
            } else {
              console.log(`⚠️ Không cập nhật lastMessages vì tin nhắn cũ hơn tin nhắn hiện tại cho ${otherUserIdNum}`);
            }
          } else {
            console.log(`⚠️ Tin nhắn không thuộc về cuộc trò chuyện giữa ${currentUserId} và ${otherUserIdNum}:`, message);
          }
        }
        
        // Đảm bảo cuộc trò chuyện này có tin nhắn mới nhất lên đầu trong danh sách
        this.sortConversationToTop(message);
        
        // Cập nhật số lượng tin nhắn chưa đọc nếu cần
        if (this.userInfo && message.recipient === this.userInfo.user_id && !message.is_read) {
          this.unreadCount++;
          console.log('Tăng số lượng tin nhắn chưa đọc lên:', this.unreadCount);
        }
        
        return true; // Đã thêm tin nhắn mới
      } else {
        console.log('Tin nhắn đã tồn tại trong store, không thêm lại');
        return false; // Không thêm vì đã tồn tại
      }
    },
    
    // Phương thức mới để đưa cuộc trò chuyện lên đầu danh sách
    sortConversationToTop(message) {
      // Chỉ áp dụng nếu có danh sách cuộc trò chuyện
      if (!this.conversations || this.conversations.length === 0) return;
      
      // Xác định các bên tham gia cuộc trò chuyện
      const sender = typeof message.sender === 'string' ? parseInt(message.sender, 10) : message.sender;
      const recipient = typeof message.recipient === 'string' ? parseInt(message.recipient, 10) : message.recipient;
      
      // Kiểm tra xem tin nhắn có liên quan đến người dùng hiện tại không
      const currentUserId = this.userInfo?.user_id;
      if (!currentUserId) {
        console.log('Không có thông tin người dùng hiện tại, không thể sắp xếp cuộc trò chuyện');
        return;
      }
      
      // Chỉ sắp xếp nếu người dùng hiện tại là người gửi hoặc người nhận
      if (sender !== currentUserId && recipient !== currentUserId) {
        console.log('Tin nhắn không liên quan đến người dùng hiện tại, không sắp xếp lại cuộc trò chuyện');
        return;
      }
      
      // Xác định ID người đối thoại (không phải người dùng hiện tại)
      const otherUserId = sender === currentUserId ? recipient : sender;
      
      console.log(`Tìm cuộc trò chuyện với người dùng ${otherUserId} để đưa lên đầu`);
      
      // Tìm cuộc trò chuyện tương ứng - đảm bảo tìm đúng cuộc trò chuyện
      const index = this.conversations.findIndex(conv => {
        const convSender = typeof conv.sender === 'string' ? parseInt(conv.sender, 10) : conv.sender;
        const convRecipient = typeof conv.recipient === 'string' ? parseInt(conv.recipient, 10) : conv.recipient;
        
        // Kiểm tra cả hai hướng của cuộc trò chuyện
        return (convSender === currentUserId && convRecipient === otherUserId) || 
               (convSender === otherUserId && convRecipient === currentUserId);
      });
      
      console.log(`Vị trí cuộc trò chuyện trong danh sách: ${index}`);
      
      // Nếu tìm thấy, đưa lên đầu danh sách
      if (index > 0) {
        // Lấy ra cuộc trò chuyện cần di chuyển
        const conversation = this.conversations[index];
        
        // Xóa khỏi vị trí hiện tại
        this.conversations.splice(index, 1);
        
        // Thêm vào đầu danh sách
        this.conversations.unshift(conversation);
        
        console.log('Đã đưa cuộc trò chuyện lên đầu danh sách');
      } else if (index === -1) {
        // Nếu không tìm thấy, tạo cuộc trò chuyện mới
        console.log('Không tìm thấy cuộc trò chuyện, tạo mới và đưa lên đầu danh sách');
        const newConversation = {
          sender: currentUserId,
          recipient: otherUserId
        };
        this.conversations.unshift(newConversation);
      }
    },
    
    updateConversation(senderId, recipientId) {
      console.log('updateConversation được gọi với:', { senderId, recipientId });
      
      // Đảm bảo IDs là số
      senderId = typeof senderId === 'string' ? parseInt(senderId, 10) : senderId;
      recipientId = typeof recipientId === 'string' ? parseInt(recipientId, 10) : recipientId;
      
      // Kiểm tra xem cuộc trò chuyện đã tồn tại trong danh sách chưa
      const currentUserId = this.userInfo?.user_id;
      console.log('currentUserId:', currentUserId);
      
      if (!currentUserId) {
        console.log('Chưa có thông tin người dùng, không thể cập nhật cuộc trò chuyện');
        return;
      }
      
      // Kiểm tra xem tin nhắn có liên quan đến người dùng hiện tại không
      if (senderId !== currentUserId && recipientId !== currentUserId) {
        console.log('Tin nhắn không liên quan đến người dùng hiện tại, không cập nhật cuộc trò chuyện');
        return;
      }
      
      // Xác định id người còn lại trong cuộc trò chuyện
      const otherUserId = (currentUserId === senderId) ? recipientId : senderId;
      console.log('otherUserId:', otherUserId);
      
      // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
      const existingConversation = this.conversations.find(c => {
        const cSender = typeof c.sender === 'string' ? parseInt(c.sender, 10) : c.sender;
        const cRecipient = typeof c.recipient === 'string' ? parseInt(c.recipient, 10) : c.recipient;
        
        return (cSender === otherUserId && cRecipient === currentUserId) || 
               (cSender === currentUserId && cRecipient === otherUserId);
      });
      
      if (!existingConversation) {
        // Nếu chưa tồn tại, thêm cuộc trò chuyện mới vào danh sách
        const newConversation = {
          sender: currentUserId, // Luôn đặt người dùng hiện tại là sender để dễ quản lý
          recipient: otherUserId
        };
        this.conversations.unshift(newConversation); // Thêm vào đầu danh sách
        console.log('Đã thêm cuộc trò chuyện mới vào store và đặt lên đầu:', newConversation);
      } else {
        console.log('Cuộc trò chuyện đã tồn tại trong store:', existingConversation);
        
        // Đưa cuộc trò chuyện này lên đầu danh sách nếu cần
        const index = this.conversations.indexOf(existingConversation);
        if (index > 0) {
          // Xóa khỏi vị trí hiện tại
          this.conversations.splice(index, 1);
          // Thêm vào đầu danh sách
          this.conversations.unshift(existingConversation);
          console.log('Đã đưa cuộc trò chuyện lên đầu danh sách');
        }
      }
      
      // Cập nhật lại danh sách cuộc trò chuyện từ server (không cần thiết mỗi lần, có thể bỏ để tối ưu)
      // this.fetchConversations();
      
      // Nếu cuộc hội thoại này chưa là cuộc hội thoại đang mở, 
      // tải tin nhắn mới nhất để hiển thị trong danh sách
      if (this.activeConversation !== otherUserId) {
        // Tải tin nhắn mới nhất của cuộc hội thoại này (trang 1, limit 1)
        this.fetchMessages(otherUserId, false).then(messages => {
          if (messages && messages.length > 0) {
            // Đã cập nhật lastMessages trong fetchMessages rồi
            console.log(`Đã cập nhật tin nhắn mới nhất cho cuộc trò chuyện với ${otherUserId}`);
          }
        }).catch(error => {
          console.error(`Lỗi khi tải tin nhắn mới nhất cho ${otherUserId}:`, error);
        });
      }
    }
  }
}) 