import { pool } from "@/lib/db";

export async function countSpAndCust(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    console.log("start: ", start, end);
    if (end) {
      // we have an end date as well
      const custRet = await pool.query(
        "SELECT count(*) FROM users WHERE iscustomer = '1';"
      );
      const spRet = await pool.query(
        "SELECT count(*) FROM users WHERE issp = '1';"
      );

      return [Number(spRet.rows[0].count), Number(custRet.rows[0].count)];
    } else {
      // no end date so we can take anything after start
      const custRet = await pool.query(
        "SELECT count(*) FROM users WHERE iscustomer = '1' AND (SELECT to_timestamp($1)) < users.created_at;",
        [start]
      );
      const spRet = await pool.query(
        "SELECT count(*) FROM users WHERE issp = '1' AND (SELECT to_timestamp($1)) < users.created_at;",
        [start]
      );

      return [Number(spRet.rows[0].count), Number(custRet.rows[0].count)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}

/**
 * Some data ideas:
 *  total sp and service providers between a date
 *  total appointments created between a date
 *  total appointments booked between a date
 *  total bookings canceled between a date
 *  count of service providers in each category
 *  when users were created? need to adjust account data a bit.
 */
