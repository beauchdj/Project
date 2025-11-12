export type Appointment = {
  id?: string;
  starttime: string;
  endtime: string;
  service: string;
  sp_servicecat?: string;
  sp_providername?: string;
  sp_fullname?: string | null;
  cust_fullname?: string;
  bookingid?: string | null;
};
// service	starttime	endtime	sp_servicecat	sp_providername	sp_fullname	cust_fullname
