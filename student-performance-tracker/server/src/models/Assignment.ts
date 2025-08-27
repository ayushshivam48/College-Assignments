import { Schema, model, Types } from 'mongoose';

const assignmentSchema = new Schema(
	{
		course: { type: Types.ObjectId, ref: 'Course', required: true },
		title: { type: String, required: true },
		dueDate: { type: Date, required: true },
	},
	{ timestamps: true }
);

export const Assignment = model('Assignment', assignmentSchema);