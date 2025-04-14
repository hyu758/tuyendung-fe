import axios from 'axios'

export const authService = {
  login(credentials) {
    return axios.post('/auth/login', credentials)
  },
  register(userData) {
    return axios.post('/auth/register', userData)
  },
  getCurrentUser() {
    return axios.get('/auth/me')
  }
}

export const jobService = {
  getAllJobs(params) {
    return axios.get('/jobs', { params })
  },
  getJobById(id) {
    return axios.get(`/jobs/${id}`)
  },
  createJob(jobData) {
    return axios.post('/jobs', jobData)
  },
  updateJob(id, jobData) {
    return axios.put(`/jobs/${id}`, jobData)
  },
  deleteJob(id) {
    return axios.delete(`/jobs/${id}`)
  },
  applyForJob(jobId, applicationData) {
    return axios.post(`/jobs/${jobId}/apply`, applicationData)
  }
}

export const candidateService = {
  getProfile() {
    return axios.get('/profile/')
  },
  updateProfile(profileData) {
    return axios.put('/profile/update/', profileData)
  },
  getApplications() {
    return axios.get('/api/cv/')
  }
}

export const employerService = {
  getProfile() {
    return axios.get('/employers/profile')
  },
  updateProfile(profileData) {
    return axios.put('/employers/profile', profileData)
  },
  getPostedJobs() {
    return axios.get('/employers/jobs')
  },
  getApplications(jobId) {
    return axios.get(`/employers/jobs/${jobId}/applications`)
  },
  updateApplicationStatus(applicationId, status) {
    return axios.put(`/employers/applications/${applicationId}`, { status })
  }
}

export const adminService = {
  getAllUsers() {
    return axios.get('/admin/users')
  },
  approveJob(jobId) {
    return axios.put(`/admin/jobs/${jobId}/approve`)
  },
  rejectJob(jobId, reason) {
    return axios.put(`/admin/jobs/${jobId}/reject`, { reason })
  },
  getStatistics() {
    return axios.get('/admin/statistics')
  }
}

export const chatService = {
  getConversations() {
    return axios.get('/api/conversations/')
  },
  getMessages(userId, options = {}) {
    console.log('Gọi API lấy tin nhắn với userId:', userId, 'options:', options);
    const { page = 1, limit = 30 } = options;
    
    return axios.get(`/api/messages/`, { 
      params: { 
        user_id: userId,
        page,
        page_size: limit,
        ordering: '-created_at'
      } 
    });
  },
  sendMessage(recipientId, content) {
    console.log('Gửi tin nhắn đến recipientId:', recipientId);
    
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    let userId = null;
    
    // Nếu có token, giải mã để lấy user_id
    if (token) {
      try {
        // Giải mã phần payload của JWT token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedToken = JSON.parse(window.atob(base64));
        
        // Lấy user_id từ token đã giải mã
        userId = decodedToken.user_id;
        console.log('Đã lấy được user_id từ token:', userId);
      } catch (error) {
        console.error('Lỗi khi giải mã token:', error);
      }
    }
    
    // Thêm sender vào dữ liệu gửi đi
    return axios.post('/api/messages/send/', { 
      recipient: recipientId, 
      content,
      sender: userId 
    });
  },
  getUnreadMessages() {
    return axios.get('/api/messages/unread/')
  },
  markMessageAsRead(messageId) {
    return axios.post(`/api/messages/${messageId}/read/`)
  }
} 