export const runtime = "nodejs";
/**
 * About auth.ts
 *  THE TYPES BEHIND ALLOWING THIS ARE IN types.d.ts  !!!!
 *  ORDER OF callbacks: {jwt(),session()} is jwt first then session
 *  SESSION IS UNDEFINED IN callbacks: {jwt()} ONLY TOKEN AND USER
 *  SESSION WILL USE TOKEN TO CHOOSE WHAT TO SHOW TO USER ON useSession() being called
 *  NEXTAUTH({...}) ACCEPTS session: { strategy: 'database' | 'jwt' } CHANGES WHAT IS AVAIL
 */
import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { users_db } from "./app/lib/types/user_db";
// import { getPassword } from "./lib/queries";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt", // json-web-token, a way to hold an entire session in the users cookie, encrypts the data with our AUTH_SECRET in .env.local
    maxAge: 60 * 10, // 10 minutes
    updateAge: 0,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token && user) {
        token.id = user.id;
        token.address = user.address;
        token.email = user.email!;
        token.sp_category = user.sp_category;
        token.isAdmin = user.isAdmin;
        token.isSp = user.isSp;
        token.isCustomer = user.isCustomer;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.address = token.address;
        session.user.isAdmin = token.isAdmin;
        session.user.isSp = token.isSp;
        session.user.isCustomer = token.isCustomer;
        session.user.sp_category = token.sp_category;
        session.user.email = token.email!;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        username: {
          type: "text",
          label: "Username",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      authorize: async (credentials) => {
        const username = credentials.username as string;
        const password = credentials.password as string;

        const ret = await fetch("http://localhost:3000/api/accounts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username }),
        });

        if (ret.status === 401) {
          return null;
        }

        const json: users_db = await ret.json();

        const comp = await bcrypt.compare(password, json.hashpass);

        const retUser: User = {
          id: json.id!,
          address: json.street_1,
          email: json.email,
          isAdmin: json.isAdmin,
          isSp: json.isSp,
          isCustomer: json.isCustomer,
          username: json.username,
          sp_category: json.sp_type,
          password: json.hashpass,
        };

        if (!comp || !retUser) return null;

        return retUser;
      },
    }),
  ],
});
