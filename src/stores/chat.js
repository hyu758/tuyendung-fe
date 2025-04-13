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
    userInfo: null
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
        console.log(`Tải tin nhắn trang ${this.page} cho cuộc trò chuyện ${userId}`)
        const response = await chatService.getMessages(userId, {
          page: this.page,
          limit: 20 // Số lượng tin nhắn mỗi lần tải
        })
        
        console.log('Phản hồi từ API messages:', response.data)
        const newMessages = response.data.data.results
        
        if (refresh) {
          this.messages = newMessages
        } else {
          // Kết hợp tin nhắn mới với tin nhắn hiện tại, loại bỏ trùng lặp
          const messageIds = new Set(this.messages.map(msg => msg.id))
          const uniqueNewMessages = newMessages.filter(msg => !messageIds.has(msg.id))
          this.messages = [...uniqueNewMessages, ...this.messages]
        }
        
        console.log('Số lượng tin nhắn sau khi tải:', this.messages.length)
        this.page += 1
        this.hasMoreMessages = this.page <= response.data.data.total_pages
        this.loading = false
        
        return newMessages
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
      console.log(`🔖 Đánh dấu tin nhắn #${messageId} là đã đọc`);
      
      try {
        // Chuyển đổi messageId sang số nếu cần
        const numericMessageId = typeof messageId === 'string' ? parseInt(messageId, 10) : messageId;
        
        // Tìm tin nhắn trong danh sách
        const messageIndex = this.messages.findIndex(msg => Number(msg.id) === numericMessageId);
        
        if (messageIndex !== -1) {
          console.log(`Tìm thấy tin nhắn cần đánh dấu ở vị trí ${messageIndex}`);
          
          // Cập nhật tin nhắn thành đã đọc trong store
          this.messages[messageIndex].is_read = true;
          
          // Cập nhật lên server
          const response = await chatService.markMessageAsRead(numericMessageId);
          console.log('Kết quả đánh dấu đã đọc:', response);
          
          // Giảm số lượng tin nhắn chưa đọc nếu cần
          if (this.unreadCount > 0) {
            this.unreadCount -= 1;
          }
          
          return true;
        } else {
          console.log(`⚠️ Không tìm thấy tin nhắn với ID ${messageId} để đánh dấu đã đọc`);
          return false;
        }
      } catch (error) {
        console.error('❌ Lỗi khi đánh dấu tin nhắn đã đọc:', error);
        return false;
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
    
    async fetchUserInfo(userId) {
      try {
        // Gọi API để lấy thông tin người dùng
        const response = await axios.get(`/api/users/${userId}/info/`);
        
        if (response.data.status === 200) {
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
        
        // Sắp xếp tin nhắn theo thời gian
        this.messages = [...this.messages].sort((a, b) => 
          new Date(a.created_at) - new Date(b.created_at)
        );
        
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