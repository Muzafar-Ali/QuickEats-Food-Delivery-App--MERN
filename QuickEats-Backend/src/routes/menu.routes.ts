import { Router } from "express";
import { createMenuHandler, deleteMenuHandler, getMenuHandler, updateMenuHandler } from "../contorollers/menu.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { idSchema } from "../schema/menu.schema.js";
import upload from "../middlewares/multer.middlewar2.js";
import validateRequestData from "../middlewares/validateRequestData.js";
import { createMenuItemHandler } from "../contorollers/menuItem.controllers.js";


const route = Router();

route.post("/", [isAuthenticated, upload.single("image")] , createMenuHandler)
route.get("/", isAuthenticated, getMenuHandler)
route.put("/:id", [isAuthenticated, validateRequestData(idSchema), upload.single("image")],  updateMenuHandler)
route.delete("/:id", [isAuthenticated, validateRequestData(idSchema)],  deleteMenuHandler)

// menut item routes
route.post("/item", createMenuItemHandler)

export default route;