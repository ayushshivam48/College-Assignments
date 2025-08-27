import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function AdminDashboard() {
	const [stats, setStats] = useState<{ students: number; teachers: number; courses: number; assignments: number } | null>(null);
	useEffect(() => {
		api.get('/api/admin/dashboard').then(({ data }) => setStats(data));
	}, []);
	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold">Admin Dashboard</h2>
			<div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
				{['students','teachers','courses','assignments'].map((k) => (
					<div key={k} className="rounded border p-4">
						<div className="text-sm text-gray-500">{k}</div>
						<div className="text-2xl font-bold">{(stats as any)?.[k] ?? '-'}</div>
					</div>
				))}
			</div>
		</div>
	);
}