import express from 'express'
import admin from './admin.js'

const router = express.Router();

router.use('/admin', admin);

router.get('/', function (req, res, next) {
    res.redirect('/admin/signin')
});

export default router;
