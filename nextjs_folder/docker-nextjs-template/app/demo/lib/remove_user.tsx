"use client";
import { User } from "next-auth";

export function RemoveUser({
  user,
  removeUser,
}: {
  user: User;
  removeUser: (user: string) => void;
}) {
  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;

    const ret = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });

    const json = await ret.json();
    console.log("This is json: ", json);
    const user = JSON.parse(json);
    console.log("after json.parse: ", user);

    if (ret) {
      removeUser(user.username);
    }
  };

  return (
    <form onSubmit={handleDelete} className="">
      <input name="username" type="hidden" defaultValue={user.username} />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-900 border-black border px-2 cursor-pointer hover:text-red-500"
      >
        X
      </button>
    </form>
  );
}
