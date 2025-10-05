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
    <div className="min-h-screen relative flex items-center justify-center">
      <div className="absolute inset-0 bg-[url('/ph1.jpg')] bg-cover bg-center blur-xs z-0"></div>
      <div className="absolute inset-0 bg-purple-900 opacity-15">
      </div>
      <main className="relative z-10 flex flex-col items-center gap-10">
        <div className="flex flex-col items-center justify-center">
          <h1 className="font-extrabold italic font-serif
              text-slate-900 md:text-4xl text-center
              bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-emerald-900
              drop-shadow-lg
              transform transition-all duration-500 hover:scale-120 hover:drop-shadow-xl hover:z-20">
            Welcome to Schwellness!
          </h1>
        </div>
        <div className="flex items-center justify-center space-x-10 opacity-84">
          <div className="flex items-center justify-center bg-emerald-900 w-70 h-96 flex-shrink-0 rounded-2xl relative p-5
                          drop-shadow-lg transform transition-all duration-1000 hover:scale-150 hover:z-50 hover:shadow-2xl">
            <form onSubmit={loginHandler} className="text-center flex flex-col items-center">
              <p className="italic font-serif mb-1 bg-clip-text text-transparent bg-gradient-to-r from-lime-300 to-emerald-600">
                Let's get back to your Schwellness journey
              </p>
              <label htmlFor="username" className="text-center text-white text-lg mb-1 font-arial">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input-element text-center p-2 rounded-md mb-4"
                required
              />
              <label htmlFor="password" className="text-center text-white text-lg mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="input-element text-center p-2 rounded-md mb-6"
                required
              />

              {isError && (
                <p className="text-red-500 text-center text-2xl font-bold">
                  Invalid Credentials
                </p>
              )}
              <br></br>
              <button
                className="w-50 h-28 rounded-full flex items-center justify-center
                  text-white text-xl font-bold
                  bg-gradient-to-r from-teal-500 to-emerald-600
                  shadow-lg hover:from-teal-600 hover:to-emerald-700
                  transition-all duration-150 transform hover:scale-105 mb-10
                  cursor-pointer hover:cursor-pointer"
                type="submit">
                Login
              </button>
            </form>


          </div>
          <div className="flex items-center justify-center bg-emerald-900 w-70 h-40 flex-shrink-0 rounded-2xl relative
                          drop-shadow-lg transform transition-all duration-1000 hover:scale-150 hover:drop-shadow-xl hover:z-50 hover:shadow-2xl">
            <p className="text-center text-xl font-extrabold italic text-white">
              Don&apos;t have an account?{" "}
              <br></br>
              <a
                href={"/register"}
                className="underline text-blue-400 visited:text-purple-300 hover:text-blue-200 text-2xl"
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
