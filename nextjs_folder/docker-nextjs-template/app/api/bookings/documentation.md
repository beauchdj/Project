Bookings API

All bookings endpoints require authentication. If the user is not authenticated, the API will return HTTP 401 Unauthorized.

Authorization rules are enforced by the backend. Clients cannot bypass role-based restrictions using query parameters.

*GET /api/bookings*

Returns a list of bookings visible to the authenticated user.

Admins can see all bookings.
Service providers can see bookings for appointment slots they own.
Customers can see bookings they have made.

Supported query parameters (all optional):
 - customerId: filter by customer id
 - serviceProviderId: filter by service provider id
 - status: "Booked" or "Cancelled"
 - startAfter: ISO datetime string; include bookings starting at or after this time
 - startBefore: ISO datetime string; include bookings starting at or before this time
 - serviceId: filter by service
 - serviceCategory: "Beauty", "Medical", or "Fitness"

Authorization rules still apply even if these parameters are provided.

Example:
GET /api/bookings?status=Booked&serviceCategory=Medical

Successful response (200):

The response body contains an object with a bookings array. Each booking has the shape of the BookingView

*POST /api/bookings*

Creates a new booking for an appointment slot.

Only authenticated users may call this endpoint. The backend will reject the request if the appointment does not exist, is already booked, or conflicts with another booking by the same customer.

Request body:
apptId: appointment slot id (required)

Example:

POST /api/bookings
Content-Type: application/json
{"apptId": "uuid"}

Successful response (201):

{"bookingId": "new-booking-id"}

Errors:
400 Missing apptId
401 Unauthorized
404 Appointment does not exist
409 Appointment already booked
409 Booking conflicts with an existing booking
500 Server error

*PATCH /api/bookings/:id*

Cancels an existing booking by updating its status to "Cancelled".

A booking can be cancelled by:
- the customer who made the booking
 - the service provider who owns the appointment slot
 - an admin

Request body:
{"status": "Cancelled"}

Only the value "Cancelled" is supported. Other values will result in an error.

Example:

PATCH /api/bookings/booking-id
Content-Type: application/json
{"status": "Cancelled"}

Successful response (200):
{"success": true}

Errors:
400 Invalid booking status
401 Unauthorized
403 User not allowed to cancel this booking
500 Server error

General notes:

Bookings are not deleted from the database. Cancelling a booking preserves history.

Filtering is applied after role-based authorization. Providing a customerId or serviceProviderId does not allow a user to access records they are not allowed to see.

The data returned from GET /api/bookings matches the BookingView type exactly.