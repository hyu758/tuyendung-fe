import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import EmployerLayout from '../layouts/EmployerLayout.vue'
import { useEnterpriseStore } from '../stores/enterprise'
import GoogleCallback from '../views/auth/GoogleCallback.vue'

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
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { guest: true }
  },
  {
    path: '/enterprises',
    name: 'EnterpriseList',
    component: () => import('../views/enterprise/EnterpriseList.vue')
  },
  {
    path: '/enterprises/:id',
    name: 'EnterpriseDetail',
    component: () => import('../views/enterprise/EnterpriseDetail.vue')
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
  {
    path: '/employer',
    component: EmployerLayout,
    meta: { requiresAuth: true, role: 'employer' },
    children: [
      {
        path: '',
        name: 'EmployerDashboard',
        component: () => import('../views/employer/EmployerStatistics.vue'),
        meta: { requiresAuth: true, role: 'employer' }
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
        component: () => import('../views/enterprise/EnterpriseProfile.vue'),
      },
      {
        path: 'company/edit',
        name: 'EditEnterprise',
        component: () => import('../views/enterprise/EnterpriseEdit.vue')
      },
      {
        path: 'posts',
        name: 'PostList',
        component: () => import('../views/post/PostList.vue'),
        meta: { requiresAuth: true, role: 'employer' }
      },
      {
        path: 'posts/create',
        name: 'PostCreate',
        component: () => import('../views/post/PostCreate.vue'),
        meta: { requiresAuth: true, role: 'employer' }
      },
      {
        path: 'posts/:id',
        name: 'PostDetail',
        component: () => import('../views/post/EnterprisePostDetail.vue'),
        meta: {
          requiresAuth: true,
          role: 'employer'
        }
      },
      {
        path: 'posts/:id/edit',
        name: 'EditPost',
        component: () => import('../views/post/PostEdit.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'cv/:id',
        name: 'CVDetail',
        component: () => import('../views/cv/CVDetail.vue'),
        meta: { requiresAuth: true, role: 'employer' }
      },
      {
        path: 'notifications',
        name: 'NotificationView',
        component: () => import('../views/employer/NotificationView.vue'),
        meta: {requiresAuth: true, role: 'employer'}
      },
      {
        path: '/employer/messages',
        name: 'employer-messages',
        component: () => import('../views/employer/MessageCenter.vue'),
        meta: {
          requiresAuth: true,
          role: 'employer'
        }
      },
      {
        path: 'premium',
        name: 'EmployerPremium',
        component: () => import('../views/Premium.vue'),
        meta: {
          requiresAuth: true,
          role: 'employer'
        }
      }
    ]
  },
  {
    path: '/auth/google/callback',
    name: 'GoogleCallback',
    component: GoogleCallback,
    meta: { requiresAuth: false }
  },
  {
    path: '/select-role',
    name: 'SelectRole',
    component: () => import('../views/auth/SelectRole.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-applications',
    component: () => import('../views/candidate/MyApplications.vue'),
    meta: { requiresAuth: true, role: 'candidate' }
  },
  {
    path: '/saved-jobs',
    name: 'SavedJobs',
    component: () => import('../views/candidate/SavedJobs.vue'),
    meta: { requiresAuth: true, role: 'candidate' }
  },
  {
    path: '/candidate/messages',
    name: 'candidate-messages',
    component: () => import('../views/candidate/MessageCenter.vue'),
    meta: {
      requiresAuth: true,
      role: 'candidate'
    }
  },
  {
    path: '/premium',
    name: 'CandidatePremium',
    component: () => import('../views/Premium.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/payment-success',
    name: 'PaymentSuccess',
    component: () => import('../views/PaymentResult.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment-failed',
    name: 'PaymentFailed',
    component: () => import('../views/PaymentResult.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/enterprise/statistics',
    name: 'EnterpriseStatistics',
    component: () => import('../views/enterprise/EnterpriseStatistics.vue'),
    meta: {
      requiresAuth: true,
      roles: ['employer', 'admin']
    }
  },
  {
    path: '/gemini-chat',
    name: 'GeminiChat',
    component: () => import('../views/gemini_chat/GeminiChat.vue'),
    meta: {
      title: 'JobHub AI'
    }
  },
  {
    path: '/my-criteria',
    name: 'MyCriteria',
    component: () => import('../views/candidate/MyCriteria.vue'),
    meta: {
      requiresAuth: true,
      candidateOnly: true,
      title: 'Tiêu chí tìm việc'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
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
  const enterpriseStore = useEnterpriseStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const guestOnly = to.matched.some(record => record.meta.guest)
  
  if (authStore.isAuthenticated) {
    try {
      const decoded = authStore.decodedToken;
      const currentTime = Math.floor(Date.now() / 1000);
      
      if (decoded && decoded.exp && (decoded.exp - currentTime < 300 || currentTime >= decoded.exp)) {
        await authStore.refreshToken();
      }
    } catch (error) {
      console.error('[Router] Lỗi khi kiểm tra token:', error);
    }
    
    // Đảm bảo có thông tin user nếu đã đăng nhập
    if (!authStore.user) {
      await authStore.updateUserFromToken();
    }
  }
  
  // Lấy role từ nhiều nguồn
  const userRole = authStore.userRole
  
  if (authStore.isAuthenticated && 
      (userRole === 'none') && 
      to.name !== 'SelectRole') {
    return next({ name: 'SelectRole' });
  }
  
  // Nếu route cần xác thực
  if (requiresAuth) {
    // Kiểm tra nếu có token
    if (authStore.isAuthenticated) {
      // Kiểm tra trạng thái kích hoạt
      if (!authStore.isActivated && to.name !== 'Activate') {
        // Nếu chưa kích hoạt, cập nhật thông tin từ token
        if (!authStore.user) {
          await authStore.updateUserFromToken()
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
      const isCandidateOnly = to.matched.some(record => record.meta.candidateOnly)
      
      if (roleRequired && authStore.userRole !== roleRequired) {
        // Nếu route yêu cầu role mà user không có role đó
        return next('/')
      }
      
      // Kiểm tra quyền truy cập candidateOnly
      if (isCandidateOnly && authStore.userRole !== 'candidate') {
        
        // Hiển thị thông báo hoặc thực hiện hành động phù hợp
        if (window.$toast) {
          window.$toast.error('Chỉ ứng viên mới có thể truy cập trang này')
        }
        return next('/')
      }

      // Kiểm tra thông tin doanh nghiệp cho nhà tuyển dụng
      if (authStore.userRole === 'employer' && to.name !== 'CreateEnterprise') {
        try {
          const result = await enterpriseStore.fetchUserEnterprise()
          if (!result.success && result.notFound) {
            return next({ name: 'CreateEnterprise' })
          }
        } catch (error) {
          console.error('Error checking enterprise:', error)
        }
      }
      
      next()
    } else {
      // Chuyển hướng đến trang đăng nhập và lưu route hiện tại để redirect sau khi đăng nhập
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }
  // Route chỉ dành cho khách
  else if (guestOnly && authStore.isAuthenticated) {
    if (authStore.userRole === 'employer') {
      return next('/employer')
    }
    if (to.name === 'Login' || to.name === 'Register') {
      if (authStore.userRole === 'employer') {
        return next('/employer')
      } else if (authStore.userRole === 'candidate') {
        return next('/job-search')
      } else {
        return next('/')
      }
    }
    next()
  }
  // Route công khai
  else {
    next()
  }
})

export default router 