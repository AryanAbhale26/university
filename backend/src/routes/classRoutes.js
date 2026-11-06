import { Router } from 'express';
import { getAllClasses, createClass } from '../controllers/classController.js';

const router = Router();

router.get('/', getAllClasses);
router.post('/', createClass);

export default router;

