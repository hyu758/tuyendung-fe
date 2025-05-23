import { defineStore } from 'pinia'
import { chatService } from '../services/api'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activeConversation: null,
    messagesByUser: {}, // Lưu tin nhắn theo từng userId
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
      const userId = state.activeConversation;
      const messages = state.messagesByUser[userId] || [];
      return [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },
    hasUnreadMessages: (state) => state.unreadCount > 0
  },
  
  actions: {
    // Thêm action để lưu tin nhắn cuối cùng
    setLastMessage(userId, message) {
      this.lastMessages[userId] = message;
    },
    
    async fetchConversations() {
      this.loading = true
      this.error = null
      
      // Lấy thông tin người dùng hiện tại
      const authStore = useAuthStore()
      this.userInfo = authStore.userInfo
      
      try {
        const response = await chatService.getConversations()
        this.conversations = response.data.data
        this.loading = false
        return this.conversations
      } catch (error) {
        this.error = error.response?.data?.message || 'Không thể lấy danh sách cuộc trò chuyện'
        this.loading = false
        throw error
      }
    },
    
    async fetchLatestMessages() {
      try {
        const response = await chatService.getLatestMessages();
        
        if (response.data.status === 200 && response.data.data) {
          const latestMessages = response.data.data;
          
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
              // Xác định tên và avatar của người đối thoại (kết hợp từ các trường khác nhau)
              let otherUserName = null;
              let otherUserAvatar = null;
              
              // Lấy tên người nhận (nếu người nhận không phải là người dùng hiện tại)
              if (message.recipient !== currentUserId && message.recipient_fullname) {
                otherUserName = message.recipient_fullname;
                otherUserAvatar = message.recipient_avatar || null;
              }
              // Lấy tên người gửi (nếu người gửi không phải là người dùng hiện tại)
              else if (message.sender !== currentUserId && message.sender_fullname) {
                otherUserName = message.sender_fullname;
                otherUserAvatar = message.sender_avatar || null;
              }
              
              // Nếu đã có tên người dùng, cập nhật vào cache
              if (otherUserName) {
                // Kiểm tra avatar hợp lệ trước khi lưu
                if (otherUserAvatar) {
                  try {
                    // Bỏ qua các đường dẫn tương đối
                    if (otherUserAvatar.startsWith('src/assets/') || otherUserAvatar === '') {
                      otherUserAvatar = null;
                    } else {
                      // Thử tạo URL để kiểm tra tính hợp lệ
                      new URL(otherUserAvatar);
                    }
                  } catch (e) {
                    otherUserAvatar = null;
                  }
                }
                
                // Nếu chưa có trong cache hoặc thiếu thông tin, thêm mới
                if (!this.userInfoCache[otherUserId]) {
                  this.userInfoCache[otherUserId] = {
                    user_id: otherUserId,
                    fullname: otherUserName,
                    avatar: otherUserAvatar
                  };
                } 
                // Nếu đã có trong cache, cập nhật thông tin còn thiếu
                else {
                  // Cập nhật tên nếu thông tin hiện tại trống hoặc là "Người dùng #xxx"
                  if (!this.userInfoCache[otherUserId].fullname || 
                      this.userInfoCache[otherUserId].fullname.startsWith('Người dùng #')) {
                    this.userInfoCache[otherUserId].fullname = otherUserName;
                  }
                  
                  // Cập nhật avatar nếu thông tin hiện tại trống và avatar mới hợp lệ
                  if (!this.userInfoCache[otherUserId].avatar && otherUserAvatar) {
                    this.userInfoCache[otherUserId].avatar = otherUserAvatar;
                  }
                }
              }
              
              // Kiểm tra xem đã có tin nhắn cho người này chưa
              if (!userLatestMessages.has(otherUserId) || 
                  new Date(message.created_at) > new Date(userLatestMessages.get(otherUserId).created_at)) {
                userLatestMessages.set(otherUserId, message);
                
                // Lưu tin nhắn cuối cùng vào lastMessages
                this.lastMessages[otherUserId] = message;
              }
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
      if (this.loading && this.activeConversation === userId) {
        return [];
      }
      this.activeConversation = userId;
      if (refresh) {
        this.page = 1;
        this.hasMoreMessages = true;
        // Reset messages cho user này
        this.messagesByUser[userId] = [];
      }
      if (!this.hasMoreMessages && !refresh) return [];
      this.loading = true;
      this.error = null;
      try {
        const limit = 20;
        let allNewMessages = [];
        
        // Trước tiên tải trang 1 để xác định tổng số trang
        const firstPageResponse = await chatService.getMessages(userId, {
          page: 1,
          limit: limit
        });
        
        const firstPageMessages = firstPageResponse.data.data.results || [];
        const totalPages = firstPageResponse.data.data.total_pages || 0;
        allNewMessages = [...firstPageMessages];
        
        // Xử lý thông tin người dùng và tin nhắn cuối cùng từ trang 1
        if (firstPageMessages.length > 0) {
          const latestMsg = firstPageMessages[0];
          if (latestMsg.recipient_fullname) {
            const currentUserId = this.userInfo?.user_id;
            if (currentUserId) {
              const otherUserId = latestMsg.sender === currentUserId 
                ? latestMsg.recipient 
                : latestMsg.sender;
              if (!this.userInfoCache[otherUserId]) {
                this.userInfoCache[otherUserId] = {
                  user_id: otherUserId,
                  fullname: latestMsg.recipient_fullname,
                  avatar: null
                };
              }
            }
          }
          this.lastMessages[userId] = latestMsg;
        }
        
        // Nếu refresh = true và có trang thứ 2, tải thêm trang 2
        if (refresh && totalPages > 1) {
          try {
            const secondPageResponse = await chatService.getMessages(userId, {
              page: 2,
              limit: limit
            });
            
            const secondPageMessages = secondPageResponse.data.data.results || [];
            allNewMessages = [...allNewMessages, ...secondPageMessages];
          } catch (error) {
            console.error('Lỗi khi tải trang 2:', error);
          }
        }
        
        // Cập nhật thông tin phân trang
        this.hasMoreMessages = totalPages > 1;
        this.page = 2; // Trang tiếp theo sẽ là trang 2 (hoặc 3 nếu đã tải trang 2)
        if (refresh && totalPages > 1) {
          this.page = 3; // Đã tải trang 1 và 2, trang tiếp theo sẽ là 3
        }
        
        if (!this.messagesByUser[userId]) this.messagesByUser[userId] = [];
        if (refresh) {
          // Thay thế toàn bộ tin nhắn cũ
          this.messagesByUser[userId] = [...allNewMessages];
          this.messagesByUser[userId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
          // Thêm tin nhắn mới vào đầu danh sách hiện tại, loại bỏ trùng lặp
          const messageIds = new Set(this.messagesByUser[userId].map(msg => msg.id));
          const uniqueNewMessages = allNewMessages.filter(msg => !messageIds.has(msg.id));
          this.messagesByUser[userId] = [...this.messagesByUser[userId], ...uniqueNewMessages].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
        }
        return allNewMessages;
      } catch (error) {
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
        throw error
      }
    },
    
    async markMessageAsRead(messageId) {
      try {
        const numericMessageId = parseInt(messageId, 10);
        
        // Gọi API để đánh dấu tin nhắn là đã đọc trên server
        await chatService.markMessageAsRead(numericMessageId);
        
        // Tìm tin nhắn trong danh sách
        const messageIndex = this.messagesByUser[this.activeConversation].findIndex(message => message.id === numericMessageId);
        
        if (messageIndex !== -1) {
          // Cập nhật tin nhắn là đã đọc trong store
          this.messagesByUser[this.activeConversation][messageIndex].is_read = true;
          
          // Cập nhật tin nhắn trong lastMessages nếu cần
          const message = this.messagesByUser[this.activeConversation][messageIndex];
          const otherUserId = message.sender;
          if (this.lastMessages[otherUserId] && this.lastMessages[otherUserId].id === numericMessageId) {
            this.lastMessages[otherUserId].is_read = true;
          }
          
          // Giảm số lượng tin nhắn chưa đọc nếu tin nhắn chưa được đánh dấu là đã đọc trước đó
          if (this.unreadCount > 0) {
            this.unreadCount -= 1;
          }
        }
      } catch (error) {
        console.error('Lỗi khi đánh dấu tin nhắn đã đọc:', error);
      }
    },
    
    resetStore() {
      this.conversations = []
      this.activeConversation = null
      this.messagesByUser = {}
      this.lastMessages = {}
      this.loading = false
      this.error = null
      this.page = 1
      this.hasMoreMessages = true
      this.userInfo = null
    },
    
    resetActiveConversation() {
      // Reset các trạng thái liên quan đến cuộc trò chuyện hiện tại
      this.activeConversation = null;
      this.messagesByUser = {};
      this.page = 1;
      this.hasMoreMessages = true;
      this.loading = false;
    },
    
    async fetchUserInfo(userId) {
      // Kiểm tra cache trước khi gọi API
      if (this.userInfoCache[userId]) {
        return this.userInfoCache[userId];
      }
      
      try {
        // Gọi API để lấy thông tin người dùng
        const response = await axios.get(`/api/users/${userId}/info/`);
        
        if (response.data.status === 200) {
          const userData = response.data.data;
          
          // Kiểm tra và xử lý đường dẫn avatar cẩn thận
          if (!userData.avatar || 
              userData.avatar === null || 
              userData.avatar === undefined ||
              userData.avatar === "" ||
              userData.avatar.startsWith('src/assets/')) {
            // Nếu không có avatar hoặc đường dẫn không hợp lệ, gán giá trị null
            userData.avatar = null;
          } else {
            // Kiểm tra định dạng avatar có hợp lệ không
            try {
              new URL(userData.avatar);
              // Kiểm tra thêm định dạng ảnh phổ biến
              if (!userData.avatar.match(/\.(jpeg|jpg|gif|png|webp)$/i) &&
                  !userData.avatar.includes('cloudinary.com') &&
                  !userData.avatar.includes('res.cloudinary.com')) {
                console.warn(`Avatar URL không phải định dạng ảnh phổ biến: ${userData.avatar}`);
              }
            } catch (e) {
              console.error('Avatar URL không hợp lệ:', userData.avatar);
              userData.avatar = null;
            }
          }
          
          // Đảm bảo fullname luôn có giá trị
          if (!userData.fullname || userData.fullname.trim() === '') {
            userData.fullname = `Người dùng #${userId}`;
          }
          
          // Lưu vào cache
          this.userInfoCache[userId] = userData;
          return userData;
        }
        return null;
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        return null;
      }
    },
    
    addMessage(message) {
      const userId = this.activeConversation;
      if (!userId) return false;
      if (!this.messagesByUser[userId]) this.messagesByUser[userId] = [];
      const messageId = typeof message.id === 'string' ? parseInt(message.id, 10) : message.id;
      const existingMessageIndex = this.messagesByUser[userId].findIndex(m => {
        const mId = typeof m.id === 'string' ? parseInt(m.id, 10) : m.id;
        return mId === messageId;
      });
      if (existingMessageIndex === -1) {
        if (typeof message.created_at === 'string') {
          try {
            const date = new Date(message.created_at);
            if (!isNaN(date)) {
              message.created_at = date.toISOString();
            }
          } catch (e) {
            message.created_at = new Date().toISOString();
          }
        } else {
          message.created_at = new Date().toISOString();
        }
        this.messagesByUser[userId].push(message);
        this.messagesByUser[userId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        // Đảm bảo cuộc trò chuyện này có tin nhắn mới nhất lên đầu trong danh sách
        this.sortConversationToTop(message);
        // Cập nhật số lượng tin nhắn chưa đọc nếu cần
        if (this.userInfo && message.recipient === this.userInfo.user_id && !message.is_read) {
          this.unreadCount++;
        }
        return true;
      } else {
        return false;
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
        return;
      }
      
      // Chỉ sắp xếp nếu người dùng hiện tại là người gửi hoặc người nhận
      if (sender !== currentUserId && recipient !== currentUserId) {
        return;
      }
      
      // Xác định ID người đối thoại (không phải người dùng hiện tại)
      const otherUserId = sender === currentUserId ? recipient : sender;
      
      
      // Tìm cuộc trò chuyện tương ứng - đảm bảo tìm đúng cuộc trò chuyện
      const index = this.conversations.findIndex(conv => {
        const convSender = typeof conv.sender === 'string' ? parseInt(conv.sender, 10) : conv.sender;
        const convRecipient = typeof conv.recipient === 'string' ? parseInt(conv.recipient, 10) : conv.recipient;
        
        // Kiểm tra cả hai hướng của cuộc trò chuyện
        return (convSender === currentUserId && convRecipient === otherUserId) || 
               (convSender === otherUserId && convRecipient === currentUserId);
      });
      
      if (index > 0) {
        const conversation = this.conversations[index];
        this.conversations.splice(index, 1);
        this.conversations.unshift(conversation);
      } else if (index === -1) {
        // Nếu không tìm thấy, tạo cuộc trò chuyện mới
        const newConversation = {
          sender: currentUserId,
          recipient: otherUserId
        };
        this.conversations.unshift(newConversation);
      }
    },
    
    updateConversation(senderId, recipientId) {
      
      senderId = typeof senderId === 'string' ? parseInt(senderId, 10) : senderId;
      recipientId = typeof recipientId === 'string' ? parseInt(recipientId, 10) : recipientId;
      
      const currentUserId = this.userInfo?.user_id;
      if (!currentUserId) {
        return;
      }
      
      if (senderId !== currentUserId && recipientId !== currentUserId) {
        return;
      }
      
      // Xác định id người còn lại trong cuộc trò chuyện
      const otherUserId = (currentUserId === senderId) ? recipientId : senderId;
      
      const existingConversation = this.conversations.find(c => {
        const cSender = typeof c.sender === 'string' ? parseInt(c.sender, 10) : c.sender;
        const cRecipient = typeof c.recipient === 'string' ? parseInt(c.recipient, 10) : c.recipient;
        
        return (cSender === otherUserId && cRecipient === currentUserId) || 
               (cSender === currentUserId && cRecipient === otherUserId);
      });
      
      if (!existingConversation) {
        const newConversation = {
          sender: currentUserId,
          recipient: otherUserId
        };
        this.conversations.unshift(newConversation);
      } else {
        
        const index = this.conversations.indexOf(existingConversation);
        if (index > 0) {
          this.conversations.splice(index, 1);
          this.conversations.unshift(existingConversation);
        }
      }
      
      if (this.activeConversation !== otherUserId) {
        this.fetchMessages(otherUserId, false).then(messages => {
          if (messages && messages.length > 0) {
          }
        }).catch(error => {
          console.error(`Lỗi khi tải tin nhắn mới nhất cho ${otherUserId}:`, error);
        });
      }
    }
  }
}) 