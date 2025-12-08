/* Jaclyn Brekke
*  December 2025
*  Database type 
*/

import { ServiceCategory } from "./ServiceCategory";

export type BookingFilters = {
  customerId?: string;
  serviceProviderId?: string;
  status?: "Booked" | "Cancelled";
  startAfter?: string;
  startBefore?: string;
  serviceId?: string;
  serviceCategory?: ServiceCategory;
  customerName?: string;
  providerName?: string;
  viewAs?: "Admin" | "Customer" | "Provider";
};