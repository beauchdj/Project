export type users_db = {
  usertype: string;
  sp_type: string;
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
};
