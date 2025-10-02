export const runtime = "nodejs";
// lib/db.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
});

export { pool }; // Export the pool to ensure one connection is used to the database
