Appointments API

All appointment endpoints require authentication. Unauthenticated requests return HTTP 401 Unauthorized.

Authorization and visibility rules are enforced by the backend. Query parameters do not allow a client to access records they are not permitted to see.

*GET /api/appointments*
    Returns appointment slots visible to the authenticated user.

Admins:
- can see all appointment slots
- includes past and future
- includes booked, available, and inactive slots

Service providers:
- by default, see their own appointment slots
- may browse available appointments from other providers by requesting status=Available

Customers:
-see only available appointment slots (slots are active, are not booked, and are in the future)

Query parameters (all optional):
- serviceProviderId: filter by service provider id.
- status: 
    - Available (active slot with no current booked booking)
    - Booked (active slot with a current booked booking)
    - Inactive (soft-deleted or unavailable slot)
- startAfter: return appointments starting at or after this time.
- startBefore: return appointments starting at or before this time.
- service: filter by service name.
- serviceCategory: Beauty, Medical, Fitness.

Authorization rules are applied first. Filters are applied only to records already visible to the user.

Examples:

Get all available appointments (customer or service provider browsing):
GET /api/appointments?status=Available

Service provider views their own upcoming appointments:
GET /api/appointments?startAfter=2025-01-01T00:00:00Z

Admin views all inactive appointments:
GET /api/appointments?status=Inactive

Successful response (200):

Response body is an object with an appointments array. Each item matches the Appointment type.

Errors:
- 401 Unauthorized
- 500 Server error

*POST /api/appointments*

Creates a new appointment slot.
Intended for service providers 
Prevents overlapping appointments

Request body: all fiels are required
- date: date string in YYYY-MM-DD format.
- starttime: time string (HH:MM).
- endtime: time string (HH:MM).
- service: service name.

Successful response (201):
Returns the newly created appointment slot id.
{"appointmentId": "new-appointment-id"}

Errors:
- 400 Missing required fields
- 401 Unauthorized
- 409 Appointment conflict (overlapping appointment)
- 500 Server error

*DELETE /api/appointments/:id*

Deletes or deactivates an appointment slot.

Rules:
- If the appointment slot has never been booked, it is permanently deleted.
- If the appointment slot has been previously booked, it is soft-deleted (marked inactive).
- Only the owning service provider or an admin may delete an appointment slot.

Successful response (200):
Indicates whether the delete was hard or soft.

Example:
{"deleted": true, "hardDelete": false}

Errors:
- 401 Unauthorized
- 403 User not allowed to delete this appointment
- 500 Server error

*PATCH /api/appointments/:id*

Updates an appointment slot.

Currently used only for soft delets (marking an appointment inactive).

Request body: {"isActive": false} 

Successful response (200):
{"success": true}

Errors:
- 400 Invalid request body
- 401 Unauthorized
- 403 User not allowed to update this appointment
- 500 Server error

General notes:

Appointment slots and bookings are separate resources.

Appointments are not cancelled; bookings are cancelled. If a booking is cancelled, the appointment slot may become available again.

Soft-deleted appointment slots remain in the database and may appear in admin views.

Appointment data returned by GET /api/appointments matches the Appointment view type.