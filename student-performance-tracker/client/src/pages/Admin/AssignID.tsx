import { useState } from 'react';
import { api } from '../../services/api';

export default function AssignID() {
	const [userId, setUserId] = useState('');
	const [enrollmentNumber, setEnrollmentNumber] = useState('');
	const [message, setMessage] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		const { data } = await api.post('/api/admin/assign-id', { userId, enrollmentNumber });
		setMessage(`Assigned: ${data?.enrollmentNumber || enrollmentNumber}`);
	}

	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold">Assign Student ID</h2>
			<form onSubmit={onSubmit} className="mt-4 space-y-3 max-w-md">
				<input className="w-full rounded border px-3 py-2" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
				<input className="w-full rounded border px-3 py-2" placeholder="Enrollment Number" value={enrollmentNumber} onChange={(e) => setEnrollmentNumber(e.target.value)} />
				<button className="rounded bg-blue-600 px-4 py-2 text-white">Assign</button>
			</form>
			{message && <div className="mt-3 rounded bg-green-50 p-2 text-green-700">{message}</div>}
		</div>
	);
}