import express from "express";
import adminController from "../controller/adminController.js";

const admin = express.Router();

admin.get('/dashboard', adminController.viewDashboard)

export default admin