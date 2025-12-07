/* Gavin Stankovsky
*  October 2025
*  Database type 
*/

export type Appointment = {
  sp_id: string;
  cust_id: string;
  id?: string;
  starttime: string;
  endtime: string;
  service: string;
  sp_servicecat?: string;
  sp_providername?: string;
  sp_fullname?: string | null;
  cust_fullname?: string;
  bookingid?: string | null;
  fullname: string;
};