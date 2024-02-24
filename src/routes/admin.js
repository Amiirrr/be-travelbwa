import express from "express";
import adminController from "../controller/adminController.js";

const admin = express.Router();

//dashboard
admin.get('/dashboard', adminController.viewDashboard)

//category
admin.get('/category', adminController.viewCategory)
admin.post('/category', adminController.AddCategory)

//item
admin.get('/item', adminController.viewItem)

//bank
admin.get('/bank', adminController.viewBank)

//booking
admin.get('/booking', adminController.viewBooking)

export default admin