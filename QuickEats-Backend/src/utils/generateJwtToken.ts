import jwt from "jsonwebtoken";
import { Response } from "express";
import { TUserDocument } from "../types/user.type.js";
import config from "../config/config.js";
import mongoose, { Types } from "mongoose";

export const generateAndSetJwtToken = (res:Response, userId: mongoose.Types.ObjectId ) => {

  const token = jwt.sign(
    { userId }, 
    config.jwtSecretKey!, 
    { expiresIn: '1d' }
  );
  
  res.cookie("token", token, {
    httpOnly: true, 
    sameSite: 'strict', 
    maxAge: config.jwtTokenAge,
    secure: config.secure,
  });

  return token;
}