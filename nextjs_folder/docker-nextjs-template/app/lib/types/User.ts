export type User = {
  id: string;
  fullname: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  username: string;
  servicecategory?: string;
  isadmin?: boolean;
  issp?: boolean;
  iscustomer?: boolean;
  qualifications?: string
  providername?: string;
  isactive?: boolean;
  created_at?: string;
};