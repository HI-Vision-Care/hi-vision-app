// Test using native fetch instead of axios
export interface FetchTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const testFetchConnection = async (): Promise<FetchTestResult> => {
  try {
    console.log("Testing fetch connection...");

    const baseURL = "https://hivision.io.vn/HiVision";
    const url = `${baseURL}/account/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: "test@test.com",
        password: "test123",
      }),
      // Add timeout using AbortController
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
    });

    console.log("Fetch response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    const data = await response.json();

    return {
      success: true,
      message: "Fetch connection successful",
      details: {
        status: response.status,
        statusText: response.statusText,
        data: data,
      },
    };
  } catch (error: any) {
    console.log("Fetch test failed:", error);

    if (error.name === "AbortError") {
      return {
        success: false,
        message: "Fetch request timeout",
        details: {
          error: error.message,
          name: error.name,
        },
      };
    }

    return {
      success: false,
      message: "Fetch connection failed",
      details: {
        error: error.message,
        name: error.name,
        stack: error.stack,
      },
    };
  }
};

export const testBasicConnectivity = async (): Promise<FetchTestResult> => {
  try {
    console.log("Testing basic connectivity...");

    // Test basic HTTP connectivity
    const response = await fetch("https://hivision.io.vn", {
      method: "HEAD",
      signal: AbortSignal.timeout(10000), // 10 seconds timeout
    });

    return {
      success: true,
      message: "Basic connectivity successful",
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  } catch (error: any) {
    console.log("Basic connectivity test failed:", error);

    return {
      success: false,
      message: "Basic connectivity failed",
      details: {
        error: error.message,
        name: error.name,
        code: error.code,
      },
    };
  }
};
