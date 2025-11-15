# Delete Account Modal

## Tổng quan

Modal cảnh báo cho việc xóa tài khoản với giao diện thân thiện và an toàn, yêu cầu người dùng xác nhận kỹ lưỡng trước khi thực hiện hành động không thể hoàn tác.

## Features

### ✅ **Cảnh báo chi tiết**

- Hiển thị danh sách các hậu quả khi xóa tài khoản
- Cảnh báo rõ ràng về việc mất dữ liệu vĩnh viễn
- Thông báo không thể khôi phục tài khoản

### ✅ **Xác nhận kép**

- Yêu cầu người dùng gõ chính xác "DELETE"
- Visual feedback khi nhập đúng/sai
- Button chỉ active khi đã xác nhận

### ✅ **UX/UI tốt**

- Blur background với animation mượt
- Color coding (đỏ cho danger, xanh cho confirm)
- Loading state khi đang xóa
- Responsive design

### ✅ **Error Handling**

- Tích hợp Sentry để track errors
- Graceful error handling với user-friendly messages

## Cách sử dụng

### 1. Import Component

```typescript
import { DeleteAccountModal } from "@components";
```

### 2. State Management

```typescript
const [showDeleteModal, setShowDeleteModal] = useState(false);
const { mutate: deleteAccount, isLoading: isDeletingAccount } =
  useDeleteAccount();
```

### 3. Handle Delete Account

```typescript
const handleDeleteAccount = () => {
  if (accountId) {
    deleteAccount(accountId, {
      onSuccess: async () => {
        await AsyncStorage.removeItem("token");
        router.replace("/(auth)/sign-in");
      },
      onError: (error) => {
        authErrorHandler(error); // Tự động Sentry tracking
      },
    });
  }
};
```

### 4. Render Modal

```typescript
<DeleteAccountModal
  visible={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteAccount}
  userName={name}
  isLoading={isDeletingAccount}
/>
```

## Props Interface

```typescript
interface DeleteAccountModalProps {
  visible: boolean; // Hiển thị/ẩn modal
  onClose: () => void; // Callback khi đóng modal
  onConfirm: () => void; // Callback khi xác nhận xóa
  userName?: string; // Tên user để hiển thị
  isLoading?: boolean; // Loading state
}
```

## Warning Items

Modal hiển thị các cảnh báo sau:

1. **Tất cả dữ liệu cá nhân sẽ bị xóa vĩnh viễn**
2. **Lịch sử khám bệnh và kết quả xét nghiệm sẽ mất**
3. **Đơn thuốc và lịch nhắc uống thuốc sẽ bị xóa**
4. **Ví điện tử và số dư sẽ không thể khôi phục**
5. **Không thể hoàn tác hành động này**

## Security Features

### ✅ **Double Confirmation**

- Yêu cầu gõ chính xác "DELETE"
- Không thể xóa bằng cách nhấn nút đơn thuần
- Visual feedback rõ ràng

### ✅ **Error Tracking**

- Tất cả errors được log vào Sentry
- Context phong phú cho debugging
- User action tracking với breadcrumbs

### ✅ **State Management**

- Reset modal state khi đóng
- Prevent multiple submissions
- Loading state để tránh spam

## Styling

### Color Scheme

- **Red (#EF4444)**: Danger actions, warnings
- **Green (#16A34A)**: Success confirmations
- **Gray**: Neutral elements
- **White**: Modal background

### Animations

- Fade in/out cho modal
- Smooth blur background
- Color transitions cho input states

## Integration với Sentry

Modal tự động tích hợp với hệ thống Sentry error tracking:

```typescript
// Error được track với context phong phú
authErrorHandler(error, {
  tags: {
    action: "delete_account",
    component: "DeleteAccountModal",
  },
  context: {
    userId: accountId,
    userName: name,
    timestamp: new Date().toISOString(),
  },
});
```

## Best Practices

### 1. **Always show warnings**

- Không bao giờ xóa tài khoản mà không có confirmation
- Hiển thị đầy đủ hậu quả của hành động

### 2. **Clear communication**

- Sử dụng ngôn ngữ đơn giản, dễ hiểu
- Highlight các từ khóa quan trọng

### 3. **Prevent accidental deletion**

- Yêu cầu gõ text confirmation
- Disable button cho đến khi xác nhận

### 4. **Error handling**

- Luôn có fallback cho network errors
- Thông báo lỗi thân thiện với user

## Testing

### Test Cases

1. **Modal hiển thị đúng** khi click delete
2. **Không thể confirm** khi chưa gõ "DELETE"
3. **Có thể confirm** khi đã gõ đúng "DELETE"
4. **Loading state** hiển thị đúng khi đang xóa
5. **Error handling** hoạt động khi có lỗi
6. **Modal reset** state khi đóng

### Manual Testing

```bash
# Test delete account flow
1. Vào Settings
2. Click "Delete Account"
3. Verify modal hiển thị warnings
4. Gõ sai text → verify button disabled
5. Gõ "DELETE" → verify button enabled
6. Click confirm → verify loading state
7. Verify redirect to login page
```
