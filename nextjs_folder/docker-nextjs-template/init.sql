/* Gavin Stankovsky, Jaclyn Brekke
* December 2025 (Latest)
* INIT file to initialize database and populate
*/

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS btree_gist;

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS appts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

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
    "isactive" boolean DEFAULT true,
    "created_at" timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT "users_pkey" PRIMARY KEY ("id") 
);

CREATE TABLE public.appts_avail (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    spid uuid,
    starttime timestamp NOT NULL,
    endtime timestamp NOT NULL,
    isactive BOOLEAN NOT NULL,
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


CREATE TABLE public.notifications (
    "apptid" uuid,
    "userid" uuid,
    "status" character varying(64),
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT "notifications_id" PRIMARY KEY ("id"),
    CONSTRAINT "notifications_userid_fkey" FOREIGN KEY ("userid")
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
    CONSTRAINT "notifications_apptid_fkey" FOREIGN KEY ("apptid")
    REFERENCES appts_avail(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);

CREATE TABLE public.notifs (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  sent_by uuid,
  send_to uuid,
  sent_at timestamp NOT NULL default NOW(),
  msg VARCHAR(1024),
  isActive boolean NOT NULL default true,
  isNew boolean NOT NULL default true,
  CONSTRAINT notifs_pkey PRIMARY KEY(id),
  CONSTRAINT notifs_sentby_fkey FOREIGN KEY (sent_by)
    REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT notifs_sendto_fkey FOREIGN KEY (send_to)
    REFERENCES users(id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE UNIQUE INDEX appt_bookings_one_booked_per_id
  ON appt_bookings (apptid)
  WHERE (bookstatus = 'Booked');

INSERT INTO "users" ("id", "fullname", "hashpass", "street1", "street2", "city", "state", "zip", "phone", "email", "username", "servicecategory", "isadmin", "issp", "iscustomer", "qualifications", "providername","isactive") VALUES
('bb6ac427-5643-40ce-ab2b-e00c380d195b',	'Abby Anderson',	'$2b$10$oRDhJf4eCpoF9OxwhYssie5ZRg/7fTd4RfW1vhUDJQTC9bJqxxq8S',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'abby@gmail.com',	'abby',	'beauty',	'0',	'1',	'1',	'Graduated from The Salon Professional Academy, 2015',	'Abby Anderson Beauty','1'),
('96b74ff3-2457-4918-bfe8-f9e95659e209',	'Katie Johnson',	'$2b$10$yeUlrj1PUqy8WC9UQGN.PO.KZoiE6tYS3bMC6dzk56uen8zbCypQ2',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'katie@gmail.com',	'katie',	'beauty',	'0',	'1',	'1',	'Skin-care certified nurse training, 2021',	'Katie Johnson Beauty','1'),
('f88d8857-9386-4237-b484-6a38cf27819a',	'Jane Doe',	'$2b$10$e./KVBUE3WQzRcmQbBCgeOiunvn4jB5YAR3mvJBJuULSEB7qf6Ph6',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'jane@gmail.com',	'jane',	NULL,	'0',	'0', '1', NULL, NULL,'1'),
('e6137093-9404-416c-a1e3-7a85964b9d55',	'Gavin Z',	'$2b$10$SI./dh.ZWWQsOxUcZgc6w.77.N2VPiClI7y7PZMrypbOsGv7AXFTK',	'123',	'1231',	'mad',	'wi',	'1234',	'123',	'123',	'user1',	NULL,	'0',	'0',	'1',	NULL,	NULL,'1'),
('82dabe93-46b5-4d2b-aafa-25343949d0fa',	'Gavin S',	'$2b$10$cwetqFvi49nWQ.eSVr3Aq.lqtOBvCs4f4G3p1yxFYqsLr86NsR9/C',	'986',	'986',	'mad',	'wi',	'986',	'986',	'986',	'user',	'medical',	'1',	'1',	'1',	'986',	'Super Sweets','1'),
('6d18a65f-570a-4a74-8d48-43228518a53a',	'Sophia Coon',	'$2b$10$8R42WNqjd/zJtYKba/kYCeYRf8jw.TsARN3RxSpLwH3y3bHBOeWme',	'123 st',	'986',	'mad',	'wi',	'54664',	'123-123-1234',	'sophia@gmail.com',	'sophia',	NULL,	'0',	'0', '1', NULL, NULL,'1'),
('f780da56-3d73-4ec4-9114-9a9374abc3a2',	'admin',	'$2b$10$Wu.53SPnkg8Zxz4TgEzNYOB0A8GRtHe6uZEBmkvM.m9aG9f6rjlA.',	'str',	'',	'city',	'wi',	'12345',	'1234567890',	'admin@gmail.com',	'admin',	'beauty',	'1',	'1',	'1',	'quals',	'Admin','1'),
('09a02678-d8a8-4520-a8fd-d1ed8a79a02b',  'Tom Klint', '$2b$10$7PMQqdoK0rP1T5fG5wXHMOz6WICe7hpWFEVSpjCK9JsFMcklgUk4a', '123','','Madison','WI','53703','1234567890','tom@gmail.com','tom','fitness','0','1','1','yoga certification','Tom Klint Fitness', '1');

INSERT INTO "appts_avail" ("id", "spid", "starttime", "endtime", "isactive", "service") VALUES
('c6497be7-0dcc-4c9f-a5cb-f7317b487a47',  'bb6ac427-5643-40ce-ab2b-e00c380d195b', '2025-12-16 15:30:00',  '2025-12-16 16:30:00',  '1',  'Perm'),
('99fc2ba2-028f-46e5-bbfd-c2506369417d',  'bb6ac427-5643-40ce-ab2b-e00c380d195b', '2025-12-16 16:30:00',  '2025-12-16 17:30:00',  '1',  'Relaxer'),
('7852f713-b1c7-4249-9333-8f9893dbd7fa',  '09a02678-d8a8-4520-a8fd-d1ed8a79a02b', '2025-12-16 15:30:00',  '2025-12-16 16:30:00',  '1',  'Yoga'),
('8942c9da-b8e6-4580-bf62-0caa9640ab69',  '09a02678-d8a8-4520-a8fd-d1ed8a79a02b', '2025-12-16 16:30:00',  '2025-12-16 17:30:00',  '1',  'Pound');
