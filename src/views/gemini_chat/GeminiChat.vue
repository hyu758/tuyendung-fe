<template>
  <div class="gemini-chat-container">
    <!-- Mobile view -->
    <div class="h-full md:hidden">
      <!-- Mobile: Chỉ danh sách sessions -->
      <div v-if="!showMobileChat" class="h-full flex flex-col bg-white">
        <div class="py-4 px-4 border-b border-gray-100 bg-white">
          <div class="flex items-center justify-between mb-3">
            <h2 class="text-xl font-semibold text-gray-800">JobHub AI</h2>
            <button @click="createNewChat" class="mobile-new-chat-btn">
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto">
          <div v-if="isLoadingSessions" class="p-6 text-center">
            <i class="fas fa-circle-notch fa-spin text-indigo-500 text-2xl"></i>
            <p class="mt-3 text-gray-500">Đang tải danh sách...</p>
          </div>
          
          <div v-else-if="chatSessions.length === 0" class="p-6 text-center">
            <i class="fas fa-robot text-gray-300 text-5xl"></i>
            <p class="mt-3 text-gray-500">Chưa có cuộc trò chuyện nào</p>
            <button @click="createNewChat" class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg">
              Bắt đầu trò chuyện
            </button>
          </div>
          
          <template v-else>
            <div 
              v-for="session in chatSessions"
              :key="session.id"
              class="mobile-session-item"
              :class="{ 
                'active': currentSession?.id === session.id
              }"
              @click="openMobileChat(session.id)"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="w-12 h-12 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                  <i class="fas fa-robot"></i>
                </div>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-center mb-1">
                  <h3 class="text-base font-medium truncate text-gray-900">
                    {{ session.title }}
                  </h3>
                  <span class="text-sm text-gray-500">
                    {{ formatDate(session.updated_at) }}
                  </span>
                </div>
                <p class="text-sm truncate text-gray-500">
                  {{ getSessionPreview(session) }}
                </p>
              </div>
              
              <div class="ml-2">
                <i class="fas fa-chevron-right text-gray-400"></i>
              </div>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Mobile: Chat view fullscreen -->
      <div v-else class="h-full flex flex-col bg-white">
        <!-- Header với nút back -->
        <div class="py-3 px-4 border-b border-gray-100 flex items-center bg-white shadow-sm">
          <button @click="closeMobileChat" class="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i class="fas fa-arrow-left text-gray-600"></i>
          </button>
          <div class="flex items-center flex-1">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center overflow-hidden mr-3">
              <i class="fas fa-robot text-indigo-600"></i>
            </div>
            <div>
              <h3 class="font-medium text-gray-800">JobHub AI</h3>
              <p class="text-xs text-gray-500">Trợ lý tuyển dụng thông minh</p>
            </div>
          </div>
        </div>
        
        <!-- Messages container -->
        <div 
          class="flex-1 p-4 overflow-y-auto flex flex-col relative bg-gray-50" 
          ref="messagesContainer"
        >
          <div v-if="!currentSession" class="my-auto text-center py-12">
            <i class="fas fa-robot text-gray-300 text-5xl mb-3"></i>
            <p class="mt-2 text-gray-500">Bắt đầu cuộc trò chuyện với AI!</p>
          </div>
          
          <template v-else>
            <div class="flex flex-col space-y-3">
              <div v-for="(message, index) in currentSession.messages" :key="index" 
                  :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
                <div class="message-avatar">
                  <i :class="[message.role === 'user' ? 'fas fa-user' : 'fas fa-robot', 'avatar-icon']"></i>
                </div>
                <div class="message-content">
                  <div class="message-sender">{{ message.role === 'user' ? 'Bạn' : 'JobHub AI' }}</div>
                  <div class="message-text" v-html="formatMessage(message.content)"></div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
              
              <div v-if="isTyping" class="message bot-message">
                <div class="message-avatar">
                  <i class="fas fa-robot avatar-icon"></i>
                </div>
                <div class="message-content">
                  <div class="message-sender">JobHub AI</div>
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        
        <!-- Chat input -->
        <div class="message-input-container">
          <textarea
            v-model="message"
            @keydown.enter.prevent="sendMessage"
            placeholder="Nhập tin nhắn của bạn..."
            rows="1"
            ref="messageInput"
            class="message-input"
            :disabled="isLoading || !isAuthenticated"
          ></textarea>
          <button
            @click="sendMessage"
            class="send-button"
            :disabled="isLoading || !message || !isAuthenticated"
          >
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
        
        <div v-if="!isAuthenticated" class="auth-prompt">
          <p class="text-sm">Vui lòng <router-link to="/login" class="text-indigo-600 hover:underline">đăng nhập</router-link> để sử dụng JobHub AI</p>
        </div>
      </div>
    </div>
    
    <!-- Desktop view -->
    <div class="h-full hidden md:flex md:flex-col bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Desktop header -->
      <div class="chat-header flex-shrink-0">
        <h1 class="text-2xl font-bold">Trợ lý tuyển dụng thông minh</h1>
        <div class="flex items-center space-x-2">
          <span v-if="isLoading" class="text-sm text-gray-500">Đang xử lý...</span>
          <button @click="createNewChat" class="new-chat-btn">
            <i class="fas fa-plus-circle mr-1"></i> Cuộc trò chuyện mới
          </button>
        </div>
      </div>

      <div class="chat-layout flex-1">
        <!-- Desktop sidebar -->
        <div class="chat-sidebar">
          <div class="sidebar-header">
            <h2 class="text-lg font-semibold">Lịch sử trò chuyện</h2>
          </div>
          <div v-if="isLoadingSessions" class="flex justify-center py-4">
            <div class="loader"></div>
          </div>
          <div v-else class="chat-sessions">
            <div 
              v-for="session in chatSessions" 
              :key="session.id" 
              :class="['chat-session-item group', { active: currentSession?.id === session.id, 'new_chat': session.isNew }]"
              @click="loadChatSession(session.id)"
            >
              <div class="flex items-center w-full justify-between">
                <div class="truncate flex-1">
                  <div class="flex items-center">
                    <i class="fas fa-comment-dots mr-2 text-indigo-600"></i>
                    <span class="truncate">{{ session.title }}</span>
                  </div>
                </div>
                <div class="actions opacity-0 group-hover:opacity-100">
                  <button 
                    v-if="currentSession?.id === session.id"
                    @click.stop="openEditTitleDialog(session)" 
                    class="edit-title-btn text-gray-500 hover:text-indigo-600"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatDate(session.updated_at) }}
              </div>
            </div>
            <div v-if="chatSessions.length === 0" class="py-4 text-center text-gray-500">
              Chưa có lịch sử trò chuyện
            </div>
          </div>
        </div>

        <!-- Khu vực hiển thị tin nhắn -->
        <div class="chat-content">
          <div ref="messagesContainer" class="messages-container">
            <div v-if="!currentSession" class="empty-chat">
              <div class="empty-chat-content">
                <div class="icon-container">
                  <i class="fas fa-robot text-3xl md:text-5xl text-indigo-600 mb-4"></i>
                </div>
                <h3 class="text-lg md:text-xl font-bold mb-2">Trợ lý tuyển dụng thông minh</h3>
                <p class="text-sm md:text-base text-gray-600 mb-4 px-4 md:px-0">
                  Hỏi bất cứ điều gì về việc tìm kiếm việc làm, viết CV, phỏng vấn hoặc đăng tin tuyển dụng.
                </p>
                <div class="example-questions">
                  <button @click="setMessage('Làm thế nào để viết một CV hiệu quả?')" class="example-question">
                    Làm thế nào để viết một CV hiệu quả?
                  </button>
                  <button @click="setMessage('Giúp tôi chuẩn bị phỏng vấn cho vị trí developer')" class="example-question">
                    Giúp tôi chuẩn bị phỏng vấn cho vị trí developer
                  </button>
                  <button @click="setMessage('Tìm kiếm việc làm ở Hà Nội')" class="example-question">
                    Tìm kiếm việc làm ở Hà Nội
                  </button>
                </div>
              </div>
            </div>
            
            <template v-else>
              <div v-for="(message, index) in currentSession.messages" :key="index" 
                  :class="['message', message.role === 'user' ? 'user-message' : 'bot-message']">
                <div class="message-avatar">
                  <i :class="[message.role === 'user' ? 'fas fa-user' : 'fas fa-robot', 'avatar-icon']"></i>
                </div>
                <div class="message-content">
                  <div class="message-sender">{{ message.role === 'user' ? 'Bạn' : 'JobHub AI' }}</div>
                  <div class="message-text" v-html="formatMessage(message.content)"></div>
                  <div class="message-time">{{ formatTime(message.timestamp) }}</div>
                </div>
              </div>
              
              <div v-if="isTyping" class="message bot-message">
                <div class="message-avatar">
                  <i class="fas fa-robot avatar-icon"></i>
                </div>
                <div class="message-content">
                  <div class="message-sender">JobHub AI</div>
                  <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Input để nhập tin nhắn -->
          <div class="message-input-container">
            <textarea
              v-model="message"
              @keydown.enter.prevent="sendMessage"
              placeholder="Nhập tin nhắn của bạn..."
              rows="1"
              ref="messageInput"
              class="message-input"
              :disabled="isLoading || !isAuthenticated"
            ></textarea>
            <button
              @click="sendMessage"
              class="send-button"
              :disabled="isLoading || !message || !isAuthenticated"
            >
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          
          <div v-if="!isAuthenticated" class="auth-prompt">
            <p class="text-sm md:text-base">Vui lòng <router-link to="/login" class="text-indigo-600 hover:underline">đăng nhập</router-link> để sử dụng JobHub AI</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Hộp thoại chỉnh sửa tiêu đề -->
    <div v-if="showEditTitleDialog" class="edit-title-dialog">
      <div class="edit-title-content">
        <div class="edit-title-header">
          <h2>Đổi tên phiên chat</h2>
          <button @click="cancelEditTitle" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="edit-title-body">
          <input 
            type="text" 
            v-model="editedTitle" 
            placeholder="Nhập tiêu đề mới"
            class="edit-title-input"
            @keydown.enter="updateChatTitle"
          />
          <div v-if="editTitleError" class="text-red-500 text-sm mt-1">{{ editTitleError }}</div>
        </div>
        <div class="edit-title-footer">
          <button @click="cancelEditTitle" class="cancel-btn">Hủy</button>
          <button @click="updateChatTitle" class="save-btn" :disabled="isUpdatingTitle">
            <span v-if="isUpdatingTitle">Đang lưu...</span>
            <span v-else>Lưu</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import * as marked from 'marked';
