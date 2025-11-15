# Smart Error Reporting System

## Tổng quan

Hệ thống báo cáo lỗi thông minh giúp phân loại và chỉ gửi những lỗi thực sự quan trọng về Sentry, tránh spam với các lỗi validation hoặc authentication thông thường.

## Vấn đề được giải quyết

### ❌ **Trước đây:**

- Mọi lỗi đều được gửi về Sentry
- Spam với lỗi "Wrong password", "Invalid email"
- Tốn events và làm nhiễu dashboard
- Khó phân biệt lỗi thực sự quan trọng

### ✅ **Bây giờ:**

- Chỉ gửi lỗi quan trọng về Sentry
- Lỗi validation/auth chỉ hiển thị alert cho user
- Dashboard Sentry sạch sẽ, dễ theo dõi
- Tiết kiệm events và chi phí

## Error Classification

### 🔴 **KHÔNG gửi Sentry:**

- **Validation errors**: "Invalid email", "Password too short"
- **Authentication errors**: "Wrong password", "User not found"
- **User input errors**: "Field required", "Invalid format"

### 🟡 **CÓ THỂ gửi Sentry:**

- **Authorization errors**: "Access denied", "Permission required"
- **Network errors**: "Connection timeout", "Server unavailable"

### 🟢 **LUÔN gửi Sentry:**

- **Server errors**: "Database failed", "Internal server error"
- **Critical errors**: "Payment failed", "Security breach"
- **Unknown errors**: Lỗi không xác định được

## Cách sử dụng

### 1. **Smart Error Handler (Khuyến nghị)**

```typescript
import { smartErrorHandler } from "@/utils/error-classification";

// Tự động phân loại và chỉ gửi Sentry khi cần
try {
  await login();
} catch (error) {
  smartErrorHandler(error, {
    showAlert: true,
    alertTitle: "Lỗi Đăng Nhập",
    tags: { action: "login" },
  });
}
```

### 2. **Specialized Handlers**

```typescript
import {
  authErrorHandler,
  validationErrorHandler,
} from "@/utils/error-handler";

// Authentication errors - KHÔNG gửi Sentry
try {
  await signIn();
} catch (error) {
  authErrorHandler(error); // Chỉ alert, không Sentry
}

// Validation errors - KHÔNG gửi Sentry
if (!isValidEmail(email)) {
  validationErrorHandler("Invalid email address");
}
```

### 3. **Force Report (Khi cần thiết)**

```typescript
// Bắt buộc gửi Sentry cho lỗi quan trọng
smartErrorHandler(error, {
  forceReport: true,
  tags: { critical: "true" },
});
```

## Configuration

### Environment-based Settings

```typescript
// config/error-reporting.ts
export const ERROR_CONFIG_BY_ENV = {
  development: {
    enabled: false, // Không gửi Sentry trong dev
    samplingRate: 0,
  },
  staging: {
    enabled: true,
    samplingRate: 0.5, // 50% errors
    rateLimitPerMinute: 5,
  },
  production: {
    enabled: true,
    samplingRate: 0.1, // 10% errors
    rateLimitPerMinute: 10,
  },
};
```

### Blacklisted Messages

```typescript
const BLACKLISTED_MESSAGES = [
  "Invalid credentials",
  "Wrong password",
  "Invalid email address",
  "Password must be at least 8 characters",
  "Passwords do not match",
  // ... nhiều hơn
];
```

### Whitelisted Messages (Override blacklist)

```typescript
const WHITELISTED_MESSAGES = [
  "Database connection failed",
  "Service unavailable",
  "Critical system error",
  "Payment processing failed",
  "Security breach detected",
];
```

## Error Categories

### 1. **Validation** ❌ (Không Sentry)

- Lỗi format dữ liệu
- Lỗi required fields
- Lỗi length/pattern validation
- **Ví dụ**: "Email không hợp lệ", "Mật khẩu quá ngắn"

