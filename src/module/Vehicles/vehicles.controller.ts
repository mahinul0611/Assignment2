import { Request, Response } from "express";
import { vechiclesServices } from "./vehicles.service";

const createVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vechiclesServices.createVehicle(req.body);

    res.status(201).json({
      status: true,
      message: "Vehicle created successfully",
      data: result.rows,
    });

    return result;
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getVehicles = async (req: Request, res: Response) => {
  // const {name,email,password,phone,role} = req.body;

  try {
    const result = await vechiclesServices.getVehicles();
    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: result.rows,
    });
    // console.log(result)
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleVehicles = async (req: Request, res: Response) => {

  try {
    const result = await vechiclesServices.getSingleVehicles(
      req.params.id as string
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle retrieved successfully",
        data: result.rows[0],
      });
    }
    // console.log(result.rows);
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateVehicles = async (req: Request, res: Response) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = req.body;

  try {
    const result = await vechiclesServices.updateVehicles(
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      req.params.id!
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicles not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const result = await vechiclesServices.deleteVehicle(req.params.id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Vehicle deleted Succesfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const vehiclesControllers = {
  createVehicle,
  deleteVehicle,
  getVehicles,
  getSingleVehicles,
  updateVehicles,
};
