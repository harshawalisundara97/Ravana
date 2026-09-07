import type { NextAuthConfig } from "next-auth";

// Edge-safe config: no database adapter, no Node-only providers here.
// Consumed by both auth.ts (full, Node runtime) and middleware.ts (Edge runtime).
export default {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.id = (user as { id?: string }).id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
    authorized: ({ auth, request }) => {
      const isLoggedIn = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/admin")) {
        return isLoggedIn && role === "admin";
      }
      if (pathname.startsWith("/seller")) {
        return isLoggedIn && (role === "seller" || role === "admin");
      }
      if (pathname === "/dashboard" || pathname === "/wallet" || pathname === "/messages" || pathname === "/notifications") {
        return isLoggedIn;
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
