"use server";
import { RegisterForm } from "./lib/register_form";

export default async function Page() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
