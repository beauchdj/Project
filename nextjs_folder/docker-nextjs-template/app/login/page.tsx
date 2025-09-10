"use client";
import { signIn } from "next-auth/react";

export default function Page() {
  async function loginHandler(e: React.FormEvent<HTMLFormElement>) {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    e.preventDefault();

    await signIn("credentials", {
      username,
      password,
      redirect: true,
      callbackUrl: "/",
    });
  }

  return (
    <>
      <main className="flex flex-col items-center">
        <form
          onSubmit={loginHandler}
          className="flex flex-col justify-center items-center"
        >
          <input type="text" name="username" placeholder="username" />

          <input type="password" name="password" placeholder="password" />
          <button type="submit">Login</button>
        </form>
      </main>
    </>
  );
}
