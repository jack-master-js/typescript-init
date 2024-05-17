import express from 'express';
import service from './user.service';
import auth from '../common/middleware/auth';

const router = express.Router();

/* /api/user */

router.post('/create', service.create);
router.post('/update', service.update);
router.post('/find', service.find);
router.post('/get', service.get);
router.post('/del', auth, service.del);
router.post('/export', auth, service.export);
router.post('/login', service.login);

export default router;
