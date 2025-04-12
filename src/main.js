import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import socketService from './services/socketService'
import { useAuthStore } from './stores/auth'

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
  faComments,
  faFileInvoice,
  faPhone,
  faCloudUploadAlt,
  faFilePdf,
  faFileWord,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook, faTwitter, faLinkedin, faGithub, faGoogle 
} from '@fortawesome/free-brands-svg-icons'

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
  faComments,
  faFileInvoice,
  faPhone,
  faCloudUploadAlt,
  faFilePdf,
  faFileWord,
  faCircleNotch,
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

axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    // Thêm log để debug
    console.log('Gửi yêu cầu với token');
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.log('Không có token trong localStorage');
  }
  return config
})

// Xử lý lỗi response toàn cầu
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Nếu lỗi không phải 401 hoặc request đã retry
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Nếu đang refresh token, thêm request vào hàng đợi
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axios(originalRequest)
        })
        .catch(err => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      // Nếu không có refresh token, đăng xuất
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')
      router.push('/login')
      return Promise.reject(error)
    }

    try {
      // Gọi API refresh token
      const response = await axios.post('/auth/refresh', {
        refresh_token: refreshToken
      })

      const { token } = response.data
      localStorage.setItem('token', token)
      
      // Cập nhật token cho request hiện tại và các request trong hàng đợi
      originalRequest.headers.Authorization = `Bearer ${token}`
      processQueue(null, token)
      
      return axios(originalRequest)
    } catch (err) {
      processQueue(err, null)
      // Nếu refresh token cũng hết hạn, đăng xuất
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('username')
      router.push('/login')
      return Promise.reject(err)
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
app.component('font-awesome-icon', FontAwesomeIcon)

// Khởi tạo WebSocket
router.isReady().then(() => {
    // Khởi tạo WebSocket chỉ khi đã đăng nhập
    if (localStorage.getItem('token')) {
        socketService.init();
    }
    
    // Mount app
    app.mount('#app')
})
