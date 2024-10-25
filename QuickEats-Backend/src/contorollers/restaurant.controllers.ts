import { NextFunction, Request, Response } from "express"
import { TRestaurant, TUpdateRestaurant } from "../schema/restaurant.schema.js"
import { createRestaurant, uploadImages } from "../services/restaurant.services.js";
import ErrorHandler from "../utils/errorClass.js";
import RestaurantModel from "../models/restaurant.model.js";
import uploadImageToCloudinary2 from "../utils/cloudinary/uploadImageToCloudinary2.js";



export const createRestaurantHandler = async (req: Request<{}, {}, TRestaurant["body"]>, res: Response, next: NextFunction) => {
  try {
    const { restaurantName } = req.body  
    const file = req.file;
    const id = req.id;
  
    const restaurantExist = await RestaurantModel.findOne({user: req.id})
    
    if (restaurantExist) throw new ErrorHandler(409, "Restaurant already exist for this user"); // each user is allowed to create only one restaurant
 
    if(!file) throw new ErrorHandler(400, "Please upload a restaurant image");

    // upload images to cloudinary from local folder
    // const imageUrl = await uploadImages(restaurantName)

    // upload images to cloudinary directly
    const imageUrl = await uploadImageToCloudinary2(file, restaurantName, "restaurant")
    console.log('imageUrl cloudinary', imageUrl);
    
    
    if(!imageUrl) throw new ErrorHandler(400, "Unable to upload images");
    
    // upload images to cloudinary from local folder
    // const restaurant = await createRestaurant(req.body, id, imageUrl[0])
    
    const restaurant = await createRestaurant(req.body, id, imageUrl)

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant
    })
    
  } catch (error) {
    console.error("createRestaurantHandler error = ", error);
    next(error)
  }
}

export const getRestaurantHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.id;
    const restaurant = await RestaurantModel.findOne({user: id}).populate("menus")
    if(!restaurant) throw new ErrorHandler(404, "Restaurant not found");
    
    res.status(200).json({
      success: true,
      restaurant
    })
    
  } catch (error) {
    console.error("getRestaurantHandler error = ", error);
    next(error)
  }
}

export const updateRestaurantHandler = async (req: Request<{},{},TUpdateRestaurant["body"]>, res: Response, next: NextFunction) => {
  try {
    const id = req.id;
    const file = req.file;
    const {city, country, cuisines, deliveryTime, menus, restaurantName} = req.body;

    // Create an update object only with fields that are provided
    const updateData: any = {};
    if (city) updateData.city = city;
    if (country) updateData.country = country;
    if (cuisines) updateData.cuisines = cuisines;
    if (deliveryTime) updateData.deliveryTime = deliveryTime;
    if (menus) updateData.menus = menus;
    if (restaurantName) updateData.restaurantName = restaurantName;
    
    if (file) {
      if(!restaurantName) throw new ErrorHandler(400, "Restaurant name is required when uploading image ");
      const imageUrl = await uploadImageToCloudinary2(file, restaurantName, "restaurant");
      updateData.imageUrl = imageUrl;
    }

    const restaurant = await RestaurantModel.findOneAndUpdate(
      {user: id}, 
      updateData, 
      {new: true}
    )
    if(!restaurant) throw new ErrorHandler(404, "Restaurant not found");
    
    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant
    })
    
  } catch (error) {
    console.error("updateRestaurantHandler error = ", error);
    next(error)
  }
}

export const getRestaurantOrderHandler = async () => {}

export const updateOrderStatusHandler = async () => {}

export const searchRestaurantHandler = async () => {}

export const getSingleRestaurantHandler = async () => {}