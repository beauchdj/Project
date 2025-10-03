"use client";

import { users_db } from "@/app/lib/types/user_db";
import { useState } from "react";

export function RegisterForm() {
  const [isSp, setIsSp] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number>(0);
  const [serverError, setServerError] = useState<boolean>(false);

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const isSp = fd.get("isSp") as string;
    const isCustomer = fd.get("isCustomer") as string;
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
    const qualifications = fd.get("qualifications") as string;
    const providername = fd.get("providername") as string;

    const dt: users_db = {
      sp_type: sp_type,
      fullname: fullname,
      providername: providername,
      username: username,
      hashpass: password,
      isadmin: false,
      issp: !!isSp,
      iscustomer: !!isCustomer,
      qualifications: qualifications,
      city: city,
      state: state,
      zip: zip,
      street_1: street_1,
      street_2: street_2,
      phone: phone,
      email: email,
    };

    const ret = await fetch("/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dt),
    });

    await ret.json();
    console.log(ret.ok, ret.status);

    if (ret.ok) {
      setIsSp(false); // remove
      form.reset();
    } else {
    }
  }

  // function validateInput() {}

  return (
    <div className="flex w-full flex-col justify-center items-center text-black">
      <form
        onSubmit={handleRegister}
        className="flex justify-center items-start flex-col bg-emerald-700 px-12 py-8 text-black rounded-2xl w-[80%] shadow-white shadow "
      >
        <div className="flex gap-1 mt-1 flex-col w-full underline">
          Account Type:
          <div className="flex gap-1">
            <label className="flex gap-1 text-sm w-full">
              Customer
              <input
                type="checkbox"
                name="isCustomer"
                value="isCustomer"
                className="cursor-pointer"
                required={!isSp} // service provider = true, require = false, service provider = false, require = true
              />
            </label>

            <label className="flex gap-1 text-sm w-full">
              Service Provider
              <input
                type="checkbox"
                name="isSp"
                value="isSp"
                className="cursor-pointer"
                onChange={(e) => {
                  setIsSp(e.target.checked);
                }}
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
        {isSp && (
          <label className="label-col">
            Provider Name
            <input
              type="text"
              name="providername"
              placeholder="Enter service name"
              className="input-element"
              required
            ></input>
          </label>
        )}
        <label className="label-col">
          Full Name
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
        {isSp && (
          <label className="label-col">
            <div className="flex justify-between items-end">
              <span>Qualifications:</span>
              <span className="text-sm">{charLimit}/255</span>
            </div>
            <div className="flex items-end gap-1">
              <textarea
                name="qualifications"
                rows={2}
                placeholder="Enter qualifications"
                className="input-element"
                maxLength={255}
                onChange={(e) => setCharLimit(e.currentTarget.value.length)}
                required
              ></textarea>
            </div>
          </label>
        )}
        <button className="bg-sky-600 px-4 rounded-xl w-full hover:bg-sky-500 cursor-pointer mt-2 shadow-black shadow mb-2">
          Register
        </button>
        <div className="">
          <p className="flex gap-1">
            Already have an account?
            <a
              href={"/login"}
              className="underline text-lime-200 hover:text-blue-200 active:text-pink-600"
            >
              Login
            </a>
          </p>
        </div>
        {serverError && <div className="w-full text-center">{}</div>}
      </form>
    </div>
  );
}
