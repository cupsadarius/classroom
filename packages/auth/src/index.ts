import NextAuth from "next-auth";
import { authConfig } from "./config";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);

export { authConfig } from "./config";
export { mintRealtimeToken, verifyRealtimeToken, verifySessionToken } from "./verify";

// Session/JWT augmentation — adds our id + roles to the Auth.js types.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles: string[];
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
  interface User {
    roles?: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    roles: string[];
  }
}
