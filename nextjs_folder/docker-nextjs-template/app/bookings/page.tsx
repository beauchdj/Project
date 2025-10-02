"use server";
import { User } from "next-auth";

/**
 *
 * Common nextjs pattern is fetch data on server component (page.tsx)
 *  then use client components to manipulate that passed data and mirroring the client
 *  operations to the server with api calls
 */

/**
 * Accessing the session:
 *  if "use server" => use: const session = await auth();
 *  if "use client" => use   const { data: session, status } = useSession();
 *    For the useSession() version: This is a react hook, this hook will call backend to get the users session
 */

// export: allow the current page, allowing other files to import this file.
// default: this is what tells nextjs which react component to show as the root component on this route (/demo)
export default async function Page() {
  //const user;

  return (
    <div className="flex justify-center items-center flex-col">
      <p>This is the appointments page for my jira ticket</p>
    </div>
  );
}
