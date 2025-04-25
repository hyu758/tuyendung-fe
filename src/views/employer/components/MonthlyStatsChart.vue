<template>
  <div class="w-full h-full">
    <canvas ref="chartContainer"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'MonthlyStatsChart',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  setup(props) {
    const chartContainer = ref(null)
    let chart = null
    
    const createChart = async () => {
      if (!chartContainer.value || !props.data || props.data.length === 0) return
      
      // Đảm bảo canvas đã được render
      await nextTick()
      
      const months = props.data.map(item => item.month)
      const applicants = props.data.map(item => item.applicants)
      const posts = props.data.map(item => item.posts)
      
      try {
        const ctx = chartContainer.value.getContext('2d')
        
        // Nếu chart đã tồn tại, hủy nó trước khi tạo chart mới
        if (chart) {
          chart.destroy()
        }
        
        // Tạo biểu đồ mới
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: months,
            datasets: [
              {
                label: 'Số ứng viên',
                data: applicants,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
              },
              {
                label: 'Số tin đăng',
                data: posts,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            plugins: {
              legend: {
                position: 'top'
              },
              title: {
                display: false
              },
              tooltip: {
                callbacks: {
                  title: function(tooltipItems) {
                    return tooltipItems[0].label
                  },
                  label: function(context) {
                    let label = context.dataset.label || ''
                    if (label) {
                      label += ': '
                    }
                    label += context.parsed.y
                    return label
                  }
                }
              }
            }
          }
        })
      } catch (error) {
        console.error('Lỗi khi tạo biểu đồ:', error)
      }
    }
    
    onMounted(async () => {
      // Đảm bảo DOM đã render xong trước khi khởi tạo chart
      await nextTick()
      createChart()
    })
    
    // Cập nhật chart khi dữ liệu thay đổi
    watch(() => props.data, () => {
      createChart()
    }, { deep: true })
    
    return {
      chartContainer
    }
  }
}
</script> 