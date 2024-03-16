import express from "express";
import apiController from "../controller/apiController.js";
import { upload } from '../middleware/multer.js'

const api = express.Router();

api.get('/landing-page', apiController.landingPage);
api.get('/detail-page/:id', apiController.detailPage);
api.post('/booking-page', apiController.bookingPage);

export default api