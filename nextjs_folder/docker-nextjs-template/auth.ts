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

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt", // json-web-token, a way to hold an entire session in the users cookie, encrypts the data with our AUTH_SECRET in .env.local
    maxAge: 6, // 60 seconds
    updateAge: 0,
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("jwt: ", token, user);
      if (token && user) {
        token.poop = user.poop;
        token.price = user.price;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      // `session.user.address` is now a valid property, and will be type-checked
      if (token) {
        session.user.username = token.username;
        session.user.poop = token.poop;
        session.user.price = token.price;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      // THESE ARE FOR BUILT-IN PAGES NOT USING IT THO
      // maybe this actually sets the type of the credentials pass in?
      // credentials: {
      //   email: {
      //     type: "text",
      //     label: "Username",
      //     placeholder: "Username",
      //   },
      //   password: {
      //     type: "password",
      //     label: "Password",
      //     placeholder: "Password",
      //   },
      // },
      authorize: async (credentials) => {
        // console.log("authorize credentials: ", credentials);
        const user: User = {
          username: credentials.username as string,
          address: "123 lane dr",
          role: "custer",
          price: "4200",
          poop: "💩",
        };

        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password);

        // logic to verify if the user exists
        // user = await getUserFromDb(credentials.email, pwHash);

        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.");
        }

        // console.log("authorizing this user: ", user);
        // return user object with their profile data
        return user;
      },
    }),
  ],
});
