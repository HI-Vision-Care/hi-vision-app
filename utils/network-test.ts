import api from "@/config/axios";
import apiAlternative from "@/config/axios-alternative";

export interface NetworkTestResult {
  success: boolean;
  message: string;
  details?: any;
}

export const testNetworkConnection = async (): Promise<NetworkTestResult> => {
  try {
    console.log("Testing network connection...");

    // Test basic connectivity
    const response = await api.post(
      "/account/login",
      {
        email: "test@test.com",
        password: "test123",
      },
      {
        timeout: 10000, // 10 second timeout for test
      }
    );

    return {
      success: true,
      message: "Network connection successful",
      details: {
        status: response.status,
        statusText: response.statusText,
      },
    };
  } catch (error: any) {
    console.log("Network test failed:", error);

    // Check if it's a network error or server error
    if (!error.response) {
      return {
        success: false,
        message: "Network connection failed - No response from server",
        details: {
          error: error.message,
          code: error.code,
          name: error.name,
        },
      };
    }

    // If we get a response, the network is working but the request failed
    return {
      success: true,
      message: "Network connection working (got server response)",
      details: {
        status: error.response.status,
        statusText: error.response.statusText,
        message: error.response.data?.message || "Server returned error",
      },
    };
  }
};

export const testAlternativeConnection =
  async (): Promise<NetworkTestResult> => {
    try {
      console.log("Testing alternative network connection...");

      // Test with alternative configuration
      const response = await apiAlternative.post(
        "/account/login",
        {
          email: "test@test.com",
          password: "test123",
        },
        {
          timeout: 15000, // 15 second timeout for test
        }
      );

      return {
        success: true,
        message: "Alternative network connection successful",
        details: {
          status: response.status,
          statusText: response.statusText,
        },
      };
    } catch (error: any) {
      console.log("Alternative network test failed:", error);

      // Check if it's a network error or server error
      if (!error.response) {
        return {
          success: false,
          message:
            "Alternative network connection failed - No response from server",
          details: {
            error: error.message,
            code: error.code,
            name: error.name,
            stack: error.stack,
          },
        };
      }

      // If we get a response, the network is working but the request failed
      return {
        success: true,
        message: "Alternative network connection working (got server response)",
        details: {
          status: error.response.status,
          statusText: error.response.statusText,
          message: error.response.data?.message || "Server returned error",
        },
      };
    }
  };

export const testSignUpAPI = async (): Promise<NetworkTestResult> => {
  try {
    console.log("Testing SignUp API...");

    const response = await api.post(
      "/account/register",
      {
        email: "test@example.com",
        password: "test123456",
        phone: "0123456789",
      },
      {
        timeout: 10000,
      }
    );

    return {
      success: true,
      message: "SignUp API working",
      details: response.data,
    };
  } catch (error: any) {
    console.log("SignUp API test failed:", error);

    if (!error.response) {
      return {
        success: false,
        message: "SignUp API network error",
        details: {
          error: error.message,
          code: error.code,
        },
      };
    }

    return {
      success: true,
      message: "SignUp API accessible (got response)",
      details: {
        status: error.response.status,
        message: error.response.data?.message || "Server error",
      },
    };
  }
};
