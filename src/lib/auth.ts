import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

/**
 * NextAuth config — credentials provider with JWT strategy.
 * Multi-user proof: each session carries a userId that scopes DashboardConfig.
 *
 * For production: swap Credentials for GitHub/Google OAuth providers.
 * The userId scoping logic in the API routes stays identical.
 */

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.name) return null; // name field stores the password hash for demo

        const valid = await bcrypt.compare(credentials.password, user.name);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.email.split("@")[0] };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
};