import DOMPurify from 'dompurify';
import axios from 'axios';

export default {
  name: 'GeminiChat',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    const isAuthenticated = computed(() => authStore.isAuthenticated);
    const message = ref('');
    const isLoading = ref(false);
    const isTyping = ref(false);
    const isLoadingSessions = ref(false);
    const currentSession = ref(null);
    const chatSessions = ref([]);
    const messagesContainer = ref(null);
    const messageInput = ref(null);
    const showEditTitleDialog = ref(false);
    const editedTitle = ref('');
    const editTitleError = ref('');
    const isUpdatingTitle = ref(false);
    const showMobileChat = ref(false);
    
    // Xử lý gửi tin nhắn
    const sendMessage = async () => {
      if (!message.value.trim() || isLoading.value || !isAuthenticated.value) return;
      
      const messageText = message.value;
      message.value = '';
      
      // Nếu chưa có phiên chat, tạo phiên mới
      if (!currentSession.value) {
        try {
          await createNewChat();
        } catch (error) {
          console.error('Lỗi khi tạo phiên chat mới:', error);
          return;
        }
      }
      
      // Thêm tin nhắn người dùng vào UI
      if (!currentSession.value.messages) {
        currentSession.value.messages = [];
      }
      
      currentSession.value.messages.push({
        role: 'user',
        content: messageText,
        timestamp: new Date().toISOString()
      });
      
      // Cuộn xuống dưới cùng
      await scrollToBottom();
      
      // Hiển thị hiệu ứng typing
      isLoading.value = true;
      isTyping.value = true;
      
      // Lưu trữ session_id trước khi gửi để theo dõi thay đổi
      const currentSessionId = currentSession.value.id;
      
      try {
        const response = await axios.post('/api/gemini-chat/send-message/', {
          message: messageText,
          session_id: currentSession.value.id
        });
        
        isTyping.value = false;
        
        // Thêm phản hồi từ bot
        currentSession.value.messages.push({
          role: 'model',
          content: response.data.data.response,
          timestamp: new Date().toISOString()
        });
        
        // Nếu đây là phiên chat mới, cập nhật lại tiêu đề
        if (currentSession.value.title === "Phiên chat mới") {
          // Cập nhật danh sách phiên chat để lấy tiêu đề mới
          await fetchChatSessions();
          
          // Tìm phiên chat đã cập nhật trong danh sách
          const updatedSession = chatSessions.value.find(session => session.id === currentSessionId);
          if (updatedSession) {
            currentSession.value.title = updatedSession.title;
          }
        } else {
          // Cập nhật danh sách phiên chat
          await fetchChatSessions();
        }
      } catch (error) {
        isTyping.value = false;
        console.error('Lỗi khi gửi tin nhắn:', error);
        // Thêm thông báo lỗi vào UI
        currentSession.value.messages.push({
          role: 'model',
          content: 'Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn. Vui lòng thử lại sau.',
          timestamp: new Date().toISOString()
        });
      } finally {
        isLoading.value = false;
        await scrollToBottom();
        // Focus lại vào ô input
        if (messageInput.value) messageInput.value.focus();
      }
    };
    
    // Tạo phiên chat mới
    const createNewChat = async () => {
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      
      isLoading.value = true;
      
      try {
        const response = await axios.post('/api/gemini-chat/sessions/create/');
        currentSession.value = response.data.data;
        currentSession.value.messages = [];
        
        // Cập nhật danh sách phiên chat
        await fetchChatSessions();
      } catch (error) {
        console.error('Lỗi khi tạo phiên chat mới:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Lấy danh sách phiên chat
    const fetchChatSessions = async () => {
      if (!isAuthenticated.value) return;
      
      isLoadingSessions.value = true;
      
      try {
        const response = await axios.get('/api/gemini-chat/sessions/');
        // Sắp xếp phiên chat mới nhất lên đầu
        const sortedSessions = response.data.results.sort((a, b) => {
          return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        // Nếu đã có dữ liệu phiên chat, kiểm tra xem có phiên chat mới không
        if (chatSessions.value.length > 0) {
          // Nếu có phiên chat mới được thêm vào, thêm animation để hiển thị mượt mà
          const existingIds = chatSessions.value.map(session => session.id);
          const newSessions = sortedSessions.filter(session => !existingIds.includes(session.id));
          
          // Đánh dấu phiên chat mới để thêm hiệu ứng
          newSessions.forEach(session => {
            session.isNew = true;
          });
        }
        
        chatSessions.value = sortedSessions;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách phiên chat:', error);
      } finally {
        isLoadingSessions.value = false;
      }
    };
    
    // Tải phiên chat
    const loadChatSession = async (sessionId) => {
      if (!sessionId) {
        return;
      }
      
      isLoading.value = true;
      
      try {
        const response = await axios.get(`/api/gemini-chat/sessions/${sessionId}/`);
        currentSession.value = response.data.data;
        
        if (currentSession.value.messages) {
          currentSession.value.messages.forEach((msg, index) => {

          });
        }
        
        await scrollToBottom();
      } catch (error) {
        console.error('Lỗi khi tải phiên chat:', error);
      } finally {
        isLoading.value = false;
      }
    };
    
    // Cuộn xuống cuối cùng
    const scrollToBottom = async () => {
      await nextTick();
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
      }
    };
    
    // Format tin nhắn với markdown
    const formatMessage = (content) => {
      // Cấu hình marked để bật autolink và cho phép HTML
      marked.setOptions({
        gfm: true,
        breaks: true,
        pedantic: false,
        smartLists: true,
        smartypants: false,
        xhtml: false
      });

      // Định dạng tin nhắn bằng marked (Markdown to HTML)
      let formattedMessage = marked.parse(content);

      // Sử dụng DOMPurify để làm sạch HTML nhưng cho phép một số thẻ và thuộc tính
      const config = {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'span', 'div', 'img', 'pre', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'id', 'class', 'style', 'src', 'alt', 'title'],
        ALLOW_DATA_ATTR: true,
        ADD_ATTR: ['target'],
      };

      // Chuyển đổi các ID công việc thành liên kết
      formattedMessage = formattedMessage.replace(
        /\[ID: (\d+)\]\(job\/(\d+)\)/g,
        '<a href="/job/$2" target="_blank" rel="noopener noreferrer">Xem chi tiết</a>'
      );

      // Chuyển đổi các tiêu đề việc làm thành liên kết
      formattedMessage = formattedMessage.replace(
        /\[([^\]]+)\]\(job\/(\d+)\)/g,
        '<a href="/job/$2" target="_blank" rel="noopener noreferrer">$1</a>'
      );

      // Làm sạch HTML đầu ra
      return DOMPurify.sanitize(formattedMessage, config);
    };
    
    // Format thời gian
    const formatTime = (dateString) => {
      
      
      try {
        const date = new Date(dateString);     
        // Kiểm tra xem date có hợp lệ không
        if (isNaN(date.getTime())) {
          return 'Invalid Date';
        }
        
        const result = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return result;
      } catch (error) {
        return 'Error';
      }
    };
    
    // Format ngày
    const formatDate = (dateString) => {
      if (!dateString) return '';
      
      try {
        const date = new Date(dateString);
        
        // Kiểm tra xem date có hợp lệ không
        if (isNaN(date.getTime())) {
          console.warn('Invalid date string:', dateString);
          return '';
        }
        
        const now = new Date();
        
        // Nếu cùng ngày, hiển thị giờ
        if (date.toDateString() === now.toDateString()) {
          return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        }
        
        // Nếu trong năm hiện tại, hiển thị ngày và tháng
        if (date.getFullYear() === now.getFullYear()) {
          return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        }
        
        // Nếu khác năm, hiển thị đầy đủ
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
      } catch (error) {
        console.error('Error formatting date:', error, dateString);
        return '';
      }
    };
    
    // Đặt tin nhắn từ câu hỏi mẫu
    const setMessage = (text) => {
      message.value = text;
      if (messageInput.value) messageInput.value.focus();
    };
    
    // Lấy preview cho session
    const getSessionPreview = (session) => {
      if (!session.messages || session.messages.length === 0) {
        return 'Bắt đầu cuộc trò chuyện...';
      }
      
      const lastMessage = session.messages[session.messages.length - 1];
      const preview = lastMessage.content.length > 50 
        ? lastMessage.content.substring(0, 50) + '...'
        : lastMessage.content;
      
      return lastMessage.role === 'user' ? `Bạn: ${preview}` : preview;
    };
    
    // Theo dõi trạng thái đăng nhập
    watch(() => isAuthenticated.value, (newValue) => {
      if (newValue) {
        fetchChatSessions();
      } else {
        currentSession.value = null;
        chatSessions.value = [];
      }
    });
    
    // Khởi tạo
    onMounted(() => {
      if (isAuthenticated.value) {
        fetchChatSessions();
      }
    });
    
    // Hộp thoại chỉnh sửa tiêu đề
    const openEditTitleDialog = (session) => {
      editedTitle.value = session.title;
      showEditTitleDialog.value = true;
    };
    
    const cancelEditTitle = () => {
      showEditTitleDialog.value = false;
    };
    
    const updateChatTitle = async () => {
      if (!editedTitle.value.trim()) {
        editTitleError.value = 'Vui lòng nhập tiêu đề mới';
        return;
      }
      
      isUpdatingTitle.value = true;
      
      try {
        const response = await axios.put(`/api/gemini-chat/sessions/${currentSession.value.id}/update-title/`, {
          title: editedTitle.value
        });
        
        currentSession.value.title = editedTitle.value;
        await fetchChatSessions();
        showEditTitleDialog.value = false;
      } catch (error) {
        console.error('Lỗi khi cập nhật tiêu đề phiên chat:', error);
        editTitleError.value = 'Xin lỗi, đã xảy ra lỗi khi cập nhật tiêu đề phiên chat. Vui lòng thử lại sau.';
      } finally {
        isUpdatingTitle.value = false;
      }
    };
    
    // Toggle mobile chat
    const openMobileChat = (sessionId) => {
      showMobileChat.value = true;
      loadChatSession(sessionId);
    };
    
    const closeMobileChat = () => {
      showMobileChat.value = false;
    };
    
    return {
      message,
      isLoading,
      isTyping,
      isLoadingSessions,
      currentSession,
      chatSessions,
      messagesContainer,
      messageInput,
      isAuthenticated,
      sendMessage,
      createNewChat,
      fetchChatSessions,
      loadChatSession,
      formatMessage,
      formatTime,
      formatDate,
      setMessage,
      showEditTitleDialog,
      editedTitle,
      editTitleError,
      isUpdatingTitle,
      openEditTitleDialog,
      cancelEditTitle,
      updateChatTitle,
      showMobileChat,
      openMobileChat,
      closeMobileChat,
      getSessionPreview
    };
  }
};
</script>

<style scoped>
.gemini-chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  background-color: #f9fafb;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  min-height: 72px;
}

