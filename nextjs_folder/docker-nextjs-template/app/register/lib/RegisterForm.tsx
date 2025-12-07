/* Daniel Beauchaine
*  October 2025
*  Page for registration. Information is stored client side between pages,
*  Only submitted when form is submitted
*/

"use client";

import { users_db } from "@/app/lib/types/user_db";
import { stat } from "fs";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export function RegisterForm() {
  //Page 1
  const [showNameError, setShowNameError] = useState<boolean>(false);
  const [typeError, setTypeError] = useState<boolean>(false);
  const [isSp, setIsSp] = useState<boolean>(false);
  const [showSpNameError, setShowSpNameError] = useState<boolean>(false);
  //Page 2
  const [showEmailError, setShowEmailError] = useState<boolean>(false);
  const [showPhoneError, setShowPhoneError] = useState<boolean>(false);
  const [showAddressError, setShowAddressError] = useState<boolean>(false);
  const [showCity, setShowCity] = useState<boolean>(false);
  const [stateError, setStateError] = useState<boolean>(false);
  const [showZip, setShowZip] = useState<boolean>(false);
  //Page 3
  const [charLimit, setCharLimit] = useState<number>(0);
  const [serverError, setServerError] = useState<boolean>(false);
  const router = useRouter();
  //Page 4
  const [showUsernameError, setShowUsernameError] = useState<boolean>(false);
  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);

  //Page counters and form retention
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progressPercent = ((currentStep - 1) / (totalSteps)) * 100;
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState({
    isSp: isSp,
    isCustomer: false,
    sp_type: "beauty",
    fullname: "",
    username: "",
    password: "",
    city: "",
    state: "",
    zipcode: "",
    street_1: "",
    street_2: "",
    phone: "",
    email: "",
    qualifications: "",
    providername: ""
  });

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    if (currentStep < totalSteps) {
      return;
    }
    e.preventDefault();
    setServerError(false);
    const isCustomer = formData.isCustomer;
    const sp_type = formData.sp_type as string;
    const fullname = formData.fullname as string;
    const username = formData.username as string;
    const password = formData.password as string;
    const city = formData.city as string;
    const state = formData.state as string;
    const zip = formData.zipcode as string;
    const street_1 = formData.street_1 as string;
    const street_2 = formData.street_2 as string;
    const phone = formData.phone as string;
    const email = formData.email as string;
    const qualifications = formData.qualifications as string;
    const providername = formData.providername as string;
    const isValid = validateStep4();
    if (isValid) {
      const dt: users_db = {
        sp_type: isSp ? sp_type : "",
        fullname: fullname,
        providername: providername,
        username: username,
        hashpass: password,
        isadmin: false,
        issp: isSp,
        iscustomer: isCustomer,
        qualifications: isSp ? qualifications : "",
        city: city,
        state: state,
        zip: zip,
        street_1: street_1,
        street_2: street_2,
        phone: phone,
        email: email,
      };
      setCurrentStep(currentStep + 1);
      const ret = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dt),
      });

      await ret.json();

      if (ret.ok) {
        await waitFunction();
        setServerError(false);
        router.push("/login");
      } else {
        setServerError(true);
        setCurrentStep(4);
      }
    }
  }

  function sleep(ms: number | undefined) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function waitFunction() {
    await sleep(1300); // Pause for 2 seconds (2000 milliseconds)
  }

  //Validation Helpers
  //Page 1
  function validateName(
  ): boolean {
    var nameTest = formData.fullname.length > 0;
    setShowNameError(!nameTest);
    return nameTest;
  }

  function validateType(
  ): boolean {
    var typeValid = isSp || formData.isCustomer;
    setTypeError(!typeValid);
    return typeValid;
  }

  function validateSpName(
  ): boolean {
    var nameTest = formData.providername.length > 0;
    setShowSpNameError(!nameTest);
    return nameTest;
  }

  //Page 2
  function validatePhone(
  ): boolean {
    const phoneRegex: RegExp = new RegExp(
      "^(\\+1)?[\\s.-]?(\\(?\\d{3}\\)?[\\s.-]?)?\\d{3}[\\s.-]?\\d{4}$"
    );
    const phoneTest = phoneRegex.test(formData.phone);
    setShowPhoneError(!phoneTest);
    return phoneTest;
  }

  function validateEmail(
  ): boolean {
    const emailRegex: RegExp = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$"
    );
    const emailTest = emailRegex.test(formData.email);
    setShowEmailError(!emailTest);
    return emailTest;
  }

  //Page 3
  function validateAddress(
  ): boolean {
    var addressTest = formData.street_1.length > 0;
    setShowAddressError(!addressTest);
    return addressTest;
  }

  function validateCity(
  ): boolean {
    const cityRegex: RegExp = new RegExp("^[a-zA-Z\\s'-]+$");
    const cityTest = cityRegex.test(formData.city);
    setShowCity(!cityTest);
    return cityTest;
  }

  function validateState(
  ): boolean {
    const validStates = [
      "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
      "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
      "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
      "AS", "FM", "GU", "MH", "MP", "PW", "PR", "VI"
    ]
    var stateTest = validStates.includes(formData.state.toUpperCase())
    setStateError(!stateTest);
    return stateTest;
  }
  function validateZip(
  ): boolean {
    const zipRegex: RegExp = new RegExp("^\\d{5}$");
    const zipTest = zipRegex.test(formData.zipcode);
    setShowZip(!zipTest);
    return zipTest;
  }

  //Page 4
  function validateUsername(
  ): boolean {
    var usernameTest = formData.username.length > 0;
    setShowUsernameError(!usernameTest);
    return usernameTest;
  }
  function validatePassword(
  ): boolean {
    var passwordTest = formData.password.length > 0;
    setShowPasswordError(!passwordTest);
    return passwordTest;
  }

  //Pagination Validation
  function validateStep1(
  ): boolean {
    var nameVal = validateName();
    var spNameVal = true;
    if (isSp) {
      spNameVal = validateSpName();
    } else {
      formData.providername = "";
    }
    return validateType() && spNameVal && nameVal;
  }

  function validateStep2(
  ): boolean {
    var emailVal = validateEmail();
    return validatePhone() && emailVal;
  }

  function validateStep3(
  ): boolean {
    var addrVal = validateAddress();
    var cityVal = validateCity();
    var stateVal = validateState();
    return validateZip() && addrVal && cityVal && stateVal;
  }

  function validateStep4(
  ): boolean {
    var nameVal = validateUsername();
    return validatePassword() && nameVal;
  }

  // Handle the button navigation

  function handleChange(e: { target: { name: string; value: string; type: string; checked: boolean } }) {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    } else if (currentStep === 3) {
      if (!validateStep3()) {
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Button Presses

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextButtonRef.current?.click();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      prevButtonRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col w-full h-screen items-center bg-[rgba(6,78,59,0.5)] text-slate-300">
      {/* Header + Progress */}
      <div className="flex-row w-full max-w-2xl px-6 py-6">
        {currentStep < totalSteps + 1 && (
          <p className="text-sm text-gray-200 uppercase">
            Step {currentStep} of {totalSteps}
          </p>
        )}
        {currentStep > totalSteps && (
          <p className="text-sm text-gray-200 uppercase">
            Success!
          </p>
        )}
        <h2 className="text-2xl font-bold">Your Profile</h2>
        {currentStep == 1 && (
          <p className="text-gray-300 mb-4">Please use your full name, select your use case (or both!) and if you're a service provider, please provide a business name</p>
        )}
        {currentStep == 2 && (
          <p className="text-gray-300 mb-4">Please enter your contact information</p>
        )}
        {currentStep == 3 && (
          <p className="text-gray-300 mb-4">Please provide your address</p>
        )}
        {currentStep == 4 && (
          <p className="text-gray-300 mb-4">Pick a username and password and you're ready to get schwell!</p>
        )}
        {currentStep > totalSteps && (
          <p className="text-gray-300 mb-4">Submitting account detailes...</p>
        )}
        <div className="bg-gray-700 rounded-full h-4 shadow-lg">
          <div
            className="bg-gradient-to-r from-emerald-500 to-sky-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        <p className="text-right text-xs text-gray-300 mt-1">
          {Math.round(progressPercent)}%
        </p>
      </div>
      <div className="">
        <p className="flex col gap-1">
          Already have an account?
          <a
            href={"/login"}
            className="underline text-lime-200 hover:text-blue-200 active:text-pink-600"
          >
            Login
          </a>
        </p>
      </div>
      {/* Form */}
      <div className="flex w-full max-w-2xl px-6 py-6 items-start justify-between gap- items-stretch ${currentStep === 4 ? 'justify-center' : 'justify-between'}">
        <div className="flex-grow">
          <form
            onKeyDown={handleKeyDown}
            onSubmit={handleRegister}
            className="flex flex-col items-start bg-emerald-800/90 border-black border-3 px-12 py-8 text-slate-200 rounded-2xl w-full shadow-black shadow overflow-auto opacity-97"
          >
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="flex gap-1 mt-1 flex-col w-full">
                <label className="label-col">
                  Full Name
                  <input
                    type="text"
                    onChange={handleChange}
                    name="fullname"
                    value={formData.fullname}
                    placeholder="Enter your name here..."
                    className="input-element"
                    required
                  ></input>
                  {showNameError && <p className="error-text">Please enter your full name</p>}
                </label>

                Account Type:
                <div className="flex gap-1">
                  <label className="flex items-center gap-2">
                    Customer
                    <input
                      type="checkbox"
                      onChange={handleChange}
                      checked={formData.isCustomer}
                      name="isCustomer"
                      value="isCustomer"
                      className="w-7 h-7 accent-sky-500 cursor-pointer"
                      required={!isSp} // service provider = true, require = false, service provider = false, require = true
                    />
                  </label>

                  <label className="flex items-center gap-2">
                    Service Provider
                    <input
                      type="checkbox"
                      name="isSp"
                      value="isSp"
                      className="w-7 h-7 accent-emerald-500 cursor-pointer"
                      onChange={(e) => {
                        setIsSp(e.target.checked);
                      }}
                      checked={isSp}
                    ></input>
                  </label>
                </div>
                {typeError && <p className="error-text">Please select an account type, or both</p>}


                {isSp && (
                  <label className="label-col">
                    Provider Name
                    <input
                      type="text"
                      name="providername"
                      placeholder="Enter service name"
                      className="input-element"
                      onChange={handleChange}
                      value={formData.providername}
                      required
                    ></input>
                    {showSpNameError && <p className="error-text">Please enter your business name</p>}
                  </label>
                )}
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (

              <div className="flex flex-col gap-4 w-full">
                <label className="label-col">
                  Email
                  <input
                    type="text"
                    name="email"
                    className="input-element"
                    placeholder="Email address"
                    onChange={handleChange}
                    value={formData.email}
                    required
                  ></input>
                  {showEmailError && <p className="error-text">Invalid Email - formatting should be: user@example.com</p>}
                </label>

                <label className="label-col">
                  Phone
                  <input
                    type="text"
                    name="phone"
                    className="input-element"
                    placeholder="Phone number"
                    onChange={handleChange}
                    value={formData.phone}
                    required
                  ></input>
                  {showPhoneError && <p className="error-text">Invalid Phone Number, use only numbers</p>}
                </label>

              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-4 w-full">
                <label className="label-col">
                  Address One
                  <input
                    type="text"
                    name="street_1"
                    className="input-element"
                    placeholder="Primary address"
                    onChange={handleChange}
                    value={formData.street_1}
                    required
                  ></input>
                  {showAddressError && <p className="error-text">Please enter a valid address</p>}
                </label>

                <label className="label-col">
                  Address Two (Optional)
                  <input
                    type="text"
                    name="street_2"
                    className="input-element"
                    placeholder="Secondary address"
                    onChange={handleChange}
                    value={formData.street_2}
                  ></input>
                </label>

                <label className="label-col">
                  City
                  <input
                    type="text"
                    name="city"
                    className="input-element"
                    placeholder="Enter your city"
                    onChange={handleChange}
                    value={formData.city}
                    required
                  ></input>
                  {showCity && <p className="error-text">City Name Should Not Have Numbers</p>}
                </label>

                <label className="label-col">
                  State
                  <input
                    type="text"
                    name="state"
                    className="input-element"
                    placeholder="Enter your state"
                    onChange={handleChange}
                    value={formData.state}
                    required
                  ></input>
                  {stateError && (
                    <p className="error-text">Please use the 2 digit abbreviation for the state</p>
                  )}
                </label>

                <label className="label-col">
                  Zip Code
                  <input
                    type="text"
                    name="zipcode"
                    className="input-element"
                    placeholder="Enter your zip code"
                    onChange={handleChange}
                    value={formData.zipcode}
                    required
                  ></input>
                  {showZip && <p className="error-text">Invalid Zip Code</p>}
                </label>
              </div>
            )}

            {/* Step 4 (Qualifications only if provider) */}
            {currentStep === totalSteps && (
              <div className="flex flex-col gap-4 w-full">
                <label className="label-col">
                  Username
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter a username"
                    className="input-element"
                    onChange={handleChange}
                    value={formData.username}
                    required
                  ></input>
                  {showSpNameError && <p className="error-text">Please enter a username</p>}
                </label>

                <label className="label-col">
                  Password
                  <input
                    type="password"
                    placeholder="Enter a password"
                    name="password"
                    className="input-element"
                    onChange={handleChange}
                    value={formData.password}
                    required
                  ></input>
                  {showPasswordError && <p className="error-text">Please enter a password</p>}

                </label>
                {isSp && (
                  <div className="flex flex-col text-start">
                    Service Provider Type:
                    <label className="flex gap-3 border-white border text-md bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-2xl opacity-95 p-2 cursor-pointer">
                      Beauty
                      <input
                        type="radio"
                        name="sp_type"
                        value="beauty"
                        className="w-4 bg-white cursor-pointer"
                        onChange={handleChange}
                        checked={formData.sp_type === "beauty"}
                      ></input>
                    </label>
                    <label className="flex gap-2 border-white border text-md bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-2xl opacity-95 p-2 cursor-pointer">
                      Medical
                      <input
                        type="radio"
                        name="sp_type"
                        value="medical"
                        className="w-4 bg-white cursor-pointer"
                        onChange={handleChange}
                        checked={formData.sp_type === "medical"}
                      ></input>
                    </label>
                    <label className="flex gap-3 border-white border text-md bg-gradient-to-r from-emerald-500 to-emerald-800 rounded-2xl opacity-95 p-2 cursor-pointer">
                      Fitness
                      <input
                        type="radio"
                        name="sp_type"
                        value="fitness"
                        className="w-4 bg-white cursor-pointer"
                        onChange={handleChange}
                        checked={formData.sp_type === "fitness"}
                      ></input>
                    </label>
                  </div>
                )}
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
                        value={formData.qualifications}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setCharLimit(value.length);
                          setFormData((prev) => ({
                            ...prev,
                            [name]: value
                          }));
                        }}
                        required
                      />
                    </div>
                  </label>
                )}
                {serverError && (
                  <div className="error-text text-center">Server Error...</div>
                )}
                <button
                  type="submit"
                  className="
                    text-white text-2xl font-bold rounded-full p-4 mt-8 w-full
                    bg-gradient-to-r from-teal-500 to-emerald-600
                    shadow-lg hover:from-teal-600 hover:to-emerald-700
                    transition-all duration-150 transform hover:scale-105
                    cursor-pointer hover:cursor-pointer
                  "
                >
                  Submit
                </button>
              </div>
            )}

            {currentStep > totalSteps && (
              <img className="object-contain opacity-70" src="/luffy.gif" />
            )}

            {/* Static Bottom Nav */}
            <div className="mt-auto w-5/8 flex justify-between px-10 py-4 bg-emerald-900 border-t border-4 border-black fixed bottom-0 left-1/2 transform -translate-x-1/2 rounded-t-lg">
              <div></div>
              {currentStep > 1 ? (
                <button
                  type="button"
                  name="prev"
                  ref={prevButtonRef}
                  onClick={() => prevStep()}
                  className="w-100 bg-gray-500 px-4 py-2 text-2xl rounded-lg hover:bg-gray-400 transition cursor-pointer"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  ref={nextButtonRef}
                  onClick={() => nextStep()}
                  className="w-100 bg-sky-600 px-4 py-2 text-2xl rounded-lg hover:bg-sky-500 transition cursor-pointer"
                >
                  Next
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
