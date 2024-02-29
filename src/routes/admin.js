import express from "express";
import adminController from "../controller/adminController.js";
import { upload, uploadMultiple } from '../middleware/multer.js'

const admin = express.Router();

//dashboard
admin.get('/dashboard', adminController.viewDashboard);

//endpoint category
admin.get('/category', adminController.viewCategory);
admin.post('/category', adminController.AddCategory);
admin.put('/category', adminController.UpdateCategory);
admin.delete('/category/:id', adminController.DeleteCategory);

//item
admin.get('/item', adminController.viewItem);
admin.post('/item', uploadMultiple, adminController.AddItem);

//bank
admin.get('/bank', adminController.viewBank);
admin.post('/bank', upload, adminController.AddBank);
admin.put('/bank', upload, adminController.UpdateBank);
admin.delete('/bank/:id', adminController.DeleteBank);

//booking
admin.get('/booking', adminController.viewBooking);

export default admin