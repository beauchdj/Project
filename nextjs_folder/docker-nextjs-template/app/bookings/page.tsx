"use server";
import { User } from "next-auth";

/**
 *
 * Common nextjs pattern is fetch data on server component (page.tsx)
 *  then use client components to manipulate that passed data and mirroring the client
 *  operations to the server with api calls
 */

// export: allow the current page, allowing other files to import this file.
// default: this is what tells nextjs which react component to show as the root component on this route (/demo)
export default async function Page() {
    //const user;
    
  return (
    <div>
      <h1>This is the Bookings Page for {session.user.fullname}, a {session.user.usertype}</h1>
    </div>
  )
}