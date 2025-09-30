DROP TABLE IF EXISTS "users";
CREATE TABLE "public"."users" (
    "username" character varying(64) NOT NULL,
    "password" character varying(64) NOT NULL,
    "id" character varying(128) NOT NULL
)
WITH (oids = false);

INSERT INTO "users" ("username", "password", "id") VALUES
('catdog',	'test123',	'cab56f28-f661-494a-8471-dc57f03637a6');

-- 2025-09-10 17:38:52 UTC

