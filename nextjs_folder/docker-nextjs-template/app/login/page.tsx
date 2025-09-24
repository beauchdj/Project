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
      callbackUrl: "/home",
    });
  }

  return (
    <>
      <main className="w-full flex flex-col justify-center items-center mt-4 text-white rounded-2xl">
        <form
          onSubmit={loginHandler}
          className="flex flex-col justify-center items-center h-50 w-75 bg-slate-700 rounded-3xl"
        >
          <label htmlFor="username" className="">
            Username
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input-element"
          />
          <label htmlFor="password" className="">
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-element"
          />
          <button className="btn mt-2" type="submit">
            Login
          </button>
        </form>
      </main>
    </>
  );
}
