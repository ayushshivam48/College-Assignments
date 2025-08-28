import { useEffect, useState } from 'react';
import TeacherSidebar from '../../Shared/Slidebars/Teacher';
import api from '../../api';

const AttendanceEntry = ({ user }: { user?: any }) => {
	const [assignments, setAssignments] = useState<any[]>([]);
	const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
	const [students, setStudents] = useState<any[]>([]);
	const [attendance, setAttendance] = useState<any>({});
	const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
	const [loadingAssignments, setLoadingAssignments] = useState(false);
	const [loadingStudents, setLoadingStudents] = useState(false);
	const [saving, setSaving] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		const fetchAssignments = async () => {
			setLoadingAssignments(true);
			try {
				const data = await api.get('/assignments/filter');
				const assignmentsData = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
				setAssignments(assignmentsData);
				setSelectedAssignment(assignmentsData[0] ?? null);
			} catch (error) {
				setErrorMsg('Error loading assignments.');
				setAssignments([]);
				setSelectedAssignment(null);
			} finally {
				setLoadingAssignments(false);
			}
		};
		fetchAssignments();
	}, []);

	useEffect(() => {
		if (!selectedAssignment) { setStudents([]); setAttendance({}); return; }
		const { course, semester } = selectedAssignment;
		const fetchStudents = async () => {
			setLoadingStudents(true);
			setErrorMsg('');
			try {
				const data = await api.get(`/results/filter?course=${course}&semester=${semester}`);
				const uniqueStudents: any[] = []; const studentIds = new Set();
				data.forEach((result: any) => { if (result.student && !studentIds.has(result.student._id || result.student)) { studentIds.add(result.student._id || result.student); uniqueStudents.push(result.student); } });
				setStudents(uniqueStudents);
				const defaultAttendance: any = {}; uniqueStudents.forEach((student: any) => { defaultAttendance[student._id || student] = 'present'; }); setAttendance(defaultAttendance);
			} catch (error) {
				setErrorMsg('Error loading students.');
				setStudents([]);
				setAttendance({});
			} finally {
				setLoadingStudents(false);
			}
		};
		fetchStudents();
	}, [selectedAssignment]);

	const toggleAttendance = (id: string) => { setAttendance((prev: any) => ({ ...prev, [id]: prev[id] === 'present' ? 'absent' : 'present' })); };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault(); if (!selectedAssignment || students.length === 0) return; setSaving(true); setErrorMsg(''); const { course, semester } = selectedAssignment;
		try {
			const promises = students.map(async (student: any) => { const studentId = student._id || student; const status = attendance[studentId] || 'present'; const payload = { student: studentId, teacher: user?._id, subject: selectedAssignment.subject, course, semester, date: selectedDate, status }; return api.post('/attendance', payload); });
			await Promise.all(promises); alert('✅ Attendance saved!');
		} catch (error) { alert('❌ Error saving attendance.'); } finally { setSaving(false); }
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<TeacherSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold mb-6 text-gray-800">📅 Attendance Entry</h1>
					{errorMsg && (<div className="bg-red-50 border-l-4 border-red-600 text-red-700 p-4 rounded mb-6" role="alert">{errorMsg}</div>)}
					<form className="mb-6 bg-white p-4 rounded shadow" onSubmit={(e) => e.preventDefault()}>
						<label htmlFor="assignment-select" className="block mb-2 text-gray-700 font-semibold">Select Course – Semester – Subject:</label>
						{loadingAssignments ? (<p>Loading assignments...</p>) : (
							<select id="assignment-select" className="w-full border px-3 py-2 rounded bg-gray-50" value={selectedAssignment ? JSON.stringify(selectedAssignment) : ''} onChange={(e) => setSelectedAssignment(JSON.parse(e.target.value))} aria-label="Select course, semester, and subject">
								{assignments.map((a, idx) => (<option key={idx} value={JSON.stringify(a)}>{a.course} – Semester {a.semester} – {a.subject}</option>))}
							</select>
						)}
						<label htmlFor="date-picker" className="block mt-4 mb-1 text-gray-700 font-semibold">Select Date:</label>
						<input id="date-picker" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border px-3 py-2 rounded bg-gray-50" max={new Date().toISOString().split('T')[0]} aria-label="Select attendance date" />
					</form>

					<form onSubmit={handleSubmit}>
						<div className="overflow-x-auto bg-white rounded shadow">
							<table className="w-full text-sm table-auto">
								<thead className="bg-blue-50 border-b text-gray-700">
									<tr>
										<th className="text-left px-4 py-2">Student Name</th>
										<th className="text-left px-4 py-2">Enrollment</th>
										<th className="text-left px-4 py-2">Status</th>
									</tr>
								</thead>
								<tbody>
									{loadingStudents ? (
										<tr><td colSpan={3} className="text-center p-4">Loading students...</td></tr>
									) : students.length === 0 ? (
										<tr><td colSpan={3} className="text-center p-4">No students found.</td></tr>
									) : (
										students.map((student: any) => (
											<tr key={student._id} className="border-b hover:bg-gray-50">
												<td className="px-4 py-2">{student.name}</td>
												<td className="px-4 py-2">{student.enrollment}</td>
												<td className="px-4 py-2">
													<button type="button" onClick={() => toggleAttendance(student._id)} className={`px-3 py-1 rounded font-semibold ${attendance[student._id] === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`} aria-pressed={attendance[student._id] === 'present'} aria-label={`${attendance[student._id] === 'present' ? 'Mark as absent' : 'Mark as present'} for ${student.name}`}>
														{attendance[student._id] === 'present' ? 'Present' : 'Absent'}
													</button>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
						<div className="mt-6 text-right">
							<button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving || students.length === 0}>{saving ? 'Saving...' : '✅ Submit Attendance'}</button>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default AttendanceEntry;