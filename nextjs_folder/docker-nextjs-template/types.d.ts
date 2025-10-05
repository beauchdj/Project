export const runtime = "nodejs";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    id: string;
    address?: string;
    qualifications?: string;
    providername?: string;
    username: string;
    isAdmin?: boolean;
    isSp?: boolean;
    isCustomer?: boolean;
    email?: string;
    sp_category?: string;
    fullname?: string;
  }
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      address?: string;
      fullname?: string;
      username: string;
      sp_category?: string;
      isAdmin?: boolean;
      isSp?: boolean;
      isCustomer?: boolean;
      qualifications?: string;
      email?: string;
      providername?: string;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    };
  }
  interface User {
    id: string;
    address?: string;
    fullname?: string;
    username: string;
    password: string;
    isAdmin?: boolean;
    isSp?: boolean;
    isCustomer?: boolean;
    qualifications?: string;
    sp_category?: string;
    providername?: string;
  }
}
