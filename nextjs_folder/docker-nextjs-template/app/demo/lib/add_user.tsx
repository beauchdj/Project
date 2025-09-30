"use client";

import { User } from "next-auth";
import { useActionState } from "react";

export function AddUser({ addUser }: { addUser: (user: User) => void }) {
  const [message, formAction, isPending] = useActionState(actionWrapper, "");

  // when the form is submitted submit http post request to the /api/users endpoint
  async function actionWrapper(prevState: string, formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log("actionWrapper: ", username);
    const users = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    });
    const res: User = await users.json();

    if (res) {
      addUser(res);
      return "Success";
    }

    return "Fail";
  }

  return (
    <div className="bg-white text-black p-4">
      <form
        action={formAction}
        className="flex flex-col justify-center items-center  rounded-xl gap-2"
      >
        <input
          name="username"
          type="text"
          className="bg-black text-white rounded-xl indent-2 w-full"
          placeholder="Enter username"
        />
        <input
          name="password"
          type="password"
          placeholder="Enter password"
          className="bg-black text-white rounded-xl indent-2 w-full"
        />
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-400 hover:bg-blue-300 px-2 h-6 w-[50%] text-black border-black border rounded cursor-pointer"
        >
          Submit
        </button>
        {message &&
          (message === "Success" ? (
            <p className="ml-2 text-green-600">Success</p>
          ) : (
            <p className="text-red-500">Failed</p>
          ))}
      </form>
    </div>
  );
}
