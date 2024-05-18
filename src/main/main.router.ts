import express from 'express';
import service from './main.service';
const router = express.Router();

/* /api */
router.post('/upload', service.upload);
router.post('/query', service.query);

export default router;
