# Hệ thống tuyển dụng JobHub

## Giới thiệu

JobHub là nền tảng kết nối nhà tuyển dụng (employer) và người tìm việc (candidate), hỗ trợ quá trình tuyển dụng và tìm kiếm việc làm hiệu quả.

## Các tính năng dành cho Nhà tuyển dụng (role: employer)

### 1. Quản lý thông tin doanh nghiệp
- **Tạo và cập nhật thông tin doanh nghiệp**: Cho phép nhà tuyển dụng cập nhật đầy đủ thông tin doanh nghiệp như tên công ty, địa chỉ, số điện thoại, lĩnh vực hoạt động...
- **Upload logo**: Tính năng tải lên logo công ty để tạo hình ảnh chuyên nghiệp.
- **Quản lý thông tin liên hệ**: Hỗ trợ quản lý thông tin liên hệ bao gồm email, số điện thoại và website công ty.

### 2. Quản lý chiến dịch tuyển dụng
- **Xem danh sách chiến dịch**: Hiển thị tất cả chiến dịch tuyển dụng với các thông tin cơ bản.
- **Tạo chiến dịch mới**: Tạo chiến dịch tuyển dụng với thông tin về tên, mô tả và trạng thái.
- **Chỉnh sửa chiến dịch**: Cập nhật thông tin chiến dịch hiện có.
- **Xóa chiến dịch**: Xóa các chiến dịch không còn cần thiết.
- **Quản lý trạng thái**: Bật/tắt chiến dịch tùy theo nhu cầu tuyển dụng.
- **Tìm kiếm và lọc**: Tìm kiếm chiến dịch theo tên, lọc theo trạng thái và sắp xếp theo các tiêu chí khác nhau.

### 3. Chi tiết chiến dịch tuyển dụng
- **Xem thông tin chi tiết**: Xem đầy đủ thông tin về chiến dịch tuyển dụng.
- **Quản lý tin tuyển dụng**: (Đang phát triển) Tạo và quản lý các tin tuyển dụng trong chiến dịch.

### 4. Hồ sơ cá nhân
- **Quản lý thông tin cá nhân**: Cập nhật thông tin cá nhân của HR như họ tên, giới tính, email...
- **Đổi mật khẩu**: Cập nhật mật khẩu đăng nhập.

## Hướng dẫn sử dụng cho Nhà tuyển dụng (employer)

### Thiết lập thông tin doanh nghiệp
1. Đăng nhập vào hệ thống với tài khoản nhà tuyển dụng (role: employer)
2. Từ menu dropdown ở góc phải trên cùng, chọn "Thông tin doanh nghiệp"
3. Điền đầy đủ thông tin vào form (các trường có dấu * là bắt buộc)
4. Nhấn nút "Tạo doanh nghiệp" để lưu thông tin
5. Sau khi tạo thành công, bạn có thể cập nhật thông tin bất kỳ lúc nào

### Quản lý chiến dịch tuyển dụng
1. Từ menu dropdown, chọn "Chiến dịch tuyển dụng"
2. Trang quản lý chiến dịch hiển thị danh sách các chiến dịch hiện có
3. Tạo chiến dịch mới bằng cách nhấn nút "Tạo chiến dịch mới"
4. Điền thông tin chiến dịch và nhấn "Tạo mới"
5. Chỉnh sửa chiến dịch bằng cách nhấn vào biểu tượng bút chì
6. Xóa chiến dịch bằng cách nhấn vào biểu tượng thùng rác
7. Xem chi tiết chiến dịch bằng cách nhấn vào biểu tượng mắt

### Xem chi tiết và quản lý chiến dịch
1. Từ trang danh sách, nhấn vào biểu tượng mắt bên cạnh chiến dịch
2. Trang chi tiết hiển thị tất cả thông tin về chiến dịch
3. Từ đây bạn có thể:
   - Chỉnh sửa thông tin chiến dịch
   - Xóa chiến dịch
   - Quản lý danh sách tin tuyển dụng (đang phát triển)

### Quản lý hồ sơ cá nhân
1. Từ menu dropdown, chọn "Hồ sơ cá nhân"
2. Trang hồ sơ hiển thị thông tin cá nhân của bạn
3. Cập nhật thông tin bằng cách điền vào form và nhấn "Cập nhật"
4. Đổi mật khẩu bằng cách chuyển sang tab "Đổi mật khẩu", nhập mật khẩu hiện tại và mật khẩu mới

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
