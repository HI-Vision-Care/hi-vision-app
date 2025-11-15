// services/auth/google-auth.ts
import {
  ResponseType,
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
} from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
};

export function useGoogleAuth() {
  const redirectUri = makeRedirectUri({
    scheme: "hivisionmobileapp", // phải khớp app.json
    // Expo Go (dev) nên bật proxy cho dễ:
    // useProxy: true,
  });

  const [request, response, promptAsync] = useAuthRequest(
    {
      // Với generic OAuth, bạn dùng 1 clientId phù hợp platform hiện tại.
      // Nếu muốn tiện hơn, dùng provider: `expo-auth-session/providers/google`
      clientId:
        process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID! ||
        "550800866011-qh4nbkuccqpe1cjeangkrf0bsgjitiri.apps.googleusercontent.com",
      scopes: ["openid", "email", "profile"],
      responseType: ResponseType.Code,
      usePKCE: true, // ✅ bật PKCE cho code flow
      redirectUri,
    },
    discovery
  );

  const loginWithGoogle = async () => {
    const res = await promptAsync();
    if (res.type !== "success") return;

    // Đổi code -> tokens (KHÔNG cần client secret vì có PKCE)
    const tokenRes = await exchangeCodeAsync(
      {
        code: res.params.code!,
        clientId:
          process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID! ||
          "550800866011-qh4nbkuccqpe1cjeangkrf0bsgjitiri.apps.googleusercontent.com",
        redirectUri,
      },
      { tokenEndpoint: discovery.tokenEndpoint! }
    );

    const accessToken = tokenRes.accessToken;
    if (!accessToken) throw new Error("No access token");

    const apiBase = process.env.EXPO_PUBLIC_API_URL;
    const beRes = await fetch(`${apiBase}/auth/google/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken }),
    });
    // ... xử lý như bạn đã làm (lưu token/role, điều hướng)
  };

  return { loginWithGoogle, ready: !!request };
}
