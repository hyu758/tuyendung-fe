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
    return axios.get('/candidates/profile')
  },
  updateProfile(profileData) {
    return axios.put('/candidates/profile', profileData)
  },
  getApplications() {
    return axios.get('/candidates/applications')
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