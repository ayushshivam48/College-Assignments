import { useEffect, useState } from 'react';
import TeacherSidebar from '../../Shared/Slidebars/Teacher';
import api from '../../api';

const GradeEntry = () => {
	const [assignments, setAssignments] = useState<any[]>([]);
	const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
	const [students, setStudents] = useState<any[]>([]);
	const [grades, setGrades] = useState<any>({});
	const [loadingAssignments, setLoadingAssignments] = useState(false);
	const [loadingGrades, setLoadingGrades] = useState(false);
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
				setAssignments([]);
				setSelectedAssignment(null);
				setErrorMsg('Error loading assignments.');
			} finally {
				setLoadingAssignments(false);
			}
		};
		fetchAssignments();
	}, []);

	useEffect(() => {
		if (!selectedAssignment) { setStudents([]); setGrades({}); return; }
		const { course, semester } = selectedAssignment;
		const fetchGrades = async () => {
			setLoadingGrades(true);
			setErrorMsg('');
			try {
				const data = await api.get(`/results/filter?course=${course}&semester=${semester}`);
				const uniqueStudents: any[] = []; const studentIds = new Set(); const resultMap: any = {};
				(data || []).forEach((result: any) => {
					if (result.student && !studentIds.has(result.student._id || result.student)) {
						const studentId = result.student._id || result.student;
						studentIds.add(studentId);
						uniqueStudents.push(result.student);
						resultMap[studentId] = { internal: result.internal ?? '', external: result.external ?? '' };
					}
				});
				setStudents(uniqueStudents);
				const defaultGrades: any = {};
				uniqueStudents.forEach((student: any) => { const studentId = student._id || student; defaultGrades[studentId] = { internal: resultMap[studentId]?.internal ?? '', external: resultMap[studentId]?.external ?? '', }; });
				setGrades(defaultGrades);
			} catch (error) {
				setStudents([]);
				setGrades({});
				setErrorMsg('Error loading student grades.');
			} finally {
				setLoadingGrades(false);
			}
		};
		fetchGrades();
	}, [selectedAssignment]);

	const handleInput = (e: React.ChangeEvent<HTMLInputElement>, studentId: string, field: 'internal' | 'external') => {
		let value = e.target.value;
		if (value === '') { setGrades((prev: any) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: '' } })); return; }
		let numeric = parseFloat(value);
		if (isNaN(numeric)) numeric = NaN as any; else numeric = Math.min(Math.max(numeric, 0), 10);
		setGrades((prev: any) => ({ ...prev, [studentId]: { ...prev[studentId], [field]: numeric } }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedAssignment || students.length === 0) return;
		setSaving(true);
		setErrorMsg('');
		const { course, semester } = selectedAssignment;
		try {
			const promises = students.map(async (student: any) => {
				const studentId = student._id || student;
				const internal = parseFloat(grades[studentId]?.internal || 0);
				const external = parseFloat(grades[studentId]?.external || 0);
				const subject = selectedAssignment.subject;
				const existingResults = await api.get(`/results/filter?course=${course}&semester=${semester}&subject=${subject}&student=${studentId}`);
				const existingResult = existingResults.length > 0 ? existingResults[0] : null;
				const payload = { student: studentId, course, semester, subject, internal, external, resultStatus: internal >= 4 && external >= 4 ? 'Pass' : 'Fail' };
				if (existingResult) return api.put(`/results/${existingResult._id}`, payload);
				else return api.post('/results', payload);
			});
			await Promise.all(promises);
			alert('✅ Grades saved successfully!');
		} catch (error) {
			alert('❌ Error saving grades.');
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<TeacherSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-2xl font-bold mb-6 text-gray-800">🎓 Grade Entry Panel</h1>
					{errorMsg && (<div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>)}
					<form className="mb-6 bg-white p-4 rounded shadow" onSubmit={(e) => e.preventDefault()}>
						<label htmlFor="assignment-select" className="block mb-2 text-gray-700 font-semibold">Select Course – Semester – Subject:</label>
						{loadingAssignments ? (<p>Loading assignments...</p>) : (
							<select id="assignment-select" className="w-full border px-3 py-2 rounded bg-gray-50" value={selectedAssignment ? JSON.stringify(selectedAssignment) : ''} onChange={(e) => setSelectedAssignment(JSON.parse(e.target.value))} aria-label="Select course, semester, subject">
								{assignments.map((a, idx) => (<option key={idx} value={JSON.stringify(a)}>{a.course} – Semester {a.semester} – {a.subject}</option>))}
							</select>
						)}
					</form>

					<form onSubmit={handleSubmit}>
						<div className="overflow-x-auto bg-white rounded shadow">
							<table className="w-full text-sm table-auto">
								<thead className="bg-blue-50 border-b text-gray-700">
									<tr>
										<th className="text-left px-4 py-2">Student Name</th>
										<th className="text-left px-4 py-2">Enrollment</th>
										<th className="text-left px-4 py-2">Internal (0–10)</th>
										<th className="text-left px-4 py-2">External (0–10)</th>
									</tr>
								</thead>
								<tbody>
									{loadingGrades ? (
										<tr><td colSpan={4} className="text-center p-4">Loading grades...</td></tr>
									) : students.length === 0 ? (
										<tr><td colSpan={4} className="text-center p-4">No students found.</td></tr>
									) : (
										students.map((student: any) => (
											<tr key={student._id} className="border-b hover:bg-gray-50">
												<td className="px-4 py-2">{student.name}</td>
												<td className="px-4 py-2">{student.enrollment}</td>
												<td className="px-4 py-2">
													<input type="number" min="0" max="10" step="0.1" value={grades[student._id]?.internal ?? ''} onChange={(e) => handleInput(e, student._id, 'internal')} className="border px-2 py-1 rounded w-24 bg-white" aria-label={`Internal grade for ${student.name}`} />
												</td>
												<td className="px-4 py-2">
													<input type="number" min="0" max="10" step="0.1" value={grades[student._id]?.external ?? ''} onChange={(e) => handleInput(e, student._id, 'external')} className="border px-2 py-1 rounded w-24 bg-white" aria-label={`External grade for ${student.name}`} />
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>

						<div className="mt-6 text-right">
							<button type="submit" disabled={saving || students.length === 0} className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-50 disabled:cursor-not-allowed`}>{saving ? 'Saving...' : '💾 Save Grades'}</button>
						</div>
					</form>
				</main>
			</div>
		</div>
	);
};

export default GradeEntry;