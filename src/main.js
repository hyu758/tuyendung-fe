import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import socketService from './services/socketService'
import { useAuthStore } from './stores/auth'

// Toast Notification
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, faLock, faEnvelope, faBuilding, faBriefcase, faSearch, 
  faMapMarkerAlt, faClock, faMoneyBill, faTag, faChevronDown,
  faSignOutAlt, faPlus, faEdit, faTrash, faCheck, faTimes, faEye, faEyeSlash,
  faList, faSave, faFilter, faSort, faCalendar, faChartBar, faUsers, 
  faArrowLeft, faCheckCircle, faInfoCircle, faExclamationCircle, faTimesCircle,
  faKey, faVenusMars, faUserCircle, faBullhorn, faBell, faCog,
  faPaperPlane, faHeart, faGlobe, faGraduationCap, faBook, faExternalLinkAlt,
  faComments, faCommentDots, faComment,
  faFileInvoice,
  faPhone,
  faCloudUploadAlt,
  faFilePdf,
  faFileWord,
  faCircleNotch,
  faBookmark,
  faMoneyBillWave,
  faLocationDot,
  faIndustry,
  faUserTie,
  faLaptopHouse,
  faCoins,
  faPlusCircle,
  faBusinessTime,
  faCalendarAlt,
  faArrowRight,
  faCrown,
  faExclamationTriangle,
  faChevronRight,
  faPhoneAlt
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook, faTwitter, faLinkedin, faGithub, faGoogle,
  faFacebookF,
  faInstagram,
  faLinkedinIn
} from '@fortawesome/free-brands-svg-icons'
import {
  faHeart as farHeart
} from '@fortawesome/free-regular-svg-icons'

// Import thêm các icon cần thiết cho CriteriaForm
library.add(
  faMapMarkerAlt,
  faBriefcase, 
  faIndustry,
  faUserTie,
  faBuilding,
  faLaptopHouse,
  faMoneyBillWave,
  faCoins,
  faInfoCircle,
  faTimes,
  faSave,
  faPlusCircle,
  faChevronDown
)

// Thêm icons vào thư viện
library.add(
  faUser, faLock, faEnvelope, faBuilding, faBriefcase, faSearch, 
  faMapMarkerAlt, faClock, faMoneyBill, faTag, faChevronDown,
  faSignOutAlt, faPlus, faEdit, faTrash, faCheck, faTimes, faEye, faEyeSlash,
  faList, faSave, faFilter, faSort, faCalendar, faChartBar, faUsers,
  faFacebook, faTwitter, faLinkedin, faGithub, faGoogle,
  faArrowLeft, faCheckCircle, faInfoCircle, faExclamationCircle, faTimesCircle,
  faKey, faVenusMars, faUserCircle, faBullhorn, faBell, faCog,
  faPaperPlane, faHeart, faGlobe, faGraduationCap, faBook, faExternalLinkAlt,
  faComments, faCommentDots, faComment,
  faFileInvoice,
  faPhone,
  faCloudUploadAlt,
  faFilePdf,
  faFileWord,
  faCircleNotch,
  faBookmark,
  faMoneyBillWave,
  faLocationDot,
  faBusinessTime,
  faCalendarAlt,
  faArrowRight,
  farHeart,
  faCrown,
  faExclamationTriangle,
  faChevronRight,
  faPhoneAlt
)

// Cấu hình Axios
// Xác định baseURL dựa trên môi trường
const isProd = import.meta.env.PROD
const baseURL = isProd 
  ? import.meta.env.VITE_API_URL || 'https://api.tuyendungtlu.site' // URL mặc định nếu không có biến môi trường
  : 'http://127.0.0.1:8000'

