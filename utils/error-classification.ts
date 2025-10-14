import { getSamplingRate, shouldReportError } from "../config/error-reporting";
import { captureError } from "./sentry-setup";

export type ErrorCategory =
  | "validation" // Lỗi validation (không gửi Sentry)
  | "authentication" // Lỗi auth như sai password (không gửi Sentry)
  | "authorization" // Lỗi quyền (có thể gửi Sentry)
  | "network" // Lỗi mạng (gửi Sentry)
  | "server" // Lỗi server (gửi Sentry)
  | "client" // Lỗi client (gửi Sentry)
  | "unknown"; // Lỗi không xác định (gửi Sentry)

export interface ErrorInfo {
  category: ErrorCategory;
  message: string;
  shouldReportToSentry: boolean;
  userFriendlyMessage: string;
}

// Blacklist các lỗi không cần gửi Sentry
const NON_REPORTABLE_ERRORS = [
  // Authentication errors
  "Invalid credentials",
  "Wrong password",
  "Invalid email or password",
  "Email not found",
  "Password incorrect",
  "Authentication failed",
  "Login failed",
  "Invalid username or password",

  // Validation errors
  "Invalid email address",
  "Password must be at least 8 characters",
  "Passwords do not match",
  "Invalid phone number",
  "Email is required",
  "Password is required",
  "Phone number is required",
  "Invalid format",
  "Field is required",
  "Minimum length not met",
  "Maximum length exceeded",

  // Common user input errors
  "Please check your input",
  "Invalid input format",
  "Required field missing",
  "Invalid data format",
];

// Keywords để phân loại lỗi
const ERROR_KEYWORDS = {
  validation: [
    "invalid",
    "required",
    "format",
    "length",
    "match",
    "pattern",
    "email",
    "password",
    "phone",
    "field",
    "input",
  ],
  authentication: [
    "credential",
    "password",
    "login",
    "auth",
    "unauthorized",
    "forbidden",
    "wrong",
    "incorrect",
    "failed",
    "invalid user",
    "user not found",
  ],
  network: [
    "network",
    "connection",
    "timeout",
    "offline",
    "fetch",
    "request failed",
    "server unavailable",
    "connection refused",
    "network error",
    "ECONNREFUSED",
    "ENOTFOUND",
    "ECONNABORTED",
    "timeout of",
    "network request failed",
    "axios error",
    "ERR_NETWORK",
    "ERR_INTERNET_DISCONNECTED",
  ],
  server: [
    "server error",
    "internal error",
    "500",
    "502",
    "503",
    "504",
    "database",
    "service unavailable",
    "maintenance",
  ],
  authorization: [
    "permission",
    "access denied",
    "forbidden",
    "unauthorized",
    "role",
    "insufficient",
    "not allowed",
  ],
};

export function classifyError(error: Error | string): ErrorInfo {
  const errorMessage = typeof error === "string" ? error : error.message;
  const lowerMessage = errorMessage.toLowerCase();

  // Kiểm tra blacklist trước
  const isBlacklisted = NON_REPORTABLE_ERRORS.some((blacklistedError) =>
    lowerMessage.includes(blacklistedError.toLowerCase())
  );

  if (isBlacklisted) {
    return {
      category: "validation",
      message: errorMessage,
      shouldReportToSentry: false,
      userFriendlyMessage: errorMessage,
    };
  }

  // Phân loại dựa trên keywords
  for (const [category, keywords] of Object.entries(ERROR_KEYWORDS)) {
    const hasKeyword = keywords.some((keyword) =>
      lowerMessage.includes(keyword.toLowerCase())
    );

    if (hasKeyword) {
      return {
        category: category as ErrorCategory,
        message: errorMessage,
        shouldReportToSentry:
          category !== "validation" && category !== "authentication",
        userFriendlyMessage: getUserFriendlyMessage(
          errorMessage,
          category as ErrorCategory
        ),
      };
    }
  }

  // Default cho unknown errors
  return {
    category: "unknown",
    message: errorMessage,
    shouldReportToSentry: true,
    userFriendlyMessage: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
  };
}

function getUserFriendlyMessage(
  message: string,
  category: ErrorCategory
): string {
  const lowerMessage = message.toLowerCase();

  switch (category) {
    case "validation":
      return message; // Validation errors thường đã user-friendly

    case "authentication":
      if (lowerMessage.includes("password")) {
        return "Mật khẩu không chính xác. Vui lòng kiểm tra lại.";
      }
      if (lowerMessage.includes("email")) {
        return "Email không tồn tại hoặc mật khẩu không chính xác.";
      }
      return "Thông tin đăng nhập không chính xác. Vui lòng kiểm tra lại.";

    case "network":
      return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";

    case "server":
      return "Máy chủ đang gặp sự cố. Vui lòng thử lại sau.";

    case "authorization":
      return "Bạn không có quyền thực hiện hành động này.";

    default:
      return "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.";
  }
}

// Smart error handler - chỉ gửi Sentry khi cần thiết
export function smartErrorHandler(
  error: Error | string,
  options: {
    showAlert?: boolean;
    alertTitle?: string;
    customMessage?: string;
    context?: Record<string, any>;
    tags?: Record<string, string>;
    environment?: string;
    forceReport?: boolean;
  } = {}
) {
  const errorInfo = classifyError(error);
  const {
    showAlert = true,
    alertTitle = "Lỗi",
    customMessage,
    context = {},
    tags = {},
    environment = __DEV__ ? "development" : "production",
    forceReport = false,
  } = options;

  // Kiểm tra xem có nên report error không
  const shouldReport =
    forceReport ||
    (errorInfo.shouldReportToSentry &&
      shouldReportError(errorInfo.message, errorInfo.category, environment));

  // Sampling rate để giảm số lượng events
  if (shouldReport) {
    const samplingRate = getSamplingRate(environment);
    const shouldSample = Math.random() < samplingRate;

    if (shouldSample) {
      captureError(error, {
        tags: {
          category: errorInfo.category,
          environment,
          ...tags,
        },
        extra: {
          originalMessage: errorInfo.message,
          sampled: true,
          samplingRate,
          ...context,
        },
      });
    }
  }

  // Luôn hiển thị alert cho user
  if (showAlert) {
    const message = customMessage || errorInfo.userFriendlyMessage;
    // Import Alert dynamically để tránh circular dependency
    import("react-native").then(({ Alert }) => {
      Alert.alert(alertTitle, message);
    });
  }

  return {
    ...errorInfo,
    reportedToSentry: shouldReport,
    environment,
  };
}
