/* Daniel Beauchaine
*  October 2025
*  Page for registration
*/

"use server";
import { RegisterForm } from "./lib/RegisterForm";

export default async function Page() {
  return (
    <div>
      <RegisterForm />
    </div>
  );
}
