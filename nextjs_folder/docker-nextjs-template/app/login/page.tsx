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
    <form onSubmit={loginHandler} className="">
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
      <button className="btn shadow shadow-black mt-2" type="submit">
        Login
      </button>
    </form>
  );
}
