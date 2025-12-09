/* Jaclyn Brekke
 *  December 2025
 *  Database service
 */

import { pool } from "@/lib/db";
import { User } from "@/app/lib/types/User";
import { users_db } from "@/app/lib/types/user_db";
import bcrypt from "bcryptjs";
<<<<<<< HEAD
import {
  cancelAllBookingsforCust,
  cancelAllBookingsforSP,
} from "./BookingService";
=======
import { cancelAllBookingsforCust,cancelAllBookingsforSP } from "./BookingService";
import { deleteAllSpApptSlots } from "./appointmentServices";
>>>>>>> origin/code_clean_up_jackie

export async function getAllUsers(): Promise<User[]> {
  const { rows } = await pool.query(
    `SELECT id, fullname, street1,street2,city,state,zip,phone,email,username,
            servicecategory,isadmin,issp,iscustomer,qualifications,providername,isactive,created_at
        FROM users
        ORDER BY username`
  );
  return rows;
}

export async function getUserById(id: string): Promise<User | null> {
  const { rows } = await pool.query(
    `SELECT id, fullname, street1,street2,city,state,zip,phone,email,username,
            servicecategory,isadmin,issp,iscustomer,qualifications,providername,isactive
        FROM users
        WHERE id = $1`,
    [id]
  );

  return rows[0] || null;
}

export async function createUser(user: users_db) {
  const hashed = await bcrypt.hash(user.hashpass, 10);
  const { rows } = await pool.query(
    "INSERT INTO users (providername, fullname, username, hashpass, isAdmin, isSp, isCustomer,street1,street2,city,state,zip,phone,email,servicecategory,qualifications) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)",
    [
      user.providername,
      user.fullname,
      user.username,
      hashed,
      user.isadmin,
      user.issp,
      user.iscustomer,
      user.street_1,
      user.street_2 || null,
      user.city,
      user.state,
      user.zip,
      user.phone,
      user.email,
      user.sp_type,
      user.qualifications,
    ]
  );
  return rows[0];
}

export async function updateUser(
  actingUserId: string,
  user: users_db & { newpass?: string }
) {
  // initial state to track if these change, call cancel functions
  const userOld = await getUserById(user.id!);

  //query builder
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  const add = (col: string, val: any) => {
    fields.push(`${col} = $${i}`);
    values.push(val);
    i++;
  };

  if (user.isactive !== undefined) add("isactive", user.isactive);
  if (user.issp !== undefined) add("issp", user.issp);
  if (user.iscustomer !== undefined) add("iscustomer", user.iscustomer);
  if (user.sp_type !== undefined) add("servicecategory", user.sp_type);
  if (user.fullname !== undefined) add("fullname", user.fullname);
  if (user.city !== undefined) add("city", user.city);
  if (user.state !== undefined) add("state", user.state);
  if (user.zip !== undefined) add("zip", user.zip);
  if (user.street_1 !== undefined) add("street1", user.street_1);
  if (user.street_2 !== undefined) add("street2", user.street_2);
  if (user.phone !== undefined) add("phone", user.phone);
  if (user.email !== undefined) add("email", user.email);
  if (user.qualifications !== undefined)
    add("qualifications", user.qualifications);
  if (user.providername !== undefined) add("providername", user.providername);

  if (user.newpass && user.newpass.length > 0) {
    const hashed = await bcrypt.hash(user.newpass, 10);
    add("hashpass", hashed);
  }

  if (fields.length === 0) {
    throw new Error("NO_FIELDS_TO_UPDATE");
  }

  values.push(user.id);

  const result = await pool.query(
    `UPDATE users
        SET ${fields.join(", ")}
        WHERE id = $${i}
        RETURNING id, fullname,username,providername,isadmin,issp,iscustomer,isactive`,
    values
  );

  if (result.rowCount === 0) {
    throw new Error("USER_NOT_FOUND");
  }

<<<<<<< HEAD
  //check if deactivating user, then cancel bookings
  if (userOld && userOld.issp && !user.issp) {
    await cancelAllBookingsforSP(user.id!, actingUserId);
  }

  if (userOld && userOld.isactive && !user.isactive) {
    await cancelAllBookingsforCust(user.id!, actingUserId);
  }
=======
        //check if deactivating user, then cancel bookings

        // if service provider being deactivated or changed to non-sp, cancel bookings and delete appt slots
        if (userOld && userOld.issp && !user.issp) {
            await cancelAllBookingsforSP(user.id!,actingUserId);
            await deleteAllSpApptSlots(user.id!,actingUserId);
        }

        // if customer being deactivated, cancel bookings
        if (userOld && userOld.isactive && !user.isactive) {
            await cancelAllBookingsforCust(user.id!,actingUserId);
        }
>>>>>>> origin/code_clean_up_jackie

  return result.rows[0];
}
