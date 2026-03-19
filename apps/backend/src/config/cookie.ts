import CONFIG from "@n8n/config";
import ms, { type StringValue } from "ms";

export function generateCookieOptions() {
    const expiry = "7d";
    return {
      httpOnly: true,
      secure: CONFIG.NODE_ENV === "production",
      sameSite: CONFIG.NODE_ENV === "production" ? "none" as const : "lax" as const,
      maxAge: ms(expiry as StringValue),
    };
  }