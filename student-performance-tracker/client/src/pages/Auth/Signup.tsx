import { useState } from 'react';
import { api } from '../../services/api';

export default function Signup() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMessage(null); setError(null);
		try {
			await api.post('/api/auth/signup', { name, email, password, role });
			setMessage('Signup successful. You can now login.');
		} catch (e: any) {
			setError(e?.response?.data?.message || 'Signup failed');
		}
	}

	return (
		<div className="mx-auto max-w-md px-4 py-12">
			<h2 className="text-2xl font-semibold">Signup</h2>
			<form onSubmit={onSubmit} className="mt-6 space-y-4">
				<div>
					<label className="block text-sm">Name</label>
					<input className="mt-1 w-full rounded border px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm">Email</label>
					<input className="mt-1 w-full rounded border px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm">Password</label>
					<input type="password" className="mt-1 w-full rounded border px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
				</div>
				<div>
					<label className="block text-sm">Role</label>
					<select className="mt-1 w-full rounded border px-3 py-2" value={role} onChange={(e) => setRole(e.target.value as any)}>
						<option value="admin">Admin</option>
						<option value="teacher">Teacher</option>
						<option value="student">Student</option>
					</select>
				</div>
				{message && <div className="rounded bg-green-50 p-2 text-sm text-green-700">{message}</div>}
				{error && <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
				<button className="w-full rounded bg-blue-600 py-2 text-white">Signup</button>
			</form>
		</div>
	);
}