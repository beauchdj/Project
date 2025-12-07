/* Jaclyn Brekke
*  November 2025
*  Database type 
*/

import { ServiceCategory } from "./ServiceCategory";

export type AppointmentFilters = {
    serviceProviderId?: string;
    status?: "Available" | "Booked" | "Inactive";
    startAfter?: string;
    startBefore?: string;
    service?: string;
    serviceCategory?: ServiceCategory;
}  ; 