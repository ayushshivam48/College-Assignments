import { Schema, model, Types } from 'mongoose';

const attendanceSchema = new Schema(
	{
		course: { type: Types.ObjectId, ref: 'Course', required: true },
		date: { type: Date, required: true },
		records: [
			{
				student: { type: Types.ObjectId, ref: 'Student', required: true },
				status: { type: String, enum: ['present', 'absent', 'late'], required: true },
			},
		],
	},
	{ timestamps: true }
);

export const Attendance = model('Attendance', attendanceSchema);