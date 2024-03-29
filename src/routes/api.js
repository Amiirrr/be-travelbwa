import express from "express";
import apiController from "../controller/apiController.js";
import { upload } from '../middleware/multer.js'

const api = express.Router();

api.get('/landing-page', apiController.landingPage);
api.get('/detail-page/:id', apiController.detailPage);
api.get('/booking-page', apiController.bookingPage);
api.post('/booking-page', upload, apiController.bookingPage);

export default api