/* Gavin Stankovsky
*  November 2025
*  Database type 
*/

export type Notification = {
  noteid: string;
  apptid: string;
  status?: string;
  spid: string;
  starttime: string;
  endtime: string;
  providername: string;
  servicecategory: string;
  service: string;
  bookstatus?: string;
};
