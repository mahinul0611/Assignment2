import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization as string;

      // console.log(req.headers);

      const bearerToken = token.split(' ')[1];

      if (!bearerToken) {
        throw new Error("You are not Allowed for this operation!!");
      }

      const decoded = jwt.verify(
        bearerToken,
        config.jwtSecret as string
      ) as JwtPayload;

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role as string))
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
        });

      next();
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};

export default auth;
