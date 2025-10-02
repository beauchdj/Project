import { auth } from "../../auth"
 
export default async function BookedAppointments() {
  const session = await auth()
 
  if (!session?.user) return null
 
  return (
    <div>
      <h1>This is the Bookings Page for {session.user.fullname}, a {session.user.usertype}</h1>
    </div>
  )
}