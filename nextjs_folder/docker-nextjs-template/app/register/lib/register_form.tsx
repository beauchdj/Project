"use client";
type db = {
  fullname: string;
  username: string;
  hashpass: string;
  usertype: string;
};

export function RegisterForm() {
  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const username = fd.get("username") as string;
    const password = fd.get("password") as string;
    const role = fd.get("role") as string;

    const dt: db = {
      fullname: username,
      username: username,
      hashpass: password,
      usertype: role,
    };

    console.log("username,password,role", dt);

    const ret = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dt),
    });

    const json = await ret.json();
    console.log("giving databack: ", json);

    form.reset();
  }

  return (
    <div className="flex w-full flex-col justify-center items-center">
      <form
        onSubmit={handleRegister}
        className="flex justify-center items-start flex-col bg-sky-50 px-22 py-8 text-black rounded-2xl"
      >
        <label className="flex flex-col">
          Full Name
          <input
            type="text"
            name="fullname"
            placeholder="Enter your name"
            className="rounded text-black border border-black"
          ></input>
        </label>
        <label className="flex flex-col">
          Username
          <input
            type="text"
            name="username"
            placeholder="Enter a username"
            className="rounded text-black border border-black"
          ></input>
        </label>
        <label className="flex flex-col">
          Password
          <input
            type="password"
            placeholder="Enter a password"
            name="password"
            className="rounded text-black border border-black"
          ></input>
        </label>
        <div className="flex gap-1 mt-1">
          <label className="flex gap-2">
            Basic
            <input
              defaultChecked
              type="radio"
              name="role"
              value="basic"
              className="cursor-pointer"
            />
          </label>
          <label className="flex gap-2">
            Service Provider
            <input
              type="radio"
              name="role"
              value="sp"
              className="cursor-pointer"
            ></input>
          </label>
        </div>
        <button className="bg-sky-600 px-4 rounded-xl w-full hover:bg-sky-500 cursor-pointer">
          Register
        </button>
      </form>
    </div>
  );
}
