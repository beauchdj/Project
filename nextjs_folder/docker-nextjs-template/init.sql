CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS btree_gist;

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
    "state" character varying(15),
    "zip" character varying(5),
    "phone" character varying(15),
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
      ON DELETE CASCADE,
    CONSTRAINT appts_avail_no_overlap
      EXCLUDE USING gist (spId WITH =, tsrange(starttime, endtime, '[)') WITH &&)
);


CREATE TABLE public.appt_bookings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    apptid uuid,
    userid uuid,
    bookstatus varchar(50),
    booked_at timestamp,
    cancelled_at timestamp,
    cancelled_by uuid,
    CONSTRAINT bookings_pkey PRIMARY KEY (id),
    CONSTRAINT appt_bookings_apptid_fkey FOREIGN KEY (apptid)
      REFERENCES appts_avail(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT appt_bookings_userid_fkey FOREIGN KEY (userid)
      REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    CONSTRAINT appt_bookings_cancelledby_fkey FOREIGN KEY (cancelled_by)
      REFERENCES users(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
);

CREATE UNIQUE INDEX appt_bookings_one_booked_per_id
  ON appt_bookings (apptid)
  WHERE (bookstatus = 'Booked');

INSERT INTO "users" ("id", "fullname", "hashpass", "street1", "street2", "city", "state", "zip", "phone", "email", "username", "servicecategory", "isadmin", "issp", "iscustomer", "qualifications", "providername") VALUES
('bb6ac427-5643-40ce-ab2b-e00c380d195b',	'Abby Anderson',	'$2b$10$oRDhJf4eCpoF9OxwhYssie5ZRg/7fTd4RfW1vhUDJQTC9bJqxxq8S',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'abby@gmail.com',	'abby',	'beauty',	'0',	'1',	'1',	'Graduated from The Salon Professional Academy, 2015',	'Abby Anderson Beauty'),
('96b74ff3-2457-4918-bfe8-f9e95659e209',	'Katie Johnson',	'$2b$10$yeUlrj1PUqy8WC9UQGN.PO.KZoiE6tYS3bMC6dzk56uen8zbCypQ2',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'katie@gmail.com',	'katie',	'beauty',	'0',	'1',	'1',	'Skin-care certified nurse training, 2021',	'Katie Johnson Beauty'),
('f88d8857-9386-4237-b484-6a38cf27819a',	'Jane Doe',	'$2b$10$e./KVBUE3WQzRcmQbBCgeOiunvn4jB5YAR3mvJBJuULSEB7qf6Ph6',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'jane@gmail.com',	'jane',	NULL,	'0',	'0', '1', NULL, NULL),
('6d18a65f-570a-4a74-8d48-43228518a53a',	'Sophia Coon',	'$2b$10$8R42WNqjd/zJtYKba/kYCeYRf8jw.TsARN3RxSpLwH3y3bHBOeWme',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'sophia@gmail.com',	'sophia',	NULL,	'0',	'0', '1', NULL, NULL);