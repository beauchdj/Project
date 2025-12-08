import { pool } from "@/lib/db";

export async function countSpAndCust(): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    const custRet = await pool.query(
      "SELECT count(*) FROM users WHERE iscustomer = '1';"
    );
    const spRet = await pool.query(
      "SELECT count(*) FROM users WHERE issp = '1';"
    );

    return [Number(spRet.rows[0].count), Number(custRet.rows[0].count)];
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}
