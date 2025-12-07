/* Gavin Stankovsky, Jaclyn Brekke
*  December 2025 (latest)
*  Database type 
*/

export type users_db = {
  id?: string;
  isadmin?: boolean;
  issp?: boolean;
  iscustomer?: boolean;
  qualifications?: string;
  providername?: string;
  sp_type?: string;
  fullname: string;
  username: string;
  hashpass: string;
  street_1: string;
  street_2?: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  isactive?: boolean;
  created_at?: string;
};
