import { Router } from 'express';
import { getAllDepartments, createDepartment } from '../controllers/departmentController.js';

const router = Router();

router.get('/', getAllDepartments);
router.post('/', createDepartment);

export default router;

