import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EmployerLayout from '../layouts/EmployerLayout.vue'

const routes = [
  // Public routes
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { guest: true }
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

  // Routes yêu cầu đăng nhập
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
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

  // Employer routes with layout
  {
    path: '/employer',
    component: EmployerLayout,
    meta: { requiresAuth: true, role: 'employer' },
    children: [
      {
        path: '',
        name: 'EmployerDashboard',
        component: () => import('../views/employer/Dashboard.vue')
      },
      {
        path: 'profile',
        name: 'EmployerProfile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'create-enterprise',
        name: 'CreateEnterprise',
        component: () => import('../views/enterprise/CreateEnterprise.vue')
      },
      {
        path: 'company',
        name: 'Company',
        component: () => import('../views/enterprise/EnterpriseProfile.vue')
      },
      {
        path: 'campaigns',
        name: 'Campaigns',
        component: () => import('../views/campaign/CampaignList.vue')
      },
      {
        path: 'campaigns/:id',
        name: 'CampaignDetail',
        component: () => import('../views/campaign/CampaignDetail.vue')
      },
      {
        path: 'jobs',
        name: 'Jobs',
        component: () => import('../views/employer/Jobs.vue')
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },

  // Not found
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
  const guestOnly = to.matched.some(record => record.meta.guest)
  
  // Nếu route cần xác thực
  if (requiresAuth) {
    // Kiểm tra nếu có token
    if (authStore.isAuthenticated) {
      // Kiểm tra trạng thái kích hoạt
      if (!authStore.isActivated && to.name !== 'Activate') {
        // Nếu chưa kích hoạt, cập nhật thông tin từ token
        if (!authStore.user) {
          authStore.updateUserFromToken()
        }
        
        // Kiểm tra lại sau khi cập nhật
        if (!authStore.isActivated) {
          const email = authStore.user?.username || localStorage.getItem('username')
          return next({
            name: 'Activate',
            params: { email }
          })
        }
      }
      
      // Chỉ kiểm tra role nếu route yêu cầu role cụ thể
      const roleRequired = to.matched.find(record => record.meta.role)?.meta.role
      if (roleRequired && authStore.userRole !== roleRequired) {
        // Nếu route yêu cầu role mà user không có role đó
        return next('/')
      }
      
      next()
    } else {
      // Chuyển hướng đến trang đăng nhập
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  // Route chỉ dành cho khách
  else if (guestOnly && authStore.isAuthenticated) {
    // Chỉ chuyển hướng employer và admin về dashboard của họ
    // Ứng viên vẫn có thể xem các trang guest
    if (authStore.userRole === 'employer') {
      return next('/employer')
    } else if (authStore.userRole === 'admin') {
      return next('/admin')
    }
    next()
  }
  // Route công khai
  else {
    next()
  }
})

export default router 