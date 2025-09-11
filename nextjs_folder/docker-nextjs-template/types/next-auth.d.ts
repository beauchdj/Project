/**
 * This file next-auth.d.ts can define the session and JWT type of our app
 *  JWT will have default values kept but Session will need to be appended 
 *  with default session type
 */
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
    interface User {
    id: string;
    username: string;
    price: number;
    poop: string;
  }

  interface Session {
    user: {
      id: string,
      username: string,
      price: number,
      poop:string
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    price: number,
    id: string,
    username: string,
    poop: string
  }
}