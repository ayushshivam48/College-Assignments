import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function StudentDashboard() {
	const [data, setData] = useState<any>(null);
	useEffect(() => {
		api.get('/api/student/dashboard').then(({ data }) => setData(data));
	}, []);
	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold">My Dashboard</h2>
			<p className="mt-2 text-gray-600">Grades, assignments, and attendance summary.</p>
			<pre className="mt-4 rounded bg-gray-50 p-3 text-xs">{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}