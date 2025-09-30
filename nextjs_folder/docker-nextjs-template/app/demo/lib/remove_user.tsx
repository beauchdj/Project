import { User } from "next-auth";
import { useActionState } from "react";

export function RemoveUser({
  user,
  removeUser,
}: {
  user: User;
  removeUser: (user: User) => void;
}) {
  const [message, formAction, isPending] = useActionState(actionWrapper, "");

  // when the form is submitted submit http post request to the /api/users endpoint
  async function actionWrapper(prevState: string, formData: FormData) {
    const username = formData.get("username") as string;

    const users = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });
    const res: User = await users.json();

    if (res) {
      removeUser(res);
      return "Success";
    }

    return "Fail";
  }

  return (
    <form action={formAction}>
      <input name="username" type="hidden" defaultValue={user.username} />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 hover:bg-blue-900 border-black border"
      >
        Remove
      </button>
      {message &&
        (message === "Success" ? (
          <p className="text-green-400">Success</p>
        ) : (
          <p className="text-red-400">Failed</p>
        ))}
    </form>
  );
}
