import { Router } from 'express';
import { getAllSubjects, createSubject } from '../controllers/subjectController.js';

const router = Router();

router.get('/', getAllSubjects);
router.post('/', createSubject);

export default router;

