import { Schema, model } from 'mongoose';

const enrollmentAssignmentSchema = new Schema(
	{
		role: { type: String, enum: ['student', 'teacher'], required: true },
		universityName: { type: String, required: true },
		universityCode: { type: String, required: true },
		branchName: { type: String, required: true },
		branchCode: { type: String, required: true },
		courseName: { type: String },
		courseCode: { type: String },
		year: { type: String },
		yearCode: { type: String },
		departmentName: { type: String },
		departmentCode: { type: String },
		assignedNumberStart: { type: Number, required: true },
		assignedNumberEnd: { type: Number, required: true },
	},
	{ timestamps: true }
);

export const EnrollmentAssignment = model('EnrollmentAssignment', enrollmentAssignmentSchema);