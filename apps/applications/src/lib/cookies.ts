import Cookies from "js-cookie";

const TOKEN_KEY = "access_token";
const TOKEN_EXPIRES = 1; // 1 dia

export const cookieUtils = {
  setToken(token: string) {
    Cookies.set(TOKEN_KEY, token, {
      expires: TOKEN_EXPIRES,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  },

  getToken(): string | undefined {
    if (typeof window === "undefined") return undefined;
    return Cookies.get(TOKEN_KEY);
  },

  removeToken() {
    if (typeof window === "undefined") return;
    Cookies.remove(TOKEN_KEY);
  },

  hasToken(): boolean {
    if (typeof window === "undefined") return false;
    return !!this.getToken();
  },
};
