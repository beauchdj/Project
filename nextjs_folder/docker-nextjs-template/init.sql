CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS appts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE public.users (
      "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "fullname" character varying(100) NOT NULL,
    "hashpass" character varying(100) NOT NULL,
    "street1" character varying(50),
    "street2" character varying(20),
    "city" character varying(30),
    "state" character varying(5),
    "zip" character varying(5),
    "phone" character varying(10),
    "email" character varying(50),
    "username" character varying(50) NOT NULL,
    "servicecategory" character varying(30),
    "isadmin" boolean,
    "issp" boolean,
    "iscustomer" boolean,
    "qualifications" character varying(255),
    "providername" character varying(100),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id") 
);

CREATE TABLE public.appts_avail (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    spid uuid,
    starttime timestamp NOT NULL,
    endtime timestamp NOT NULL,
    service varchar(30),
    CONSTRAINT appts_pkey PRIMARY KEY (id),
    CONSTRAINT appts_avail_spid_fkey FOREIGN KEY (spid)
      REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);


CREATE TABLE public.appt_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    apptid uuid,
    userid uuid,
    bookstatus varchar(50),
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT appt_bookings_apptid_fkey FOREIGN KEY (apptid)
      REFERENCES appts_avail(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT appt_bookings_userid_fkey FOREIGN KEY (userid)
      REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

INSERT INTO "users" ("id", "fullname", "hashpass", "street1", "street2", "city", "state", "zip", "phone", "email", "username", "servicecategory", "isadmin", "issp", "iscustomer", "qualifications", "providername") VALUES
('82dabe93-46b5-4d2b-aafa-25343949d0fa',	'Gavin S',	'$2b$10$cwetqFvi49nWQ.eSVr3Aq.lqtOBvCs4f4G3p1yxFYqsLr86NsR9/C',	'986',	'986',	'mad',	'wi',	'986',	'986',	'986',	'user',	'medical',	'0',	'1',	'1',	'986',	'Super Sweets'),
('e6137093-9404-416c-a1e3-7a85964b9d55',	'Gavin Z',	'$2b$10$SI./dh.ZWWQsOxUcZgc6w.77.N2VPiClI7y7PZMrypbOsGv7AXFTK',	'123',	'1231',	'mad',	'wi',	'1234',	'123',	'123',	'user1',	NULL,	'0',	'0',	'1',	NULL,	NULL);
