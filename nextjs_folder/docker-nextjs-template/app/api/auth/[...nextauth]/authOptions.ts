// app/api/auth/[...nextauth]/authOptions.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import GitHubProvider from "next-auth/providers/github";
// AuthOptions should define the providers 
// along with what pages to use for signIn instead of default
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Replace this with your real user lookup
        const user = {
          id: "123",
          username: credentials?.username || "defaultUser",
          price: 4200,
          poop: "💩",
        };

        if (user) return user;
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',  
    maxAge: 1 // set the age of the token (seconds)
  },
  callbacks: {
    // extra types are defined in types/next-auth.d.ts (price and poop)
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.price = user.price;
        token.poop = user.poop;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.price = token.price as number;
        session.user.poop = token.poop as string;
      }
      return session;
    },
  },
};
