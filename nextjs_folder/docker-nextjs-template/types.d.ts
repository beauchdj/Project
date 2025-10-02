export const runtime = "nodejs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    address?: string;
    username: string;
    usertype?: string;
    email?: string;
    sp_category?: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      address?: string;
      fullname?: string;
      username: string;
      usertype?: string;
      sp_category?: string;
      email?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    };
  }
  interface User {
    email_?: string;
    address?: string;
    fullname?: string;
    username: string;
    password: string;
    usertype?: string;
    sp_category?: string;
  }
}
