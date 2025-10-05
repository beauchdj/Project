"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from 'next/image';

export default function Page() {
  const [isError, setIsError] = useState<boolean>(false);
  const route = useRouter();
  async function loginHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const ret = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    if (!ret.error) {
      setIsError(false);
      route.push("/home");
    } else {
      setIsError(true);
    }
    if (form) form.reset();
  }

  return (
    <div className="min-h-screen bg-[url('/ph1.jpg')] bg-cover bg-center flex items-center justify-center">

      <main>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-extrabold italic font-times-new-roman opacity-70 text-slate-900 text-8xl md:text-6xl">
            Welcome to Schwellness!
          </h1>
        </div>
        <div className="flex h-screen items-center justify-center space-x-10 opacity-84">
          <div className="flex items-center justify-center bg-emerald-900 w-3/8 h-4/8 rounded-2xl relative size-90 p-5">
            <form onSubmit={loginHandler} className="text-center">
              <label htmlFor="username" className="text-center">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input-element text-center"
                required
              />
              <label htmlFor="password" className="text-center">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-element text-center"
                required
              />

              {isError && (
                <p className="text-red-500 text-center font-bold">
                  Invalid Credentials
                </p>
              )}
              <button className="btn shadow shadow-black mt-1" type="submit">
                Login
              </button>
            </form>


          </div>
          <div className="flex items-center justify-center bg-emerald-900 w-3/8 h-4/8 rounded-2xl relative size-90">
            <p className="text-center text-xl font-extrabold italic">
              Don&apos;t have an account?{" "}
              <br></br>
              <a
                href={"/register"}
                className="underline text-blue-600 visited:text-purple-500 hover:text-blue-200 text-2xl"
              >
                Register
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