### 2. **Authentication** ❌ (Không Sentry)

- Sai password/username
- User không tồn tại
- Account bị khóa
- **Ví dụ**: "Sai mật khẩu", "Tài khoản không tồn tại"

### 3. **Network** 🟡 (Có thể Sentry)

- Connection timeout
- Server unavailable
- Network errors
- **Ví dụ**: "Không thể kết nối server"

### 4. **Server** ✅ (Luôn Sentry)

- Database errors
- Internal server errors
- Service unavailable
- **Ví dụ**: "Database connection failed"

### 5. **Authorization** 🟡 (Có thể Sentry)

- Permission denied
- Access forbidden
- Role insufficient
- **Ví dụ**: "Không có quyền truy cập"

### 6. **Client** ✅ (Luôn Sentry)

- JavaScript errors
- Component crashes
- Unhandled exceptions
- **Ví dụ**: "Cannot read property of undefined"

### 7. **Unknown** ✅ (Luôn Sentry)

- Lỗi không xác định
- Fallback category
- **Ví dụ**: "Unexpected error occurred"

## Sampling & Rate Limiting

### Sampling Rate

```typescript
// Giảm số lượng events bằng sampling
development: 0%    // Không gửi gì
staging: 50%       // 1/2 events
production: 10%    // 1/10 events
```

### Rate Limiting

```typescript
// Giới hạn số events per minute
staging: 5 / minute;
production: 10 / minute;
```

## User Experience

### ✅ **User luôn thấy alert:**

- Lỗi validation → "Email không hợp lệ"
- Lỗi auth → "Mật khẩu không chính xác"
- Lỗi network → "Không thể kết nối mạng"

### ✅ **Developer thấy Sentry:**

- Chỉ lỗi thực sự quan trọng
- Dashboard sạch sẽ, dễ debug
- Tiết kiệm events và chi phí

## Migration Guide

### Từ Old System:

```typescript
// ❌ Cũ - gửi tất cả
try {
  await login();
} catch (error) {
  Alert.alert("Error", error.message);
  Sentry.captureException(error); // Spam!
}
```

### Sang New System:

```typescript
// ✅ Mới - thông minh
try {
  await login();
} catch (error) {
  authErrorHandler(error); // Chỉ alert, không spam Sentry
}
```

## Best Practices

### 1. **Sử dụng Smart Handler**

```typescript
// Khuyến nghị cho hầu hết trường hợp
smartErrorHandler(error, { showAlert: true });
```

### 2. **Sử dụng Specialized Handlers**

```typescript
// Cho các trường hợp cụ thể
authErrorHandler(error); // Auth errors
validationErrorHandler(error); // Validation errors
networkErrorHandler(error); // Network errors
```

### 3. **Force Report cho Critical Errors**

```typescript
// Chỉ khi thực sự quan trọng
smartErrorHandler(error, {
  forceReport: true,
  tags: { critical: "payment_failed" },
});
```

### 4. **Custom Messages**

```typescript
// User-friendly messages
smartErrorHandler(error, {
  customMessage: "Đã xảy ra lỗi khi thanh toán. Vui lòng thử lại.",
  tags: { component: "PaymentForm" },
});
```

## Monitoring

### Sentry Dashboard sẽ thấy:

- ✅ Server errors
- ✅ Network errors (sampled)
- ✅ Critical errors
- ✅ Unknown errors

### Sentry Dashboard KHÔNG thấy:

- ❌ Validation errors
- ❌ Authentication errors
- ❌ User input errors

## Kết quả

- **Dashboard Sentry sạch sẽ** - chỉ lỗi quan trọng
- **Tiết kiệm events** - giảm 80-90% số lượng
- **UX tốt hơn** - user vẫn thấy thông báo lỗi
- **Debug hiệu quả** - dễ tìm lỗi thực sự
- **Chi phí thấp hơn** - ít events = ít tiền
