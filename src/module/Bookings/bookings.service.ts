import { pool } from "../../config/db";

const createBookings = async (payload: Record<string, unknown>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicleResult = await pool.query(
    `
        
        SELECT daily_rent_price, availability_status FROM vehicles WHERE id=$1
        
        `,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not Found");
  }

  const vehicle = vehicleResult.rows[0];

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is already booked");
  }

  // TotalPrice Calculation :

  const startDate = new Date(rent_start_date as string);
  const endDate = new Date(rent_end_date as string);
  const timeDiff = endDate.getTime() - startDate.getTime();
  const days = Math.ceil(timeDiff / (3600 * 1000 * 24));

  if (days <= 0) {
    throw new Error("End Date Must be greater than Start Date");
  }

  const total_price = days * vehicleResult.rows[0].daily_rent_price;

  //Create Booking ::
  const result = await pool.query(
    `
        
            INSERT INTO bookings(customer_id,vehicle_id,rent_start_date,rent_end_date,total_price,status) 
            VALUES($1,$2,$3,$4,$5,'active')
            
            
            RETURNING *


        
        `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price,]
  );

  // Updating Status :

  const updateVehicleStatus = await pool.query(
    `
    
    UPDATE vehicles SET availability_status='booked'  WHERE id=$1
    
    `,
    [vehicle_id]
  );

  


  return result;
};

const getBookingDetails = async () => {

  

  

  const result = await pool.query(`
        
        SELECT * FROM bookings
        
        `);

  return result;
};

const getSingleBookingDetails= async(id:string)=>{


  const result = await pool.query(`
    
    SELECT * FROM bookings WHERE id=$1
    
    `,[id])

    return result;
}

const updateBookings = async (id: string,payload: Record<string, unknown>) => {
  const { status } = payload;

  const bookingCheck = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [id]);
  
  if (bookingCheck.rows.length === 0) {
    throw new Error("Booking not found");
  }


  const vehicle_id = bookingCheck.rows[0].vehicle_id;

  const result = await pool.query(
    `UPDATE bookings 
     SET status=$1 
     WHERE id=$2 
     RETURNING *`,
    [status, id]
  );

  const updatedBooking = result.rows[0];

  let targetVehicleStatus = '';

  if (status === "active") {
      targetVehicleStatus = 'booked';
  } else if (status === "cancelled" || status === "returned") {
      targetVehicleStatus = 'available';
  }

  if (targetVehicleStatus) {
      await pool.query(
          `UPDATE vehicles 
           SET availability_status = $1 
           WHERE id = $2`, 
          [targetVehicleStatus, vehicle_id]
      );
  }
return updatedBooking;
};

export const bookingServices = {
  createBookings,
  getBookingDetails,
  getSingleBookingDetails,
  updateBookings,

};
