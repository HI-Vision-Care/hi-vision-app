export interface ErrorReportingConfig {
  // Bật/tắt error reporting
  enabled: boolean;

  // Environment - chỉ report trong production
  environments: string[];

  // Error categories sẽ được report
  reportableCategories: string[];

  // Error categories KHÔNG được report
  nonReportableCategories: string[];

  // Specific error messages sẽ KHÔNG được report
  blacklistedMessages: string[];

  // Specific error messages SẼ được report (override blacklist)
  whitelistedMessages: string[];

  // Sampling rate (0-1) để giảm số lượng events
  samplingRate: number;

  // Rate limiting - max events per minute
  rateLimitPerMinute: number;
}

export const DEFAULT_ERROR_CONFIG: ErrorReportingConfig = {
  enabled: true,
  environments: ["production", "staging"],
  reportableCategories: [
    "network",
    "server",
    "client",
    "authorization",
    "unknown",
  ],
  nonReportableCategories: ["validation", "authentication"],
  blacklistedMessages: [
    // Authentication errors
    "Invalid credentials",
    "Wrong password",
    "Invalid email or password",
    "Email not found",
    "Password incorrect",
    "Authentication failed",
    "Login failed",
    "Invalid username or password",
    "User not found",
    "Account locked",
    "Too many failed attempts",

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
    "Please check your input",
    "Invalid input format",
    "Required field missing",
    "Invalid data format",

    // Common user errors
    "Please try again",
    "Check your input",
    "Invalid selection",
    "Please select an option",
  ],
  whitelistedMessages: [
    // Critical errors that should always be reported
    "Database connection failed",
    "Service unavailable",
    "Critical system error",
    "Payment processing failed",
    "Security breach detected",
  ],
  samplingRate: 0.1, // 10% of errors
  rateLimitPerMinute: 10,
};

// Environment-specific configs
export const ERROR_CONFIG_BY_ENV: Record<
  string,
  Partial<ErrorReportingConfig>
> = {
  development: {
    enabled: false, // Không report trong dev
    samplingRate: 0,
  },
  staging: {
    enabled: true,
    samplingRate: 0.5, // 50% trong staging
    rateLimitPerMinute: 5,
  },
  production: {
    enabled: true,
    samplingRate: 0.1, // 10% trong production
    rateLimitPerMinute: 10,
  },
};

// Helper functions
export function shouldReportError(
  errorMessage: string,
  category: string,
  environment: string = "development"
): boolean {
  const config = {
    ...DEFAULT_ERROR_CONFIG,
    ...ERROR_CONFIG_BY_ENV[environment],
  };

  // Check if reporting is enabled
  if (!config.enabled) {
    return false;
  }

  // Check environment
  if (!config.environments?.includes(environment)) {
    return false;
  }

  // Check whitelist first (highest priority)
  if (
    config.whitelistedMessages?.some((msg) =>
      errorMessage.toLowerCase().includes(msg.toLowerCase())
    )
  ) {
    return true;
  }

  // Check blacklist
  if (
    config.blacklistedMessages?.some((msg) =>
      errorMessage.toLowerCase().includes(msg.toLowerCase())
    )
  ) {
    return false;
  }

  // Check category whitelist
  if (config.reportableCategories?.includes(category)) {
    return true;
  }

  // Check category blacklist
  if (config.nonReportableCategories?.includes(category)) {
    return false;
  }

  // Default to not reporting
  return false;
}

export function getSamplingRate(environment: string = "development"): number {
  const config = {
    ...DEFAULT_ERROR_CONFIG,
    ...ERROR_CONFIG_BY_ENV[environment],
  };
  return config.samplingRate || 0;
}

export function getRateLimit(environment: string = "development"): number {
  const config = {
    ...DEFAULT_ERROR_CONFIG,
    ...ERROR_CONFIG_BY_ENV[environment],
  };
  return config.rateLimitPerMinute || 0;
}
