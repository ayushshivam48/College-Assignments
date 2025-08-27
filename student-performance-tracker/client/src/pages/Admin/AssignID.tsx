import { useState, useEffect, type FormEvent } from 'react';
import AdminSidebar from '../../Shared/Slidebars/Admin';
import api from '../../api';

const AdminAssignId = () => {
	const [universityName, setUniversityName] = useState('');
	const [universityCode, setUniversityCode] = useState('');
	const [branchName, setBranchName] = useState('');
	const [branchCode, setBranchCode] = useState('');
	const [savedUniversityBranch, setSavedUniversityBranch] = useState<any>(null);
	const [commonMessage, setCommonMessage] = useState('');
	const [commonError, setCommonError] = useState('');

	const [studentCourseName, setStudentCourseName] = useState('');
	const [studentCourseCode, setStudentCourseCode] = useState('');
	const [studentYear, setStudentYear] = useState('');
	const [studentYearCode, setStudentYearCode] = useState('');
	const [studentAssignedNumberStart, setStudentAssignedNumberStart] = useState('');
	const [studentAssignedNumberEnd, setStudentAssignedNumberEnd] = useState('');
	const [studentMessage, setStudentMessage] = useState('');
	const [studentError, setStudentError] = useState('');
	const [savedStudents, setSavedStudents] = useState<any[]>([]);
	const [editingStudentId, setEditingStudentId] = useState<string | null>(null);

	const [teacherDepartmentName, setTeacherDepartmentName] = useState('');
	const [teacherDepartmentCode, setTeacherDepartmentCode] = useState('');
	const [teacherAssignedNumberStart, setTeacherAssignedNumberStart] = useState('');
	const [teacherAssignedNumberEnd, setTeacherAssignedNumberEnd] = useState('');
	const [teacherMessage, setTeacherMessage] = useState('');
	const [teacherError, setTeacherError] = useState('');
	const [savedTeachers, setSavedTeachers] = useState<any[]>([]);
	const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);

	useEffect(() => {
		const fetchSavedAssignments = async () => {
			try {
				const resStudents = await api.get('/enrollment-assignments?role=student');
				setSavedStudents(Array.isArray(resStudents) ? resStudents : []);
				const resTeachers = await api.get('/enrollment-assignments?role=teacher');
				setSavedTeachers(Array.isArray(resTeachers) ? resTeachers : []);
			} catch (error: any) {
				setCommonError('Error fetching saved enrollment assignments: ' + (error?.message || ''));
			}
		};
		fetchSavedAssignments();
	}, []);

	const handleSaveUniversityBranch = (e: FormEvent) => {
		e.preventDefault();
		setCommonMessage('');
		setCommonError('');
		if (!universityName.trim() || !universityCode.trim() || !branchName.trim() || !branchCode.trim()) {
			setCommonError('Please fill all university and branch fields.');
			return;
		}
		setSavedUniversityBranch({
			universityName: universityName.trim(),
			universityCode: universityCode.trim(),
			branchName: branchName.trim(),
			branchCode: branchCode.trim(),
		});
		setCommonMessage('University and Branch information saved.');
	};

	const handleStudentSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setStudentError('');
		setStudentMessage('');
		if (!studentCourseName.trim() || !studentCourseCode.trim() || !studentYear.trim() || !studentYearCode.trim() || !studentAssignedNumberStart.trim() || !studentAssignedNumberEnd.trim()) {
			setStudentError('Please fill all student fields.');
			return;
		}
		if (!/^[0-9]{4}$/.test(studentYear.trim())) {
			setStudentError('Year must be a 4-digit number.');
			return;
		}
		if (!/^[0-9]{2}$/.test(studentYearCode.trim())) {
			setStudentError('Year code must be a 2-digit number.');
			return;
		}
		const startNum = parseInt(studentAssignedNumberStart, 10);
		const endNum = parseInt(studentAssignedNumberEnd, 10);
		if (isNaN(startNum) || startNum < 1) return setStudentError('Student assigned number start must be a positive number.');
		if (isNaN(endNum) || endNum < startNum) return setStudentError('Student assigned number end must be a positive number and greater than start number.');
		if (!savedUniversityBranch) return setStudentError('Please save University and Branch information first.');
		const payload = {
			role: 'student',
			universityName: savedUniversityBranch.universityName,
			universityCode: savedUniversityBranch.universityCode,
			branchName: savedUniversityBranch.branchName,
			branchCode: savedUniversityBranch.branchCode,
			courseName: studentCourseName.trim(),
			courseCode: studentCourseCode.trim(),
			year: studentYear.trim(),
			yearCode: studentYearCode.trim(),
			assignedNumberStart: startNum,
			assignedNumberEnd: endNum,
		};
		try {
			if (editingStudentId) {
				const response = await api.put(`/enrollment-assignments/${editingStudentId}`, payload);
				setStudentMessage(response?.message || 'Student enrollment assignment updated successfully');
				setSavedStudents((prev) => prev.map((s) => (s._id === editingStudentId ? response || s : s)));
				setEditingStudentId(null);
			} else {
				const response = await api.post('/enrollment-assignments/create', payload);
				setStudentMessage(response?.message || 'Student enrollment assignment created successfully');
				setSavedStudents((prev) => [...prev, response || payload]);
			}
			setStudentCourseName('');
			setStudentCourseCode('');
			setStudentYear('');
			setStudentYearCode('');
			setStudentAssignedNumberStart('');
			setStudentAssignedNumberEnd('');
		} catch (error: any) {
			setStudentError(error?.message || 'Error creating/updating student enrollment assignment');
		}
	};

	const handleTeacherSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setTeacherError('');
		setTeacherMessage('');
		if (!teacherDepartmentName.trim() || !teacherDepartmentCode.trim() || !teacherAssignedNumberStart.trim() || !teacherAssignedNumberEnd.trim()) {
			setTeacherError('Please fill all teacher fields.');
			return;
		}
		const startNum = parseInt(teacherAssignedNumberStart, 10);
		const endNum = parseInt(teacherAssignedNumberEnd, 10);
		if (isNaN(startNum) || startNum < 1) return setTeacherError('Teacher assigned number start must be a positive number.');
		if (isNaN(endNum) || endNum < startNum) return setTeacherError('Teacher assigned number end must be a positive number and greater than start number.');
		if (!savedUniversityBranch) return setTeacherError('Please save University and Branch information first.');
		const payload = {
			role: 'teacher',
			universityName: savedUniversityBranch.universityName,
			universityCode: savedUniversityBranch.universityCode,
			branchName: savedUniversityBranch.branchName,
			branchCode: savedUniversityBranch.branchCode,
			departmentName: teacherDepartmentName.trim(),
			departmentCode: teacherDepartmentCode.trim(),
			assignedNumberStart: startNum,
			assignedNumberEnd: endNum,
		};
		try {
			if (editingTeacherId) {
				const response = await api.put(`/enrollment-assignments/${editingTeacherId}`, payload);
				setTeacherMessage(response?.message || 'Teacher enrollment assignment updated successfully');
				setSavedTeachers((prev) => prev.map((t) => (t._id === editingTeacherId ? response || t : t)));
				setEditingTeacherId(null);
			} else {
				const response = await api.post('/enrollment-assignments/create', payload);
				setTeacherMessage(response?.message || 'Teacher enrollment assignment created successfully');
				setSavedTeachers((prev) => [...prev, response || payload]);
			}
			setTeacherDepartmentName('');
			setTeacherDepartmentCode('');
			setTeacherAssignedNumberStart('');
			setTeacherAssignedNumberEnd('');
		} catch (error: any) {
			setTeacherError(error?.message || 'Error creating/updating teacher enrollment assignment');
		}
	};

	const handleEditStudent = (student: any) => {
		setEditingStudentId(student._id);
		setStudentCourseName(student.courseName);
		setStudentCourseCode(student.courseCode);
		setStudentYear(student.year);
		setStudentYearCode(student.yearCode);
		setStudentAssignedNumberStart(student.assignedNumberStart || '');
		setStudentAssignedNumberEnd(student.assignedNumberEnd || '');
		setStudentMessage('');
		setStudentError('');
	};

	const handleEditTeacher = (teacher: any) => {
		setEditingTeacherId(teacher._id);
		setTeacherDepartmentName(teacher.departmentName);
		setTeacherDepartmentCode(teacher.departmentCode);
		setTeacherAssignedNumberStart(teacher.assignedNumberStart || '');
		setTeacherAssignedNumberEnd(teacher.assignedNumberEnd || '');
		setTeacherMessage('');
		setTeacherError('');
	};

	const handleDeleteStudent = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this student enrollment assignment?')) return;
		await api.delete(`/enrollment-assignments/${id}`);
		setSavedStudents((prev) => prev.filter((s) => s._id !== id));
		setStudentMessage('Student enrollment assignment deleted successfully');
	};

	const handleDeleteTeacher = async (id: string) => {
		if (!window.confirm('Are you sure you want to delete this teacher enrollment assignment?')) return;
		await api.delete(`/enrollment-assignments/${id}`);
		setSavedTeachers((prev) => prev.filter((t) => t._id !== id));
		setTeacherMessage('Teacher enrollment assignment deleted successfully');
	};

	return (
		<div className="min-h-screen bg-gray-100">
			<div className="flex">
				<AdminSidebar />
				<main className="flex-1 p-6">
					<h1 className="text-3xl font-bold mb-6 text-center">Assign Enrollment/ID</h1>
					<div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10 mb-8">
						<form onSubmit={handleSaveUniversityBranch} className="bg-white p-6 rounded shadow lg:w-1/2 space-y-4">
							<h2 className="text-2xl font-semibold mb-4">University and Branch Information</h2>
							<input type="text" placeholder="University Name" value={universityName} onChange={(e) => setUniversityName(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="University Name" />
							<input type="text" placeholder="University Code" value={universityCode} onChange={(e) => setUniversityCode(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="University Code" />
							<input type="text" placeholder="Branch Name" value={branchName} onChange={(e) => setBranchName(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Branch Name" />
							<input type="text" placeholder="Branch Code" value={branchCode} onChange={(e) => setBranchCode(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Branch Code" />
							<button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition" aria-label="Save University and Branch">Save University & Branch</button>
							{commonMessage && <p className="mt-2 text-green-600">{commonMessage}</p>}
							{commonError && <p className="mt-2 text-red-600">{commonError}</p>}
						</form>

						<div className="bg-white p-6 rounded shadow lg:w-1/2 overflow-auto max-h-80">
							<h2 className="text-2xl font-semibold mb-4">Saved University & Branch</h2>
							{savedUniversityBranch ? (
								<table className="w-full border">
									<thead>
										<tr>
											<th className="border px-2 py-1">University</th>
											<th className="border px-2 py-1">Code</th>
											<th className="border px-2 py-1">Branch</th>
											<th className="border px-2 py-1">Code</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td className="border px-2 py-1">{savedUniversityBranch.universityName}</td>
											<td className="border px-2 py-1">{savedUniversityBranch.universityCode}</td>
											<td className="border px-2 py-1">{savedUniversityBranch.branchName}</td>
											<td className="border px-2 py-1">{savedUniversityBranch.branchCode}</td>
										</tr>
									</tbody>
								</table>
							) : (
								<p>No university and branch saved yet.</p>
							)}
						</div>
					</div>

					<div className="flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10">
						<form onSubmit={handleStudentSubmit} className="bg-white p-6 rounded shadow lg:w-1/2 space-y-4">
							<h2 className="text-2xl font-semibold mb-4">Student Enrollment Assignment</h2>
							<input type="text" placeholder="Course Name" value={studentCourseName} onChange={(e) => setStudentCourseName(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Student Course Name" />
							<input type="text" placeholder="Course Code" value={studentCourseCode} onChange={(e) => setStudentCourseCode(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Student Course Code" />
							<input type="text" placeholder="Year (e.g. 2025)" value={studentYear} onChange={(e) => { const val = e.target.value; if (/^[0-9]{0,4}$/.test(val)) { setStudentYear(val); setStudentYearCode(val.length === 4 ? val.slice(2) : ''); } }} maxLength={4} pattern="\d{4}" className="w-full border rounded px-3 py-2" required aria-label="Student Year" />
							<input type="text" placeholder="Year Code" value={studentYearCode} readOnly className="w-full border rounded px-3 py-2 bg-gray-100" aria-label="Student Year Code" />
							<input type="text" placeholder="Assigned Number Start" value={studentAssignedNumberStart} onChange={(e) => setStudentAssignedNumberStart(e.target.value.replace(/\D/g, ''))} className="w-full border rounded px-3 py-2" required aria-label="Student Assigned Number Start" />
							<input type="text" placeholder="Assigned Number End" value={studentAssignedNumberEnd} onChange={(e) => setStudentAssignedNumberEnd(e.target.value.replace(/\D/g, ''))} className="w-full border rounded px-3 py-2" required aria-label="Student Assigned Number End" />
							<button type="submit" className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition" aria-label={editingStudentId ? 'Update Student Enrollment' : 'Assign Student Enrollment'}>
								{editingStudentId ? 'Update Student Enrollment' : 'Assign Student Enrollment'}
							</button>
							{studentMessage && <p className="text-green-600">{studentMessage}</p>}
							{studentError && <p className="text-red-600">{studentError}</p>}
						</form>

						<form onSubmit={handleTeacherSubmit} className="bg-white p-6 rounded shadow lg:w-1/2 space-y-4">
							<h2 className="text-2xl font-semibold mb-4">Teacher ID Assignment</h2>
							<input type="text" placeholder="Department Name" value={teacherDepartmentName} onChange={(e) => setTeacherDepartmentName(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Teacher Department Name" />
							<input type="text" placeholder="Department Code" value={teacherDepartmentCode} onChange={(e) => setTeacherDepartmentCode(e.target.value)} className="w-full border rounded px-3 py-2" required aria-label="Teacher Department Code" />
							<input type="text" placeholder="Assigned Number Start" value={teacherAssignedNumberStart} onChange={(e) => setTeacherAssignedNumberStart(e.target.value.replace(/\D/g, ''))} className="w-full border rounded px-3 py-2" required aria-label="Teacher Assigned Number Start" />
							<input type="text" placeholder="Assigned Number End" value={teacherAssignedNumberEnd} onChange={(e) => setTeacherAssignedNumberEnd(e.target.value.replace(/\D/g, ''))} className="w-full border rounded px-3 py-2" required aria-label="Teacher Assigned Number End" />
							<button type="submit" className="w-full bg-yellow-600 text-white py-3 rounded hover:bg-yellow-700 transition" aria-label={editingTeacherId ? 'Update Teacher ID' : 'Assign Teacher ID'}>
								{editingTeacherId ? 'Update Teacher ID' : 'Assign Teacher ID'}
							</button>
							{teacherMessage && <p className="text-green-600">{teacherMessage}</p>}
							{teacherError && <p className="text-red-600">{teacherError}</p>}
						</form>
					</div>

					<div className="flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-10 mt-10">
						<div className="lg:w-1/2 bg-white p-6 rounded shadow overflow-auto max-h-96">
							<h2 className="text-2xl font-semibold mb-4">Saved Student Enrollments</h2>
							{savedStudents.length > 0 ? (
								<table className="w-full border">
									<thead>
										<tr>
											<th className="border px-2 py-1">Course</th>
											<th className="border px-2 py-1">Code</th>
											<th className="border px-2 py-1">Year</th>
											<th className="border px-2 py-1">Start</th>
											<th className="border px-2 py-1">End</th>
											<th className="border px-2 py-1">Actions</th>
										</tr>
									</thead>
									<tbody>
										{savedStudents.map((s) => (
											<tr key={s._id}>
												<td className="border px-2 py-1">{s.courseName}</td>
												<td className="border px-2 py-1">{s.courseCode}</td>
												<td className="border px-2 py-1">{s.year}</td>
												<td className="border px-2 py-1">{s.assignedNumberStart}</td>
												<td className="border px-2 py-1">{s.assignedNumberEnd}</td>
												<td className="border px-2 py-1 space-x-2">
													<button onClick={() => handleEditStudent(s)} className="bg-blue-600 text-white px-3 py-1 rounded" aria-label={`Edit enrollment for course ${s.courseName}`}>Edit</button>
													<button onClick={() => handleDeleteStudent(s._id)} className="bg-red-600 text-white px-3 py-1 rounded" aria-label={`Delete enrollment for course ${s.courseName}`}>Delete</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>No student enrollments saved yet.</p>
							)}
						</div>

						<div className="lg:w-1/2 bg-white p-6 rounded shadow overflow-auto max-h-96">
							<h2 className="text-2xl font-semibold mb-4">Saved Teacher IDs</h2>
							{savedTeachers.length > 0 ? (
								<table className="w-full border">
									<thead>
										<tr>
											<th className="border px-2 py-1">Department</th>
											<th className="border px-2 py-1">Code</th>
											<th className="border px-2 py-1">Start</th>
											<th className="border px-2 py-1">End</th>
											<th className="border px-2 py-1">Actions</th>
										</tr>
									</thead>
									<tbody>
										{savedTeachers.map((t) => (
											<tr key={t._id}>
												<td className="border px-2 py-1">{t.departmentName}</td>
												<td className="border px-2 py-1">{t.departmentCode}</td>
												<td className="border px-2 py-1">{t.assignedNumberStart}</td>
												<td className="border px-2 py-1">{t.assignedNumberEnd}</td>
												<td className="border px-2 py-1 space-x-2">
													<button onClick={() => handleEditTeacher(t)} className="bg-blue-600 text-white px-3 py-1 rounded" aria-label={`Edit ID assignment for department ${t.departmentName}`}>Edit</button>
													<button onClick={() => handleDeleteTeacher(t._id)} className="bg-red-600 text-white px-3 py-1 rounded" aria-label={`Delete ID assignment for department ${t.departmentName}`}>Delete</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<p>No teacher IDs saved yet.</p>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminAssignId;