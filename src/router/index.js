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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      if (!authStore.isActivated) {
        authStore.error = 'Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email để kích hoạt.'
        next({ name: 'Activate', params: { email: authStore.user?.email || '' } })
      } else if (to.matched.some(record => record.meta.role) && 
          !to.matched.some(record => record.meta.role === authStore.userRole)) {
        next({ name: 'Home' })
      } else {
        next()
      }
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (isAuthenticated) {
      if (authStore.isActivated) {
        if (authStore.userRole === 'admin' && router.hasRoute('AdminDashboard')) {
          next({ name: 'AdminDashboard' })
        } else if (authStore.userRole === 'employer' && router.hasRoute('EmployerDashboard')) {
          next({ name: 'EmployerDashboard' })
        } else {
          next({ name: 'Home' })
        }
      } else {
        if (to.name === 'Activate') {
          next()
        } else {
          next({ name: 'Activate', params: { email: authStore.user?.email || '' } })
        }
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 