.new-chat-btn {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #4338ca;
}

.chat-layout {
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.chat-sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.chat-sessions {
  overflow-y: auto;
  flex: 1;
}

.chat-session-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  position: relative;
}

.chat-session-item:hover {
  background-color: #f3f4f6;
}

.chat-session-item.active {
  background-color: #eff6ff;
  border-left: 3px solid #4f46e5;
}

.chat-session-item.new_chat {
  animation: slideDown 0.5s ease forwards, highlight 2s ease;
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes highlight {
  0% { background-color: #eff6ff; }
  70% { background-color: #eff6ff; }
  100% { background-color: transparent; }
}

.chat-session-item .actions {
  opacity: 0;
  transition: opacity 0.2s;
}

.chat-session-item:hover .actions {
  opacity: 1;
}

.edit-title-btn {
  background: none;
  border: none;
  font-size: 0.875rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.edit-title-btn:hover {
  background-color: #e5e7eb;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.empty-chat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.empty-chat-content {
  max-width: 500px;
  text-align: center;
  padding: 2rem;
}

.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #f3f4f9;
  margin: 0 auto 1rem;
}

.example-questions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.example-question {
  padding: 0.75rem 1rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  text-align: left;
  transition: background-color 0.2s, border-color 0.2s;
}

.example-question:hover {
  background-color: #f9fafb;
  border-color: #d1d5db;
}

.message {
  display: flex;
  margin-bottom: 1rem;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-message {
  justify-content: flex-end;
}

.bot-message {
  justify-content: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f9;
  color: #4f46e5;
  margin-right: 0.5rem;
  flex-shrink: 0;
}

.user-message .message-avatar {
  order: 2;
  margin-right: 0;
  margin-left: 0.5rem;
  background-color: #4f46e5;
  color: white;
}

.avatar-icon {
  font-size: 18px;
}

.message-content {
  max-width: 70%;
  background-color: white;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.user-message .message-content {
  background-color: #4f46e5;
  color: white;
}

.message-sender {
  font-weight: 500;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
}

.message-text {
  line-height: 1.5;
}

.message-text :deep(p) {
  margin-bottom: 0.5rem;
}

.message-text :deep(pre) {
  background-color: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}

.message-text :deep(code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: monospace;
}

.user-message .message-text :deep(pre),
.user-message .message-text :deep(code) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #9ca3af;
  text-align: right;
  margin-top: 0.25rem;
}

.user-message .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.typing-indicator {
  display: flex;
  align-items: center;
  column-gap: 0.25rem;
  padding: 0.25rem 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #d1d5db;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

.message-input-container {
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e5e7eb;
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  resize: none;
  max-height: 120px;
  transition: border-color 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.send-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4f46e5;
  color: white;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.send-button:hover:not(:disabled) {
  background-color: #4338ca;
}

.send-button:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.auth-prompt {
  text-align: center;
  padding: 0.5rem;
  background-color: #eff6ff;
  border-top: 1px solid #dbeafe;
  color: #4b5563;
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Mobile header */
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.mobile-menu-btn,
.mobile-new-chat-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  color: #4b5563;
}

.mobile-menu-btn:hover,
.mobile-new-chat-btn:hover {
  background-color: #e5e7eb;
  color: #374151;
}

.mobile-new-chat-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.mobile-new-chat-btn:hover {
  background-color: #4338ca;
}

.mobile-close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #6b7280;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.mobile-close-btn:hover {
  background-color: #f3f4f6;
  color: #374151;
}

/* Mobile sidebar overlay */
.mobile-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.mobile-sidebar {
  width: 300px;
  max-width: 85vw;
  height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* Responsive improvements */
.chat-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.chat-sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

/* Mobile message improvements */
@media (max-width: 768px) {
  .messages-container {
    padding: 1rem 0.75rem;
  }
  
  .message {
    margin-bottom: 0.75rem;
  }
  
  .message-content {
    max-width: 85%;
    padding: 0.75rem;
    font-size: 0.9rem;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    margin-right: 0.375rem;
  }
  
  .user-message .message-avatar {
    margin-right: 0;
    margin-left: 0.375rem;
  }
  
  .avatar-icon {
    font-size: 16px;
  }
  
  .message-input-container {
    padding: 0.75rem;
    gap: 0.375rem;
  }
  
  .message-input {
    padding: 0.75rem;
    font-size: 16px; /* Prevent zoom on iOS */
    border-radius: 1rem;
  }
  
  .send-button {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .example-questions {
    padding: 0 1rem;
  }
  
  .example-question {
    padding: 1rem;
    text-align: left;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    transition: all 0.2s;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  
  .example-question:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  
  .empty-chat-content {
    padding: 1.5rem 1rem;
  }
  
  .icon-container {
    width: 60px;
    height: 60px;
    margin: 0 auto 1rem;
  }
}

/* Tablet improvements */
@media (min-width: 769px) and (max-width: 1024px) {
  .chat-sidebar {
    width: 250px;
  }
  
  .message-content {
    max-width: 75%;
  }
  
  .example-question {
    padding: 0.875rem 1rem;
    font-size: 0.95rem;
  }
}

/* Large screen improvements */
@media (min-width: 1025px) {
  .chat-sidebar {
    width: 320px;
  }
  
  .message-content {
    max-width: 70%;
  }
}

/* Improved typography scaling */
@media (max-width: 640px) {
  .mobile-header h1 {
    font-size: 1rem;
    font-weight: 600;
  }
  
  .message-sender {
    font-size: 0.8rem;
  }
  
  .message-time {
    font-size: 0.7rem;
  }
}

/* Touch improvements for mobile */
@media (max-width: 768px) {
  .chat-session-item {
    padding: 1rem;
    min-height: 60px;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .new-chat-btn,
  .mobile-menu-btn,
  .mobile-new-chat-btn,
  .mobile-close-btn {
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  /* Better scroll behavior on mobile */
  .messages-container {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
  
  .chat-sessions {
    -webkit-overflow-scrolling: touch;
  }
}

/* Edit title dialog responsive */
@media (max-width: 640px) {
  .edit-title-content {
    width: 95vw;
    margin: 1rem;
    padding: 1.5rem;
    max-height: 90vh;
  }
  
  .edit-title-input {
    padding: 0.875rem;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .edit-title-footer {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
    padding: 0.875rem 1rem;
  }
}

.edit-title-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-title-content {
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.edit-title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.edit-title-header h2 {
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af;
  cursor: pointer;
}

.edit-title-body {
  margin-bottom: 1rem;
}

.edit-title-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  resize: none;
}

.edit-title-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f3f4f6;
}

.save-btn {
  background-color: #4f46e5;
  color: white;
}

.save-btn:disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.message-text :deep(a) {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
}

.message-text :deep(a):hover {
  text-decoration: underline;
  color: #4338ca;
}

.user-message .message-text :deep(a) {
  color: #ffffff;
  text-decoration: underline;
}

.user-message .message-text :deep(a):hover {
  color: #e5e7eb;
}

/* Mobile session list styles */
.mobile-session-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f3f4f6;
  min-height: 72px;
}

.mobile-session-item:hover {
  background-color: #f9fafb;
}

.mobile-session-item.active {
  background-color: #eef2ff;
  border-left: 4px solid #4f46e5;
}
</style> 