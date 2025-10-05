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
    <main>
      {/* <Image className="" src={myImage} /> */}
       {/* <div className="min-h-screen bg-[url('/ph1.jpg')] bg-cover bg-center flex items-center justify-center p-6"> */}
      <div className="flex h-screen items-center justify-center space-x-10">
        <div className="flex w-1/4 h-5/8 rounded-2xl bg-emerald-900 relative size-90">
          <form onSubmit={loginHandler} className="">
            <label htmlFor="username" className="">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input-element"
              required
            />
            <label htmlFor="password" className="">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input-element"
              required
            />

            {isError && (
              <p className="text-red-500 w-9/10 text-center font-bold">
                Invalid Credentials
              </p>
            )}
            <button className="btn shadow shadow-black mt-1" type="submit">
              Login
            </button>
            <br></br>
            <br></br>
            <div className="flex items-center justify-center">
              <h3 className="text-center">Welcome back! Lets get you Schwell!</h3>
            </div>
          </form>


        </div>
        <div className="flex items-center justify-center bg-emerald-900 w-1/4 h-5/8 rounded-2xl relative size-90 ">
          <p className="text-center">
            Don&apos;t have an account?{" "}
            <a
              href={"/register"}
              className="underline text-blue-600 visited:text-purple-500 hover:text-blue-200"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
