import { Schema, model, Types } from 'mongoose';

const teacherSchema = new Schema(
	{
		user: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
		courses: [{ type: Types.ObjectId, ref: 'Course' }],
	},
	{ timestamps: true }
);

export const Teacher = model('Teacher', teacherSchema);