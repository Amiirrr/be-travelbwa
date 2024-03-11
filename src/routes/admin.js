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
admin.get('/item/show-image/:id', adminController.ShowImageItem);
admin.get('/item/:id', adminController.ShowEditItem);
admin.put('/item/:id', uploadMultiple, adminController.EditItem);
admin.delete('/item/:id', adminController.DeleteItem);
admin.get('/item/show-detail-item/:itemId', adminController.ViewDetailItem);

//endpoint feature 
admin.post('/item/add/feature', upload, adminController.AddFeature);
admin.put('/item/update/feature', upload, adminController.UpdateFeature);
admin.delete('/item/:itemId/feature/:id/', adminController.DeleteFeature);

//endpoint feature 
admin.post('/item/add/activity', upload, adminController.AddActivity);
admin.put('/item/update/activity', upload, adminController.UpdateActivity);
admin.delete('/item/:itemId/activity/:id/', adminController.DeleteActivity);

//bank
admin.get('/bank', adminController.viewBank);
admin.post('/bank', upload, adminController.AddBank);
admin.put('/bank', upload, adminController.UpdateBank);
admin.delete('/bank/:id', adminController.DeleteBank);

//booking
admin.get('/booking', adminController.viewBooking);

export default admin