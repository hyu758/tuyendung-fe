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
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook, faTwitter, faLinkedin, faGithub, faGoogle 
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
  farHeart
)

// Cấu hình Axios
axios.defaults.baseURL = 'http://127.0.0.1:8000'  // Cấu hình với API endpoint cơ bản

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
    }
    
    // Mount app
    app.mount('#app')
})
