import express from 'express'
import admin from './admin.js'
import api from './api.js';

const router = express.Router();

router.use('/admin', admin);
router.use('/api/v1/member', api);

router.get('/', function (req, res, next) {
    res.redirect('/admin/signin')
});

export default router;