axios.defaults.baseURL = baseURL

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor cho request
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý lỗi response toàn cầu với cơ chế refresh token tốt hơn
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Nếu lỗi không phải 401 hoặc request đã retry, reject luôn
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Nếu đang trong quá trình refresh token, thêm request vào hàng đợi
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    // Đánh dấu request này đang được retry và bắt đầu quá trình refresh
    originalRequest._retry = true
    isRefreshing = true

    try {
      // Lấy authStore để sử dụng hàm refreshToken
      const { useAuthStore } = await import('./stores/auth')
      const authStore = useAuthStore()
      
      // Thử refresh token
      const refreshSuccess = await authStore.refreshToken()
      
      if (refreshSuccess) {
        // Nếu refresh thành công, lấy token mới và retry tất cả request trong hàng đợi
        const newToken = authStore.token
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
      
      return axios(originalRequest)
      } else {
        // Nếu refresh thất bại, đăng xuất và reject tất cả request
        authStore.logout(true)
        processQueue(new Error('Token refresh failed'), null)
        return Promise.reject(error)
      }
    } catch (refreshError) {
      // Xử lý lỗi khi refresh token
      console.error('Error during token refresh:', refreshError)
      
      // Lấy authStore để đăng xuất
      const { useAuthStore } = await import('./stores/auth')
      const authStore = useAuthStore()
      
      // Đăng xuất và thông báo
      authStore.createNotification('error', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại')
      authStore.logout(true)
      
      // Reject tất cả request trong hàng đợi
      processQueue(refreshError, null)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

// Import animation CSS
import 'animate.css/animate.min.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
  position: "bottom-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false
})
app.component('font-awesome-icon', FontAwesomeIcon)

// Đăng ký directive toàn cục
app.directive('scroll-bottom', {
  updated: (el, binding) => {
    if (binding.value !== binding.oldValue) {
      console.log('v-scroll-bottom directive updated, scrolling to bottom');
      setTimeout(() => {
        el.scrollTop = el.scrollHeight;
      }, 100);
    }
  },
  mounted: (el) => {
    console.log('v-scroll-bottom directive mounted, scrolling to bottom');
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 100);
  }
});

// Khởi tạo WebSocket
router.isReady().then(() => {
    // Khởi tạo WebSocket chỉ khi đã đăng nhập
    if (localStorage.getItem('token')) {
        socketService.init();
        
        // Đăng ký xử lý tin nhắn mới cho toàn bộ ứng dụng
        socketService.onMessage((data) => {
            console.log('[Main] Nhận tin nhắn từ socket:', data);
            
            // Xử lý thông báo tin nhắn mới
            if (data && data.type === 'chat_message') {
                const { useAuthStore } = import('./stores/auth');
                const { useChatStore } = import('./stores/chat');
                const { useNotificationStore } = import('./stores/notification');
                
                const authStore = useAuthStore();
                const chatStore = useChatStore();
                const notificationStore = useNotificationStore();
                
                const message = data.message;
                const currentUserId = authStore.userInfo?.user_id;
                
                // Nếu tin nhắn đến từ người khác, tạo thông báo
                if (message.sender !== currentUserId) {
                    // Lấy thông tin người gửi từ cache
                    const senderInfo = chatStore.userInfoCache[message.sender];
                    const senderName = senderInfo?.fullname || `Người dùng #${message.sender}`;
                    
                    // Tạo thông báo tin nhắn mới
                    notificationStore.createMessageNotification(
                        message.sender, 
                        message.content,
                        senderName
                    );
                }
            }
        });
    }
    
    // Xử lý lỗi hình ảnh toàn cục
    const handleGlobalImageError = function(event) {
        // Nếu đã xử lý rồi thì bỏ qua
        if (event.target.classList.contains('img-error-handled')) {
            return;
        }
        
        console.warn('Global image error handler:', event.target.src);
        
        // Ngăn chặn vòng lặp vô hạn
        event.target.classList.add('img-error-handled');
        event.target.onerror = null;
        
        // Đặt hình ảnh trong suốt 1x1 pixel
        event.target.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        
        // Ẩn phần tử img để không hiển thị icon lỗi
        event.target.style.opacity = '0.2';
    };
    
    // Thêm bộ lắng nghe sự kiện toàn cục cho lỗi hình ảnh
    document.addEventListener('error', function(event) {
        if (event.target.tagName === 'IMG') {
            handleGlobalImageError(event);
        }
    }, true);
    
    // Mount app
    app.mount('#app')
})
