import { auth } from "@/auth";
import { pool } from "@/lib/db";
import { User } from "@/app/lib/types/User";
import { redirect } from "next/navigation";
import { UserList } from "../lib/UserList";

export default async function page() {
  const session = await auth();
  if (!session?.user || !session?.user.isAdmin) redirect("/");
  const users: User[] = await fetchAllUsers();

  return <UserList users={users} />;
}

async function fetchAllUsers(): Promise<User[]> {
  try {
    const res = await pool.query("SELECT * FROM users");

    return res.rows;
  } catch (error) {
    console.log("Failed to fetchAllUsers() ", error);
    return [];
  }
}
