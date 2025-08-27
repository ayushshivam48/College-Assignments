import { Router } from 'express';
import { listEnrollmentAssignments, createEnrollmentAssignment, updateEnrollmentAssignment, deleteEnrollmentAssignment } from '../controllers/enrollmentAssignments.controller.js';

const router = Router();

router.get('/enrollment-assignments', listEnrollmentAssignments);
router.post('/enrollment-assignments/create', createEnrollmentAssignment);
router.put('/enrollment-assignments/:id', updateEnrollmentAssignment);
router.delete('/enrollment-assignments/:id', deleteEnrollmentAssignment);

export default router;