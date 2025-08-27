import type { Request, Response } from 'express';
import { EnrollmentAssignment } from '../models/EnrollmentAssignment.js';

export async function listEnrollmentAssignments(req: Request, res: Response) {
	const { role } = req.query as { role?: string };
	const filter: any = {};
	if (role) filter.role = role;
	const items = await EnrollmentAssignment.find(filter).lean();
	return res.json(items);
}

export async function createEnrollmentAssignment(req: Request, res: Response) {
	const item = await EnrollmentAssignment.create(req.body);
	return res.status(201).json(item);
}

export async function updateEnrollmentAssignment(req: Request, res: Response) {
	const { id } = req.params;
	const updated = await EnrollmentAssignment.findByIdAndUpdate(id, { $set: req.body }, { new: true });
	return res.json(updated);
}

export async function deleteEnrollmentAssignment(req: Request, res: Response) {
	const { id } = req.params;
	await EnrollmentAssignment.deleteOne({ _id: id });
	return res.json({ ok: true });
}