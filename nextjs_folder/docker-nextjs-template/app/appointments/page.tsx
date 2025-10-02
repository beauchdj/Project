import { auth } from "../../auth"
 
export default async function CreateAppointments() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <h1>This is the Appointment Creation Page for {session.user.fullname}, a {session.user.usertype}</h1>

    <form onSubmit={} className="">
      <label htmlFor="username" className="">
        Start Time
      </label>
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="input-element"
      />
      <label htmlFor="password" className="">
        Password
      </label>
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="input-element"
      />
      <button className="btn shadow shadow-black mt-2" type="submit">
        Login
      </button>
    </form>
</div>
  )
}