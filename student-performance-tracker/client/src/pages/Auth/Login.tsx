import { useState } from 'react';
import { useAuthStore } from '../../store/auth';

export default function Login() {
	const { login, loading, error } = useAuthStore();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [role, setRole] = useState<'admin' | 'teacher' | 'student'>('student');

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		await login(email, password);
	}

	return (
		<div className="mx-auto max-w-md px-4 py-12">
			<h2 className="text-2xl font-semibold">Login</h2>
			<form onSubmit={onSubmit} className="mt-6 space-y-4">
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
				{error && <div className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</div>}
				<button disabled={loading} className="w-full rounded bg-blue-600 py-2 text-white">
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>
		</div>
	);
}