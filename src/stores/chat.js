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
    userInfoCache: {} // Cache thông tin người dùng
  }),
  
  getters: {
    hasConversations: (state) => state.conversations.length > 0,
    sortedMessages: (state) => {
      const userId = state.activeConversation;
      const messages = state.messagesByUser[userId] || [];
      return [...messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    },
    hasUnreadMessages: (state) => state.unreadCount > 0,
    
    // Getter để lấy thông tin người dùng hiện tại từ authStore
    currentUser() {
      const authStore = useAuthStore();
      return authStore.userInfo;
    }
  },
  
  actions: {
    // Thêm action để lưu tin nhắn cuối cùng
    setLastMessage(userId, message) {
      this.lastMessages[userId] = message;
    },
    
    async fetchConversations() {
      this.loading = true
      this.error = null
      
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
          
          // Xử lý từng tin nhắn từ API
          latestMessages.forEach(messageItem => {
            const currentUserId = this.currentUser?.user_id;
            if (!currentUserId) return;
            
            // Sử dụng conversation_partner_id từ API thay vì tự tính toán
            const conversationPartnerId = messageItem.conversation_partner_id;
            const conversationPartnerName = messageItem.conversation_partner_fullname;
            
            if (!conversationPartnerId) return;
            
            // Lưu thông tin người đối thoại vào cache
            if (conversationPartnerName && !this.userInfoCache[conversationPartnerId]) {
              this.userInfoCache[conversationPartnerId] = {
                user_id: conversationPartnerId,
                fullname: conversationPartnerName,
                avatar: null
              };
            } else if (conversationPartnerName && this.userInfoCache[conversationPartnerId]) {
              // Cập nhật tên nếu chưa có hoặc tên hiện tại không tốt
              if (!this.userInfoCache[conversationPartnerId].fullname || 
                  this.userInfoCache[conversationPartnerId].fullname.startsWith('Người dùng #')) {
                this.userInfoCache[conversationPartnerId].fullname = conversationPartnerName;
              }
            }
            
            // Tạo đối tượng tin nhắn để lưu vào lastMessages
            const messageForLastMessages = {
              id: messageItem.id,
              sender: messageItem.sender,
              recipient: messageItem.recipient,
              content: messageItem.content,
              is_read: messageItem.is_read,
              created_at: messageItem.created_at,
              recipient_fullname: messageItem.recipient_fullname,
              sender_fullname: messageItem.sender_fullname
            };
            
            // Lưu tin nhắn cuối cùng vào lastMessages với key là conversation_partner_id
            if (!this.lastMessages[conversationPartnerId] || 
                new Date(messageItem.created_at) > new Date(this.lastMessages[conversationPartnerId].created_at)) {
              this.lastMessages[conversationPartnerId] = messageForLastMessages;
            }
          });
          
          return latestMessages;
        }
        return [];
      } catch (error) {
        console.error('Lỗi khi lấy tin nhắn mới nhất cho tất cả cuộc trò chuyện:', error);
        return [];
      }
    },
    
    async fetchMessages(userId, refresh = false) {
      if (this.loading && this.activeConversation === userId && !refresh) {
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
        
        if (refresh) {
          // Khi refresh, tải trang 1 để xác định tổng số trang
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
              const currentUserId = this.currentUser?.user_id;
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
          if (totalPages > 1) {
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
          
          // Cập nhật thông tin phân trang cho refresh
          this.hasMoreMessages = totalPages > 2; // Còn tin nhắn cũ hơn nếu có hơn 2 trang
          this.page = 3; // Trang tiếp theo sẽ là trang 3 (đã tải trang 1 và 2)
          
        } else {
          // Khi cuộn lên tải thêm tin nhắn cũ hơn
          console.log(`📜 [fetchMessages] Tải trang ${this.page} cho user ${userId}`);
          
          const response = await chatService.getMessages(userId, {
            page: this.page,
            limit: limit
          });
          
          const messages = response.data.data.results || [];
          const totalPages = response.data.data.total_pages || 0;
          allNewMessages = [...messages];
          
          // Cập nhật thông tin phân trang
          this.hasMoreMessages = this.page < totalPages;
          this.page += 1; // Tăng page cho lần tải tiếp theo
          
          console.log(`📊 [fetchMessages] Tải được ${messages.length} tin nhắn, còn ${this.hasMoreMessages ? 'có' : 'không'} tin nhắn cũ hơn`);
        }
        
        if (!this.messagesByUser[userId]) this.messagesByUser[userId] = [];
        if (refresh) {
          // Thay thế toàn bộ tin nhắn cũ
          this.messagesByUser[userId] = [...allNewMessages];
          this.messagesByUser[userId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        } else {
          // Thêm tin nhắn cũ hơn vào đầu danh sách hiện tại, loại bỏ trùng lặp
          const messageIds = new Set(this.messagesByUser[userId].map(msg => msg.id));
          const uniqueNewMessages = allNewMessages.filter(msg => !messageIds.has(msg.id));
          // Thêm tin nhắn cũ hơn vào đầu danh sách
          this.messagesByUser[userId] = [...uniqueNewMessages, ...this.messagesByUser[userId]].sort(
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
      console.log(`📤 [DEBUG] Sending message to ${recipientId}: "${content.substring(0, 50)}..."`);
      
      this.loading = true
      this.error = null
      
      try {
        const response = await chatService.sendMessage(recipientId, content)
        const newMessage = response.data.data
        
        // Thêm tin nhắn mới vào danh sách
        const addResult = this.addMessage(newMessage);
        console.log(`📥 [DEBUG] Add message result: ${addResult}`);
        
        // Lưu tin nhắn mới nhất vào lastMessages
        this.lastMessages[recipientId] = newMessage;
        
        // Đưa cuộc trò chuyện này lên đầu danh sách
        this.sortConversationToTop(newMessage)
        
        this.loading = false
        
        return newMessage
      } catch (error) {
        console.error(`❌ [DEBUG] Error sending message:`, error);
        this.error = error.response?.data?.message || 'Không thể gửi tin nhắn'
        this.loading = false
        throw error
      }
    },
    
    async fetchUnreadMessages() {
      try {
        const response = await chatService.getUnreadMessages()
        this.unreadCount = response.data.data.total || 0
        console.log('📊 [Chat Store] Fetched unread count from API:', this.unreadCount)
        return response.data.data.results
      } catch (error) {
        console.error('Lỗi khi fetch unread messages:', error)
        throw error
      }
    },
    
    // Method mới: chỉ cập nhật số lượng unread mà không fetch tin nhắn
    async updateUnreadCount() {
      try {
        const response = await chatService.getUnreadMessages()
        const newUnreadCount = response.data.data.total || 0
        console.log('📊 [Chat Store] Updated unread count:', this.unreadCount, '->', newUnreadCount)
        this.unreadCount = newUnreadCount
        return newUnreadCount
      } catch (error) {
        console.error('Lỗi khi cập nhật unread count:', error)
        return this.unreadCount
      }
    },
    
    async markMessageAsRead(messageId) {
      try {
        const numericMessageId = parseInt(messageId, 10);
        
        // Gọi API để đánh dấu tin nhắn là đã đọc trên server
        await chatService.markMessageAsRead(numericMessageId);
        
        // Tìm tin nhắn trong danh sách
        if (this.activeConversation && this.messagesByUser[this.activeConversation]) {
          const messageIndex = this.messagesByUser[this.activeConversation].findIndex(message => message.id === numericMessageId);
          
          if (messageIndex !== -1) {
            // Cập nhật tin nhắn là đã đọc trong store
            this.messagesByUser[this.activeConversation][messageIndex].is_read = true;
            
            // Tìm tin nhắn trong lastMessages để cập nhật
            const currentUserId = this.currentUser?.user_id;
            if (currentUserId) {
              // Tìm cuộc trò chuyện có tin nhắn này trong lastMessages
              for (const [conversationId, lastMsg] of Object.entries(this.lastMessages)) {
                if (lastMsg.id === numericMessageId) {
                  // Cập nhật trạng thái đã đọc trong lastMessages
                  this.lastMessages[conversationId].is_read = true;
                  console.log('📖 [markMessageAsRead] Cập nhật lastMessages cho conversation:', conversationId);
                  break;
                }
              }
            }
            
            // Giảm số lượng tin nhắn chưa đọc nếu tin nhắn chưa được đánh dấu là đã đọc trước đó
            if (this.unreadCount > 0) {
              this.unreadCount -= 1;
              console.log('📉 [markMessageAsRead] Giảm unread count:', this.unreadCount);
            }
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
    },
    
    resetActiveConversation() {
      // Reset các trạng thái liên quan đến cuộc trò chuyện hiện tại
      this.activeConversation = null;
      this.messagesByUser = {};
      this.page = 1;
      this.hasMoreMessages = true;
      this.loading = false;
    },
    
    
    addMessage(message, targetConversationId = null) {
      // Xác định cuộc trò chuyện mà tin nhắn thuộc về
      const currentUserId = this.currentUser?.user_id;
      if (!currentUserId) {
        console.error('❌ [addMessage] Không có thông tin người dùng hiện tại');
        return false;
      }
      
      // Xác định ID của người đối thoại trong tin nhắn
      const messageSender = typeof message.sender === 'string' ? parseInt(message.sender, 10) : message.sender;
      const messageRecipient = typeof message.recipient === 'string' ? parseInt(message.recipient, 10) : message.recipient;
      
      console.log(`🔍 [DEBUG] addMessage called:`, {
        messageId: message.id,
        sender: messageSender,
        recipient: messageRecipient,
        content: message.content?.substring(0, 50) + '...',
        currentUserId,
        activeConversation: this.activeConversation,
        targetConversationId
      });
      
      // Kiểm tra tin nhắn có liên quan đến người dùng hiện tại không
      if (messageSender !== currentUserId && messageRecipient !== currentUserId) {
        console.warn('❌ Tin nhắn không liên quan đến người dùng hiện tại, bỏ qua');
        return false;
      }
      
      // Xác định ID của cuộc trò chuyện (ID của người đối thoại)
      let conversationId;
      if (targetConversationId) {
        conversationId = targetConversationId;
      } else {
        conversationId = messageSender === currentUserId ? messageRecipient : messageSender;
      }
      
      console.log(`🎯 [DEBUG] Conversation ID calculated: ${conversationId}`);
      
      // Nếu không có active conversation, cho phép thêm tin nhắn
      // Hoặc nếu tin nhắn thuộc cuộc trò chuyện đang mở
      // Hoặc nếu được chỉ định rõ targetConversationId
      if (targetConversationId || !this.activeConversation || this.activeConversation === conversationId) {
        const finalConversationId = targetConversationId || conversationId;
        
        if (!this.messagesByUser[finalConversationId]) this.messagesByUser[finalConversationId] = [];
        
        const messageId = typeof message.id === 'string' ? parseInt(message.id, 10) : message.id;
        const existingMessageIndex = this.messagesByUser[finalConversationId].findIndex(m => {
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
          
          this.messagesByUser[finalConversationId].push(message);
          this.messagesByUser[finalConversationId].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          
          console.log(`✅ [DEBUG] Tin nhắn đã được thêm vào cuộc trò chuyện ${finalConversationId}. Tổng số tin nhắn: ${this.messagesByUser[finalConversationId].length}`);
          
          // Đảm bảo cuộc trò chuyện này có tin nhắn mới nhất lên đầu trong danh sách
          this.sortConversationToTop(message);
          
          // Cập nhật số lượng tin nhắn chưa đọc nếu cần
          if (this.currentUser && 
              message.recipient === this.currentUser.user_id && 
              message.sender !== this.currentUser.user_id && 
              !message.is_read) {
            this.unreadCount++;
          }
          return true;
        } else {
          console.log(`🔄 [DEBUG] Tin nhắn ${messageId} đã tồn tại trong cuộc trò chuyện ${finalConversationId}`);
          return false;
        }
      } else {
        console.log(`⚠️ [DEBUG] Tin nhắn thuộc cuộc trò chuyện ${conversationId}, không phải cuộc trò chuyện đang mở ${this.activeConversation}`);
        return false;
      }
    },
    
    // Thêm hàm mới để force thêm tin nhắn vào một cuộc trò chuyện cụ thể
    addMessageToConversation(message, conversationId) {
      return this.addMessage(message, conversationId);
    },
    
    // Phương thức mới để đưa cuộc trò chuyện lên đầu danh sách
    sortConversationToTop(message) {
      // Chỉ áp dụng nếu có danh sách cuộc trò chuyện
      if (!this.conversations || this.conversations.length === 0) return;
      
      // Xác định các bên tham gia cuộc trò chuyện
      const sender = typeof message.sender === 'string' ? parseInt(message.sender, 10) : message.sender;
      const recipient = typeof message.recipient === 'string' ? parseInt(message.recipient, 10) : message.recipient;
      
      // Kiểm tra xem tin nhắn có liên quan đến người dùng hiện tại không
      const currentUserId = this.currentUser?.user_id;
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
      
      const currentUserId = this.currentUser?.user_id;
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
      
    }
  }
}) 