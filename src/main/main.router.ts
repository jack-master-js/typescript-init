import express from 'express';
import service from './main.service';
const router = express.Router();

/* /api */
router.get('/upload', service.upload);

export default router;
