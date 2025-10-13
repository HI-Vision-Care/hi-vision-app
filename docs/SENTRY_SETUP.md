# Sentry Error Tracking Setup

## Tổng quan

App đã được setup Sentry để tự động theo dõi và báo cáo lỗi mà không cần gắn thủ công từng error. Hệ thống bao gồm:

## 1. Automatic Error Tracking

### Global Error Boundary

- Tự động capture tất cả unhandled React errors
- Hiển thị fallback UI khi có lỗi
- Tự động log vào Sentry với context phong phú

### Unhandled Promise Rejections

- Tự động track các promise rejection không được handle
- Capture console errors liên quan đến unhandled promises
- Global error handler cho React Native

## 2. Manual Error Handling

### Error Handlers

```typescript
import {
  authErrorHandler,
  networkErrorHandler,
  validationErrorHandler,
} from "@/utils/error-handler";

// Authentication errors
try {
  await login();
} catch (error) {
  authErrorHandler(error);
}

// Network errors
try {
  await fetchData();
} catch (error) {
  networkErrorHandler(error);
}

// Validation errors
if (!isValidEmail(email)) {
  validationErrorHandler("Invalid email address");
}
```

### Custom Hook cho Async Functions

```typescript
import { useAsyncWithSentry } from "@/hooks/useAsyncWithSentry";

const MyComponent = () => {
  const { execute, loading, error } = useAsyncWithSentry(myAsyncFunction, {
    showAlert: true,
    tags: { component: "MyComponent" },
  });

  const handleSubmit = () => {
    execute(data);
  };
};
```

### Error Wrapper

```typescript
import { withErrorHandling } from "@/utils/error-handler";

const myAsyncFunction = withErrorHandling(
  async (data) => {
    // function logic
  },
  {
    showAlert: true,
    tags: { category: "api" },
  }
);
```

## 3. Sentry Utilities

### User Context

```typescript
import { setUserContext, setTags } from "@/utils/sentry-setup";

// Set user info
setUserContext({
  id: "user123",
  email: "user@example.com",
});

// Set tags
setTags({
  environment: "production",
  version: "1.0.0",
});
```

### Breadcrumbs

```typescript
import { addBreadcrumb } from "@/utils/sentry-setup";

// Track user actions
addBreadcrumb("User clicked submit button", "user", "info", {
  formId: "login",
});
```

## 4. Configuration

### Sentry Init (app/\_layout.tsx)

```typescript
Sentry.init({
  dsn: "your-dsn",
  sendDefaultPii: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});
```

### Error Boundary Setup

```typescript
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>
```

## 5. Best Practices

### 1. Sử dụng Specialized Error Handlers

- `authErrorHandler`: Cho authentication errors
- `networkErrorHandler`: Cho network errors
- `validationErrorHandler`: Cho validation errors
- `silentErrorHandler`: Cho errors không cần hiển thị alert

### 2. Thêm Context Phong Phú

```typescript
handleError(error, {
  tags: {
    component: "SignInForm",
    action: "login",
  },
  context: {
    userEmail: email,
    timestamp: new Date().toISOString(),
  },
});
```

### 3. Track User Actions với Breadcrumbs

```typescript
// Trước khi thực hiện action
addBreadcrumb("User attempting to sign in", "user", "info", { email });

try {
  await signIn();
  addBreadcrumb("Sign in successful", "auth", "info");
} catch (error) {
  addBreadcrumb("Sign in failed", "auth", "error", { error: error.message });
  authErrorHandler(error);
}
```

## 6. Error Types được Track

1. **React Component Errors** - Tự động qua ErrorBoundary
2. **Unhandled Promise Rejections** - Tự động qua global handler
3. **Global JavaScript Errors** - Tự động qua ErrorUtils
4. **Manual Errors** - Qua các error handlers
5. **Network Errors** - Qua axios interceptors (nếu setup)
6. **Validation Errors** - Qua validation handlers

## 7. Monitoring Dashboard

Truy cập Sentry Dashboard để xem:

- Error frequency và trends
- User impact và affected devices
- Stack traces với source maps
- Performance metrics
- User feedback

## Kết luận

Với setup này, bạn không cần phải gắn `Sentry.captureException()` thủ công cho từng error nữa. Hệ thống sẽ tự động capture hầu hết các loại lỗi, và bạn chỉ cần sử dụng các specialized error handlers cho các trường hợp đặc biệt.
