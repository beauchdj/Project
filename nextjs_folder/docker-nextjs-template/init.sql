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

CREATE TABLE public.notifications (
    "bookingid" uuid,
    "status" character varying(64),
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT "notifications_id" PRIMARY KEY ("id"),
    CONSTRAINT "notifications_bookingid_fkey" FOREIGN KEY ("bookingid")
    REFERENCES appt_bookings(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);


INSERT INTO "users" ("id", "fullname", "hashpass", "street1", "street2", "city", "state", "zip", "phone", "email", "username", "servicecategory", "isadmin", "issp", "iscustomer", "qualifications", "providername") VALUES
('82dabe93-46b5-4d2b-aafa-25343949d0fa',	'Gavin S',	'$2b$10$cwetqFvi49nWQ.eSVr3Aq.lqtOBvCs4f4G3p1yxFYqsLr86NsR9/C',	'986',	'986',	'mad',	'wi',	'986',	'986',	'986',	'user',	'medical',	'0',	'1',	'1',	'986',	'Super Sweets'),
('4be9fd0f-314d-47c6-b12d-164ae62fe3bd',	'Katie Johnoson',	'$2b$10$D9QKKA24f9hlL2Pr24IWwuukazKf6mCZaDeBNxysebe/kziEoHerK',	'123 addr lane',	NULL,	'madison',	'wi',	'54603',	'608-485-9458',	'katie@gmail.com',	'katie123',	'beauty',	'0',	'1',	'0',	'Katie Johnson, Qualifications: Skin-care certified nurse training, 2021.',	'Katie''s Beauty Salon'),
('d8af3134-0779-4a59-9bfa-cca79ca9552c',	'Abby Anderson',	'$2b$10$IY.6mQ3Bs7E3fKf4SJ0XDuByaZZpeKDS41xEeAGEmK62K5Pv42nIm',	'123 addr ln',	NULL,	'madison',	'wi',	'50453',	'608-945-3432',	'abby@gmail.com',	'abby123',	'beauty',	'0',	'1',	'0',	'Abby Andersen, Qualifications: Graduated from The Salon Professional Academy, 2015.',	'Abby''s Extreme Salon'),
('2833e51c-49cf-425f-a487-8ab36a73c3fa',	'Jane Doe',	'$2b$10$zjiWVsMH2xKlLjqHfE5B0OGDocMdst1RxfSZ7N8pDbudW5WXGjtua',	'123 addr ln',	NULL,	'madison',	'wi',	'50493',	'608-943-9495',	'jane@gmail.com',	'jane123',	NULL,	'0',	'0',	'1',	NULL,	NULL),
('e6137093-9404-416c-a1e3-7a85964b9d55',	'Gavin Z',	'$2b$10$SI./dh.ZWWQsOxUcZgc6w.77.N2VPiClI7y7PZMrypbOsGv7AXFTK',	'123',	'1231',	'mad',	'wi',	'1234',	'123',	'123',	'user1',	NULL,	'0',	'0',	'1',	NULL,	NULL);


INSERT INTO "appts_avail" ("id", "spid", "starttime", "endtime", "service") VALUES
('6226098d-05bb-42ed-a9f0-30e7801a6a6e',	'82dabe93-46b5-4d2b-aafa-25343949d0fa',	'2025-11-22 15:09:00',	'2025-11-22 15:56:00',	'Physical Therapy');
