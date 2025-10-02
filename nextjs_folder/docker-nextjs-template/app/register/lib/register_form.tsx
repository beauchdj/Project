"use client";

import { users_db } from "@/app/lib/types/user_db";
import { useState } from "react";

export function RegisterForm() {
  const [isSp, setIsSp] = useState<boolean>(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const role = fd.get("role") as string;
    const sp_type = fd.get("sp-type") as string;
    const fullname = fd.get("fullname") as string;
    const username = fd.get("username") as string;
    const password = fd.get("password") as string;
    const city = fd.get("city") as string;
    const state = fd.get("state") as string;
    const zip = fd.get("zipcode") as string;
    const street_1 = fd.get("street_1") as string;
    const street_2 = fd.get("street_2") as string;
    const phone = fd.get("phone") as string;
    const email = fd.get("email") as string;

    const dt: users_db = {
      sp_type: sp_type,
      fullname: fullname,
      username: username,
      hashpass: password,
      usertype: role,
      city: city,
      state: state,
      zip: zip,
      street_1: street_1,
      street_2: street_2,
      phone: phone,
      email: email,
    };

    // const validate;

    const ret = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dt),
    });

    const json = await ret.json();

    console.log("giving data back: ", json);

    setIsSp(false);
    form.reset();
  }

  return (
    <div className="flex w-full flex-col justify-center items-center text-black">
      <form
        onSubmit={handleRegister}
        className="flex justify-center items-start flex-col bg-lime-200 px-12 py-8 text-black rounded-2xl w-[80%] shadow-white shadow underline"
      >
        <div className="flex gap-1 mt-1 flex-col w-full">
          Account Type:
          <div className="flex gap-1">
            <label className="flex gap-1 text-sm w-full">
              Basic
              <input
                defaultChecked
                type="radio"
                name="role"
                value="basic"
                className="cursor-pointer"
                onChange={() => setIsSp(false)}
              />
            </label>

            <label className="flex gap-1 text-sm w-full">
              Service Provider
              <input
                type="radio"
                name="role"
                value="service provider"
                className="cursor-pointer"
                onChange={() => setIsSp(true)}
              ></input>
            </label>
          </div>
          {isSp && (
            <div className="flex flex-col text-center">
              Service Provider Type:
              <label className="flex gap-1 text-sm">
                Beauty
                <input
                  type="radio"
                  name="sp-type"
                  value="beauty"
                  className="cursor-pointer"
                  defaultChecked
                ></input>
              </label>
              <label className="flex gap-1 text-sm">
                Medical
                <input
                  type="radio"
                  name="sp-type"
                  value="medical"
                  className="cursor-pointer"
                ></input>
              </label>
              <label className="flex gap-1 text-sm">
                Fitness
                <input
                  type="radio"
                  name="sp-type"
                  value="fitness"
                  className="cursor-pointer"
                ></input>
              </label>
            </div>
          )}
        </div>

        <label className="label-col">
          {isSp ? <>Provider Name</> : <>Full Name</>}
          <input
            type="text"
            name="fullname"
            placeholder="Enter your name"
            className="input-element"
            required
          ></input>
        </label>

        <label className="label-col">
          Username
          <input
            type="text"
            name="username"
            placeholder="Enter a username"
            className="input-element"
            required
          ></input>
        </label>

        <label className="label-col">
          Password
          <input
            type="password"
            placeholder="Enter a password"
            name="password"
            className="input-element"
            required
          ></input>
        </label>

        <label className="label-col">
          City
          <input
            type="text"
            name="city"
            className="input-element"
            placeholder="Enter your city"
            required
          ></input>
        </label>

        <label className="label-col">
          State
          <input
            type="text"
            name="state"
            className="input-element"
            placeholder="Enter your state"
            required
          ></input>
        </label>

        <label className="label-col">
          Zip Code
          <input
            type="text"
            name="zipcode"
            className="input-element"
            placeholder="Enter your zip code"
            required
          ></input>
        </label>

        <label className="label-col">
          Address One
          <input
            type="text"
            name="street_1"
            className="input-element"
            placeholder="Primary address"
            required
          ></input>
        </label>

        <label className="label-col">
          Address Two (Optional)
          <input
            type="text"
            name="street_2"
            className="input-element"
            placeholder="Secondary address"
          ></input>
        </label>

        <label className="label-col">
          Phone
          <input
            type="text"
            name="phone"
            className="input-element"
            placeholder="Phone number"
            required
          ></input>
        </label>

        <label className="label-col">
          Email
          <input
            type="text"
            name="email"
            className="input-element"
            placeholder="Email address"
            required
          ></input>
        </label>
        <button className="bg-sky-600 px-4 rounded-xl w-full hover:bg-sky-500 cursor-pointer mt-2 shadow-black shadow">
          Register
        </button>
      </form>
    </div>
  );
}
