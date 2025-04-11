/**
 * Composable để tạo thông báo toast
 * Sử dụng localStorage để giao tiếp với thành phần toast toàn cục
 */

export function useToast() {
  /**
   * Thêm một thông báo toast
   * @param {Object} toast Thông tin toast
   * @param {string} toast.type Loại toast: 'success', 'error', 'warning', 'info'
   * @param {string} toast.message Nội dung thông báo
   * @param {number} [toast.duration=3000] Thời gian hiển thị (ms)
   */
  const addToast = (toast) => {
    const defaultDuration = 3000
    
    // Cấu trúc dữ liệu toast
    const toastData = {
      id: Date.now(),
      type: toast.type || 'info',
      message: toast.message,
      duration: toast.duration || defaultDuration,
      timestamp: new Date().toISOString()
    }
    
    // Lưu toast vào localStorage để component App.vue có thể lắng nghe và hiển thị
    localStorage.setItem('toast-message', JSON.stringify(toastData))
  }
  
  return {
    addToast
  }
} 