import { defineStore } from 'pinia'
import { chatService } from '../services/api'
import axios from 'axios'
import { useAuthStore } from './auth'

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [],
    activeConversation: null,
    messages: [],
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
        console.log('Đang tải tin nhắn mới nhất cho tất cả cuộc trò chuyện')
        const response = await chatService.getLatestMessages()
        
        if (response.data.status === 200 && response.data.data) {
          const latestMessages = response.data.data
          console.log('Đã tải xong tin nhắn mới nhất:', latestMessages)
          
          // Thêm tất cả tin nhắn mới nhất vào store
          latestMessages.forEach(message => {
            this.addMessage(message)
          })
          
          return latestMessages
        }
        return []
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn mới nhất cho tất cả cuộc trò chuyện:', error)
        return []
      }
    },
    
    async fetchMessages(userId, refresh = false) {
      console.log('fetchMessages được gọi với userId:', userId, 'refresh:', refresh)
      
      if (refresh) {
        this.page = 1
        this.hasMoreMessages = true
        this.messages = []
      }
      
      if (!this.hasMoreMessages && !refresh) return []
      
      this.loading = true
      this.error = null
      this.activeConversation = userId
      
      try {
        // Số trang cần tải ban đầu khi refresh
        const initialPages = refresh ? 3 : 1
        let allNewMessages = []
        let totalPages = 0
        
        // Tải nhiều trang nếu là refresh - luôn lấy tin nhắn mới nhất
        for (let i = 0; i < initialPages; i++) {
          const currentPage = refresh ? i + 1 : this.page
          
          console.log(`Tải tin nhắn trang ${currentPage} cho cuộc trò chuyện ${userId}`)
          const response = await chatService.getMessages(userId, {
            page: currentPage,
            limit: 20 // Tăng số lượng tin nhắn mỗi lần tải để đảm bảo đủ 30 tin nhắn mới nhất
          })
          
          console.log(`Phản hồi từ API messages page ${currentPage}:`, response.data)
          const pageMessages = response.data.data.results
          allNewMessages = [...allNewMessages, ...pageMessages]
          
          // Cập nhật tổng số trang
          totalPages = response.data.data.total_pages
          this.hasMoreMessages = currentPage < totalPages
          
          // Nếu đã hết trang thì dừng vòng lặp
          if (currentPage >= totalPages) {
            console.log(`Đã tải hết tất cả tin nhắn (${totalPages} trang)`)
            break
          }
          
          // Nếu đây là lần refresh và chưa tải hết số trang cần thiết, tiếp tục vòng lặp
          if (refresh && i < initialPages - 1) {
            continue
          } else {
            // Cập nhật page cho lần tải tiếp theo
            this.page = currentPage + 1
            break
          }
        }
        
        if (refresh) {
          // Nếu là refresh, thay thế toàn bộ tin nhắn
          this.messages = allNewMessages
          // Cập nhật page cho lần tải tiếp theo
          this.page = Math.min(initialPages + 1, totalPages + 1)
        } else {
          // Nếu không phải refresh, thêm tin nhắn mới vào đầu danh sách hiện tại
          // Kết hợp tin nhắn mới với tin nhắn hiện tại, loại bỏ trùng lặp
          const messageIds = new Set(this.messages.map(msg => msg.id))
          const uniqueNewMessages = allNewMessages.filter(msg => !messageIds.has(msg.id))
          this.messages = [...uniqueNewMessages, ...this.messages]
          
          // Cập nhật page cho lần tải tiếp theo
          this.page += 1
        }
        
        console.log('Số lượng tin nhắn sau khi tải:', this.messages.length)
        this.loading = false
        
        return allNewMessages
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn:', error)
        this.error = error.response?.data?.message || 'Không thể lấy tin nhắn'
        this.loading = false
        throw error
      }
    },
    
    async fetchLatestMessage(userId) {
      try {
        console.log(`Tải tin nhắn mới nhất cho cuộc trò chuyện ${userId}`);
        const response = await chatService.getMessages(userId, {
          page: 1,
          limit: 1 // Chỉ lấy 1 tin nhắn mới nhất
        });
        
        if (response.data.data.results && response.data.data.results.length > 0) {
          return response.data.data.results;
        }
        return [];
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn mới nhất:', error);
        return [];
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
        
        // Cập nhật danh sách cuộc trò chuyện 
        // (Sẽ tự động được gọi trong addMessage nên không cần gọi ở đây)
        
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
      const sender = message.sender;
      const recipient = message.recipient;
      
      // Tìm cuộc trò chuyện tương ứng
      const index = this.conversations.findIndex(conv => {
        const convSender = typeof conv.sender === 'string' ? parseInt(conv.sender, 10) : conv.sender;
        const convRecipient = typeof conv.recipient === 'string' ? parseInt(conv.recipient, 10) : conv.recipient;
        
        return (convSender === sender && convRecipient === recipient) || 
               (convSender === recipient && convRecipient === sender);
      });
      
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
        console.log('Tạo cuộc trò chuyện mới và đưa lên đầu danh sách');
        const newConversation = {
          sender: sender,
          recipient: recipient
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
          sender: senderId,
          recipient: recipientId
        };
        this.conversations.push(newConversation);
        console.log('Đã thêm cuộc trò chuyện mới vào store:', newConversation);
      } else {
        console.log('Cuộc trò chuyện đã tồn tại trong store:', existingConversation);
      }
      
      // Cập nhật lại danh sách cuộc trò chuyện từ server
      this.fetchConversations();
      
      // Nếu cuộc hội thoại này chưa là cuộc hội thoại đang mở, 
      // tải tin nhắn mới nhất để hiển thị trong danh sách
      if (this.activeConversation !== otherUserId) {
        // Tải tin nhắn mới nhất của cuộc hội thoại này
        this.fetchLatestMessage(otherUserId).then(messages => {
          // Nếu có tin nhắn mới, đảm bảo nó có trong danh sách tin nhắn trong store 
          // để computed property có thể sử dụng dữ liệu này
          if (messages && messages.length > 0) {
            const message = messages[0];
            this.addMessage(message);
          }
        });
      }
    }
  }
}) 