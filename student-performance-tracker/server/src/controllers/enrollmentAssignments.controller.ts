import type { Request, Response } from 'express';

export async function listEnrollmentAssignments(_req: Request, res: Response) {
	return res.json([]);
}

export async function createEnrollmentAssignment(_req: Request, res: Response) {
	return res.status(410).json({ message: 'Enrollment assignment feature removed' });
}

export async function updateEnrollmentAssignment(_req: Request, res: Response) {
	return res.status(410).json({ message: 'Enrollment assignment feature removed' });
}

export async function deleteEnrollmentAssignment(_req: Request, res: Response) {
	return res.status(410).json({ message: 'Enrollment assignment feature removed' });
}