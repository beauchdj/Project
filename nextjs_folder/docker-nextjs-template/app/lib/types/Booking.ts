/* Gavin Stankovsky
*  November 2025
*  Database type 
*/

export type Booking = {
  starttime: string;
  endtime: string;
  service: string;
  providername: string;
  servicecategory: string;
  fullname?: string;
  id: string;
  bookstatus: string;
  apptid: string;
  userid: string;
  isactive: boolean;
};
