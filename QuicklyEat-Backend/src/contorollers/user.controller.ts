import UserModel from "../models/user.model.js";
import ErrorHandler from "../utils/errorClass.js";
import omit from "lodash/omit.js";
import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import { TUser, TUserLogin, TUserUpdate, TVerifyEmail, verifyEmailSchema } from "../schema/user.schema.js";
import { createUser } from "../services/user.service.js";
import { generateJwtTokenAndSetCookie } from "../utils/generateJwtTokenAndSetCookie.js";
import { generateVerificationCode } from "../utils/generateVerificationToken.js";
import config from "../config/config.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signupHandler = async (req: Request<{}, {}, TUser["body"]>, res: Response, next: NextFunction) => {
  try {
    const userData = req.body;

    const verificationCode = generateVerificationCode()

    const user = await createUser(userData, verificationCode);
    if(!user) throw new ErrorHandler(404, "Failed to create user");

    const userId = user._id as mongoose.Types.ObjectId;
    generateJwtTokenAndSetCookie(res, userId);

    // send email to verify email 
    await sendVerificationEmail(user.email, verificationCode)
    
    res.status(201).json({ 
      success: true,
      message: 'User created successfully',
      user: user, 
    });

  } catch (error: any) {
    console.error("signupHandler error = ", error)
    next(error);   
  }  
}

export const loginHanlder = async (req: Request<{}, {}, TUserLogin["body"]>, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });  
    if(!user) throw new ErrorHandler(404, "incorrect email or password");

    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid) throw new ErrorHandler(404, "incorrect email or password");

    const userId = user._id as mongoose.Types.ObjectId;
    generateJwtTokenAndSetCookie(res, userId)

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: `Welcome Back ${user.fullname}`,
      user:  omit(user.toJSON(), "password"),
    })
  
  } catch (error) {
    console.error("loginHanlder error = ", error)
    next(error)
 
  }
}

export const verifyEmailHandler = async (req: Request<{}, {}, TVerifyEmail["body"]>, res: Response, next: NextFunction) => {
  try {    
    const { verificationCode } = req.body;
    
    if(!verificationCode) throw new ErrorHandler(400, "Verification code is required");
    
    const user = await UserModel.findOne({
      verificationCode: verificationCode, 
      verificationCodeExpiresAt: {$gt: new Date()}
    }).select("-password");

    if(!user) throw new ErrorHandler(404, "Invalid or expired verification code");
    
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();
    
    // send verification email
    await sendWelcomeEmail(user.email, user.fullname)

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: user,
    })

  } catch (error) {
    console.error("verifyEmailHandler error = ", error)
    next(error)
  }
}

export const logoutHandler = async (_: Request, res: Response, next: NextFunction) => {
  try {
    // res.cookie("token", "", { expires: new Date(Date.now()) });
    res.clearCookie("token");
    res.status(200).json({
      success: true, 
      message: "Logged out successfully"
    });

  } catch (error) {
    console.error("logoutHandler error = ", error)
    next(error)
  }
}

export const forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email} = req.body;

    const user = await UserModel.findOne({email});
    if(!user) throw new ErrorHandler(404, "User doesn't exist");

    // const resetToken = Crypto.randomBytes(20).toString("hex");
    const resetToken = crypto.getRandomValues(new Uint8Array(20)).join('').toString();
    const resetTokenExpiresAt = new Date(Date.now() + config.passwordResetTokenTokenExpiry); // 1 hour

    user.resetPasswordToken = resetToken,
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt,
    user.save();

    // send reset paaword email
    await sendPasswordResetEmail(user.email, `${config.clientUrl}/reset-password/${resetToken}`, user.fullname); 
    
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email"
    })

  } catch (error) {
    console.error("forgotPasswordHandler error = ", error)
    next(error)    
  }
}

export const resetPasswordhandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resteToken } = req.params;

    const user = await UserModel.findOne({ 
      resetPasswordToken: resteToken, 
      resetPasswordTokenExpiresAt: { $gt: Date.now() } 
    });

    if(!user) throw new ErrorHandler(404, "Invalid or expired token");

    //update password: password will be updated from pre save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    // send success reset email
    await sendResetSuccessEmail(user.email, user.fullname);

    res.status(200).json({
      success: true,
      message: "Password reset successfully."
    });
  } catch (error) {
    console.error("resetPasswordhandler error = ", error);
    next(error)
  }
}

export const checkAuth = async (req: Request, res: Response) => {}

export const updateProfileHandler = async (req: Request<{}, {}, TUserUpdate["body"]>, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;
    const image = req.file;
    const {fullname, email, contact, country, admin, address, city } = req.body;

    const updateData: any = {};
    if (fullname) updateData.fullname = fullname;
    if (email) updateData.email = email;
    if (contact) updateData.contact = contact;
    if (country) updateData.country = country;
    if (admin) updateData.admin = admin;
    if (address) updateData.address = address;
    if (city) updateData.city = city;

    const user = await UserModel.findByIdAndUpdate(userId, updateData, {new: true}).select("-password");
    if(!user) throw new ErrorHandler(404, "User not found");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: user,
    })
    
  } catch (error) {
    console.error("updateProfileHandler error = ", error)
    next(error)
  }
}

export const addFavouriteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;
    const { restaurantId } = req.body;
    
    const user = await UserModel.findById(userId);
    if(!user) throw new ErrorHandler(404, "User not found");

    if(user.favourite.includes(restaurantId)) {
      user.favourite = user.favourite.filter((fav) => fav !== restaurantId);
    } else {
      user.favourite.push(restaurantId);
    }

    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Added to favourite successfully",
      user: user,
    })
    
  } catch (error) {
    console.error("AddFavouriteHandler error = ", error)
    next(error)
  }
}

export const deleteFavouriteHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;
    const { restaurantId } = req.params;

    // Convert restaurantId to ObjectId (in case it's passed as a string)
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurantId);

    // directly remove the restaurantId from the favourites array
    const result = await UserModel.updateOne(
      { _id: userId },
      { $pull: { favourite: restaurantObjectId } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
      res.status(404).json({ success: false, message: "Favourite not found" });
    }

    res.status(200).json({
      success: true,
      message: "Removed favourite successfully",
    })

  } catch (error) {
    console.error("deleteFavouriteHandler error = ", error)
    next(error)
  }
}

export const getFavouriteListHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;

    const user = await UserModel.findById(userId);
    if(!user) throw new ErrorHandler(404, "User not found");

    res.status(200).json({
      success: true,
      message: "Added to favourite successfully",
      favourite: user.favourite,
    })

  } catch (error) {
    console.error("createfavouriteHandler error = ", error)
    next(error)
  }
}

export const getFavouritesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.id;

    const user = await UserModel.findById(userId).populate({
      path: "favourite",
      // select: "name image rating ratingCount address city country",
    })
    if(!user) throw new ErrorHandler(404, "User not found");

    res.status(200).json({
      success: true,
      message: "Added to favourite successfully",
      favourite: user.favourite,
    })

  } catch (error) {
    console.error("createfavouriteHandler error = ", error)
    next(error)
  }
}