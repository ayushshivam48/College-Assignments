import { useEffect, useState } from 'react';
import { api } from '../../services/api';

export default function SearchStudents() {
	const [q, setQ] = useState('');
	const [items, setItems] = useState<any[]>([]);
	useEffect(() => {
		const t = setTimeout(() => {
			api.get('/api/admin/search-student', { params: { q } }).then(({ data }) => setItems(data));
		}, 300);
		return () => clearTimeout(t);
	}, [q]);
	return (
		<div className="p-6">
			<h2 className="text-2xl font-semibold">Search Students</h2>
			<input className="mt-4 w-full max-w-md rounded border px-3 py-2" placeholder="Search by name/email" value={q} onChange={(e) => setQ(e.target.value)} />
			<div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
				{items.map((u) => (
					<div key={u._id} className="rounded border p-3">
						<div className="font-medium">{u.name}</div>
						<div className="text-sm text-gray-600">{u.email}</div>
					</div>
				))}
			</div>
		</div>
	);
}