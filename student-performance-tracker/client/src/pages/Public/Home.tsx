import { Link } from 'react-router-dom';

export default function Home() {
	return (
		<div className="mx-auto max-w-5xl px-4 py-16">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-blue-700">Student Performance Tracker</h1>
				<p className="mt-3 text-gray-600">Unified tracking for grades, attendance, and assignments with analytics.</p>
				<div className="mt-6 flex justify-center gap-4">
					<Link to="/login" className="rounded bg-blue-600 px-5 py-2 text-white">Login</Link>
					<Link to="/signup" className="rounded border border-blue-600 px-5 py-2 text-blue-600">Signup</Link>
				</div>
			</div>
			<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="rounded border p-4"><h3 className="font-semibold">Integrated Tracking</h3><p className="text-sm text-gray-600">Centralized grades, attendance, and submissions.</p></div>
				<div className="rounded border p-4"><h3 className="font-semibold">Real-time Analytics</h3><p className="text-sm text-gray-600">Dashboards with trends and insights.</p></div>
				<div className="rounded border p-4"><h3 className="font-semibold">Role-based Access</h3><p className="text-sm text-gray-600">Admins, Teachers, Students.</p></div>
			</div>
		</div>
	);
}