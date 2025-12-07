import { Pool } from "pg";

import config from ".";

export const pool = new Pool({
  connectionString: `${config.connection_str}`,
});

const initDB = async () => {
  try {
    await pool.query(`
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
              CREATE TYPE user_role AS ENUM ('admin', 'customer');
          END IF;
      END$$;
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL ,
        password TEXT NOT NULL,
        phone VARCHAR(15) NOT NULL,
        role user_role DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT NOW(),
        CONSTRAINT ensure_lowercase_email CHECK (email = lower(email))
        
    )
    `);

    await pool.query(`
    
    DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
              CREATE TYPE vehicle_type AS ENUM ('car', 'bike', 'van','SUV');
          END IF;
      END$$;
    DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'availability_status_type') THEN
              CREATE TYPE availability_status_type AS ENUM ('available', 'booked');
          END IF;
      END$$;
    

    CREATE TABLE IF NOT EXISTS vehicles(
    id SERIAL PRIMARY KEY,

      vehicle_name VARCHAR(200),
      type vehicle_type NOT NULL,
      registration_number VARCHAR(100) UNIQUE NOT NULL,
      daily_rent_price INT CHECK(daily_rent_price>0),
      created_at TIMESTAMP DEFAULT NOW(),
      availability_status availability_status_type NOT NULL
      
    )
    `);

    await pool.query(`
      
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
              CREATE TYPE status_type AS ENUM ('active', 'cancelled','returned');
          END IF;
      END$$;

      CREATE TABLE IF NOT EXISTS bookings(
      id SERIAL PRIMARY KEY,
      customer_id INT REFERENCES users(id) ON DELETE RESTRICT, 
      vehicle_id INT REFERENCES vehicles(id) ON DELETE RESTRICT,
      rent_start_date DATE NOT NULL,
      rent_end_date  DATE NOT NULL,
      total_price INT NOT NULL CHECK(total_price>0),
      status status_type NOT NULL ,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      CONSTRAINT check_valid_dates CHECK(rent_end_date>rent_start_date)
      )
      
      `);

    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  }
};

export default initDB;
