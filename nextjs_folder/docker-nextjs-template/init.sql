CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS appts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    fullname varchar(100) NOT NULL,
    hashpass varchar(100) NOT NULL,
    street1 varchar(50),
    street2 varchar(20),
    city varchar(30),
    state varchar(5),
    zip varchar(5),
    phone varchar(10),
    email varchar(50),
    username varchar(50),
    servicecategory varchar(30),
    usertype varchar(30),
    CONSTRAINT users_pkey PRIMARY KEY (id)
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

INSERT INTO "users" ("id", "fullname", "hashpass", "street1", "street2", "city", "state", "zip", "phone", "email", "username", "servicecategory", "usertype") VALUES
('381be27c-2d76-44db-a1e8-28dedf24647d',	'Example',	'nothashed',	'1021 amber city',	NULL,	'la crosse',	'wi',	'54603',	'6082029914',	'test@gmail.com',	'example',	NULL,	'basic'),
('85d0144b-72aa-46a6-913e-cca1d5f5c7ac',	'sp_example',	'eeper',	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	NULL,	'sp_example',	'Medical',	'ServiceProvider');

INSERT INTO "appts_avail" ("id", "spid", "starttime", "endtime", "service") VALUES
('ea5a9223-cb91-4e73-9ca0-b970d9d4fbfc',	'85d0144b-72aa-46a6-913e-cca1d5f5c7ac',	'2025-09-30 16:09:56.612223',	'2025-09-30 16:14:56.612223',	NULL);

INSERT INTO "appt_bookings" ("id", "apptid", "userid", "bookstatus") VALUES
('30db9768-2ff0-4935-bf9b-c75206e2a533',	'ea5a9223-cb91-4e73-9ca0-b970d9d4fbfc',	'381be27c-2d76-44db-a1e8-28dedf24647d',	'booked');
