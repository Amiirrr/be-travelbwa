import express from "express";
import adminController from "../controller/adminController.js";

const admin = express.Router();

admin.get('/dashboard', adminController.viewDashboard)
admin.get('/category', adminController.viewCategory)
admin.get('/item', adminController.viewItem)
admin.get('/bank', adminController.viewBank)
admin.get('/booking', adminController.viewBooking)

export default admin