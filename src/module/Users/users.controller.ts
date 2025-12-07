import { Request, Response } from "express";
import { userServices } from "./users.service";

const getUser = async (req: Request, res: Response) => {
  

  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
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

const updateUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const result = await userServices.updateUser(
      name,
      email,
      password,
      role,
      req.params.id!
    );

      if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User updated successfully",
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.deleteUser(req.params.id!);

    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
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

export const userControllers = {
  getUser,
  updateUser,
  deleteUser,
};
