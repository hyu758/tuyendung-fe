import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { guest: true }
  },
  {
    path: '/activate/:email?',
    name: 'Activate',
    component: () => import('../views/Activate.vue'),
    meta: { guest: true }
  },
  {
    path: '/api/activate/:token',
    redirect: to => {
      return { 
        name: 'Activate', 
        params: { token: to.params.token } 
      }
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { guest: true }
  },
  {
    path: '/job-search',
    name: 'JobSearch',
    component: () => import('../views/JobSearch.vue')
  },
  {
    path: '/job/:id',
    name: 'JobDetail',
    component: () => import('../views/JobDetail.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/employer/dashboard',
    name: 'EmployerDashboard',
    component: () => import('../views/employer/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  {
    path: '/employer/jobs',
    name: 'EmployerJobs',
    component: () => import('../views/employer/Jobs.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  {
    path: '/employer/create-job',
    name: 'CreateJob',
    component: () => import('../views/employer/CreateJob.vue'),
    meta: { requiresAuth: true, role: 'employer' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guestOnly)
  
  // Nếu route cần xác thực
  if (requiresAuth) {
    // Kiểm tra nếu có token
    if (authStore.isAuthenticated) {
      // Kiểm tra trạng thái kích hoạt từ token trước
      if (!authStore.isActivated && to.name !== 'Activate') {
        // Nếu chưa kích hoạt theo thông tin từ token, cập nhật thông tin từ token
        if (!authStore.user) {
          authStore.updateUserFromToken()
        }
        
        // Kiểm tra lại sau khi cập nhật - nếu vẫn chưa kích hoạt
        if (!authStore.isActivated) {
          const email = authStore.user?.username || localStorage.getItem('username')
          return next({
            name: 'Activate',
            params: { email }
          })
        }
      }
      
      // Kiểm tra quyền truy cập dựa trên vai trò
      const roleRequired = to.matched.find(record => record.meta.role)?.meta.role
      if (roleRequired && authStore.userRole !== roleRequired) {
        // Nếu không có quyền, điều hướng về trang chủ
        return next({ path: '/' })
      }
      
      // Cho phép truy cập
      next()
    } else {
      // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } 
  // Nếu route chỉ dành cho khách
  else if (guestOnly) {
    if (authStore.isAuthenticated) {
      // Nếu đã đăng nhập, chuyển hướng về trang chủ
      next({ path: '/' })
    } else {
      next()
    }
  } 
  // Route công khai, cho phép truy cập
  else {
    next()
  }
})

export default router 