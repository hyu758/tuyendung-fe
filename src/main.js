import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faUser, faLock, faEnvelope, faBuilding, faBriefcase, faSearch, 
  faMapMarkerAlt, faClock, faMoneyBill, faTag, faChevronDown,
  faSignOutAlt, faPlus, faEdit, faTrash, faCheck, faTimes, faEye, faEyeSlash,
  faList, faSave, faFilter, faSort, faCalendar, faChartBar, faUsers, 
  faArrowLeft, faCheckCircle, faInfoCircle, faExclamationCircle, faTimesCircle
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
  faArrowLeft, faCheckCircle, faInfoCircle, faExclamationCircle, faTimesCircle
)

// Cấu hình Axios
axios.defaults.baseURL = 'http://localhost:3000'  // Cấu hình với API endpoint cơ bản
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Xử lý lỗi response toàn cầu
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error)
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      localStorage.removeItem('username')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
