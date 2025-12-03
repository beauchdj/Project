"use server";
import { UserUpdate } from "./lib/userUpdate";
import { SessionProvider } from "next-auth/react";

export default async function page() {

    return (
        <div>
            <SessionProvider>
                <UserUpdate />
            </SessionProvider>
        </div>
    );
}
