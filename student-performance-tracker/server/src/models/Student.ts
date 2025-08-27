import { Schema, model, Types } from 'mongoose';

const studentSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
		enrollmentNumber: { type: String, unique: true, index: true },
		courses: [{ type: Types.ObjectId, ref: 'Course' }],
	},
	{ timestamps: true }
);

export const Student = model('Student', studentSchema);