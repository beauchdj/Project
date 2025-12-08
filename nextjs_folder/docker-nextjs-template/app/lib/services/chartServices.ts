import { pool } from "@/lib/db";

export async function countSpAndCust(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    if (end) {
      // we have an end date as well
      const custRet = await pool.query(
        "SELECT count(*) FROM users WHERE iscustomer = '1' AND users.created_at BETWEEN to_timestamp($1) AND to_timestamp($2);",
        [start, end]
      );
      const spRet = await pool.query(
        "SELECT count(*) FROM users WHERE issp = '1' AND users.created_at BETWEEN to_timestamp($1) AND to_timestamp($2);",
        [start, end]
      );

      return [Number(spRet.rows[0].count), Number(custRet.rows[0].count)];
    } else {
      // no end date so we can take anything after start
      const custRet = await pool.query(
        "SELECT count(*) FROM users WHERE iscustomer = '1' AND to_timestamp($1) < users.created_at;",
        [start]
      );
      const spRet = await pool.query(
        "SELECT count(*) FROM users WHERE issp = '1' AND to_timestamp($1) < users.created_at;",
        [start]
      );

      return [Number(spRet.rows[0].count), Number(custRet.rows[0].count)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}

export async function countApptsCreated(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    if (end) {
      // we have an end date as well
      const apptRet = await pool.query(
        "SELECT count(*) FROM appts_avail WHERE appts_avail.starttime BETWEEN to_timestamp($1) AND to_timestamp($2);",
        [start, end]
      );

      return [Number(apptRet.rows[0].count)];
    } else {
      // no end date so we can take anything after start
      const apptRet = await pool.query(
        "SELECT count(*) FROM appts_avail WHERE appts_avail.starttime > to_timestamp($1);",
        [start]
      );

      return [Number(apptRet.rows[0].count)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}

export async function countApptsBooked(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    if (end) {
      // we have an end date as well
      const apptRet = await pool.query(
        "SELECT count(*) FROM appt_bookings WHERE bookstatus = 'Booked' AND booked_at BETWEEN to_timestamp($1) AND to_timestamp($2);",
        [start, end]
      );

      return [Number(apptRet.rows[0].count)];
    } else {
      // no end date so we can take anything after start
      const apptRet = await pool.query(
        "SELECT count(*) FROM appt_bookings WHERE bookstatus = 'Booked' AND booked_at > to_timestamp($1);",
        [start]
      );

      return [Number(apptRet.rows[0].count)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}

export async function countCancelledBookings(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    if (end) {
      // we have an end date as well
      const apptRet = await pool.query(
        "SELECT count(*) FROM appt_bookings WHERE bookstatus = 'Booked' AND booked_at BETWEEN to_timestamp($1) AND to_timestamp($2);",
        [start, end]
      );

      return [Number(apptRet.rows[0].count)];
    } else {
      // no end date so we can take anything after start
      const apptRet = await pool.query(
        "SELECT count(*) FROM appt_bookings WHERE bookstatus = 'Booked' AND booked_at > to_timestamp($1);",
        [start]
      );

      return [Number(apptRet.rows[0].count)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}

export async function countSpCategories(
  start: number,
  end: number
): Promise<number[] | null> {
  // return an array of ChartData's
  try {
    if (end) {
      // we have an end date as well
      const apptRet = await pool.query(
        "SELECT servicecategory, count(*) FROM users WHERE servicecategory IN ('fitness', 'beauty', 'medical') AND created_at BETWEEN to_timestamp($1) AND to_timestamp($2) GROUP BY servicecategory;",
        [start, end]
      );
      let beauty, fitness, medical;
      for (const itm of apptRet.rows) {
        if (itm.servicecategory === "beauty") beauty = itm.count;
        if (itm.servicecategory === "medical") medical = itm.count;
        if (itm.servicecategory === "fitness") fitness = itm.count;
      }
      return [Number(beauty), Number(fitness), Number(medical)];
    } else {
      // no end date so we can take anything after start
      const apptRet = await pool.query(
        "SELECT servicecategory, count(*) FROM users WHERE servicecategory IN ('fitness', 'beauty', 'medical') AND created_at > to_timestamp($1) GROUP BY servicecategory;",
        [start]
      );
      let beauty, fitness, medical;
      for (const itm of apptRet.rows) {
        if (itm.servicecategory === "beauty") beauty = itm.count;
        if (itm.servicecategory === "medical") medical = itm.count;
        if (itm.servicecategory === "fitness") fitness = itm.count;
      }
      return [Number(beauty), Number(fitness), Number(medical)];
    }
  } catch (error) {
    console.log("Error in countSpAndCust(): ", error);
    return null;
  }
}
/**
 * Some data ideas:
 *  X total sp and service providers between a date
 *  X total appointments created between a date
 *  X total appointments booked between a date
 *  X total bookings canceled between a date
 *  X count of service providers in each category
 *  when users were created? need to adjust account data a bit.
 */
