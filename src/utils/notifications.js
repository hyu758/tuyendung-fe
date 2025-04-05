/**
 * Các hàm tiện ích để quản lý thông báo
 */

/**
 * Hiển thị thông báo thành công
 * @param {string} message - Nội dung thông báo
 */
export const showSuccess = (message) => {
  localStorage.setItem('notification', JSON.stringify({
    type: 'success',
    message: message,
    show: true
  }))
}

/**
 * Hiển thị thông báo lỗi
 * @param {string} message - Nội dung thông báo
 */
export const showError = (message) => {
  localStorage.setItem('notification', JSON.stringify({
    type: 'error',
    message: message,
    show: true
  }))
}

/**
 * Hiển thị thông báo cảnh báo
 * @param {string} message - Nội dung thông báo
 */
export const showWarning = (message) => {
  localStorage.setItem('notification', JSON.stringify({
    type: 'warning',
    message: message,
    show: true
  }))
}

/**
 * Hiển thị thông báo thông tin
 * @param {string} message - Nội dung thông báo
 */
export const showInfo = (message) => {
  localStorage.setItem('notification', JSON.stringify({
    type: 'info',
    message: message,
    show: true
  }))
}

/**
 * Các template thông báo thường dùng
 */
export const notificationTemplates = {
  // Thông báo cho quản lý tin tuyển dụng
  post: {
    createSuccess: 'Tạo tin tuyển dụng thành công!',
    createError: 'Tạo tin tuyển dụng thất bại: ',
    updateSuccess: 'Cập nhật tin tuyển dụng thành công!',
    updateError: 'Cập nhật tin tuyển dụng thất bại: ',
    deleteSuccess: 'Xóa tin tuyển dụng thành công!',
    deleteError: 'Xóa tin tuyển dụng thất bại: ',
  },
  
  // Thông báo cho quản lý chiến dịch
  campaign: {
    createSuccess: 'Tạo chiến dịch thành công!',
    createError: 'Tạo chiến dịch thất bại: ',
    updateSuccess: 'Cập nhật chiến dịch thành công!',
    updateError: 'Cập nhật chiến dịch thất bại: ',
    deleteSuccess: 'Xóa chiến dịch thành công!',
    deleteError: 'Xóa chiến dịch thất bại: ',
  },
  
  // Thông báo cho quản lý hồ sơ
  profile: {
    updateSuccess: 'Cập nhật thông tin thành công!',
    updateError: 'Cập nhật thông tin thất bại: ',
    changePasswordSuccess: 'Đổi mật khẩu thành công!',
    changePasswordError: 'Đổi mật khẩu thất bại: ',
  },
  
  // Thông báo cho quản lý doanh nghiệp
  enterprise: {
    updateSuccess: 'Cập nhật thông tin doanh nghiệp thành công!',
    updateError: 'Cập nhật thông tin doanh nghiệp thất bại: ',
  },
  
  // Thông báo chung
  common: {
    error: 'Có lỗi xảy ra: ',
    success: 'Thao tác thành công!',
    warning: 'Cảnh báo: ',
    info: 'Thông tin: ',
  }
} 