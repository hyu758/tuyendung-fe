          <router-link 
            to="/candidate/notifications"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            :class="{ 'bg-blue-50 text-blue-600': isCurrentRoute('/candidate/notifications') }"
          >
            <i class="fas fa-bell w-5 h-5 mr-3"></i>
            <span>Thông báo</span>
          </router-link>

          <!-- Tin nhắn trong sidebar -->
          <router-link 
            to="/candidate/messages"
            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition duration-200 relative"
            :class="{ 
              'bg-blue-50 text-blue-600 font-medium': isCurrentRoute('/candidate/messages'), 
              'bg-red-50': unreadMessageCount > 0 && !isCurrentRoute('/candidate/messages') 
            }"
          >
            <i class="fas fa-comment-dots w-5 h-5 mr-3" 
              :class="{ 'text-red-500': unreadMessageCount > 0 && !isCurrentRoute('/candidate/messages') }"
            ></i>
            <span>Tin nhắn</span>
            <span 
              v-if="unreadMessageCount > 0" 
              class="ml-auto bg-red-500 text-white text-xs font-medium rounded-full px-2 py-1 min-w-[24px] text-center shadow-sm"
            >
              {{ unreadMessageCount > 99 ? '99+' : unreadMessageCount }}
            </span>
          </router-link> 