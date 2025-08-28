import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import api from "../../api";
import StudentSidebar from "../../Shared/Slidebars/Student";

const StudentDashboard = ({ user }: { user?: any }) => {
	const navigate = useNavigate();
	const [student, setStudent] = useState<any>(null);
	const [attendance, setAttendance] = useState<any[]>([]);
	const [results, setResults] = useState<any[]>([]);
	const [announcements, setAnnouncements] = useState<any[]>([]);
	const [sgpaHistory, setSgpaHistory] = useState<any[]>([]);
	const [weeklyTimetable, setWeeklyTimetable] = useState<any>({});
	const [loadingTimetable, setLoadingTimetable] = useState(true);
	const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

	const attendanceChartRef = useRef<HTMLCanvasElement | null>(null);
	const resultChartRef = useRef<HTMLCanvasElement | null>(null);
	const sgpaChartRef = useRef<HTMLCanvasElement | null>(null);
	const chartsRef = useRef<{ attendanceChart: any; resultChart: any; sgpaChart: any }>({ attendanceChart: null, resultChart: null, sgpaChart: null });

	useEffect(() => {
		if (!user) return;
		const fetchData = async () => {
			try {
				try { const studentData = await api.get(`/students/${user._id}`); setStudent(studentData); setSelectedSemester(studentData.currentSemester); } catch { setStudent(user); setSelectedSemester(user.currentSemester || 1); }
				try { const attendanceData = await api.get(`/attendances/student/${user._id}`); setAttendance(attendanceData || []); } catch { setAttendance([]); }
				try { const resultsData = await api.get(`/results/filter?student=${user._id}`); setResults(resultsData || []); } catch { setResults([]); }
				try { const announcementsData = await api.get("/announcements"); setAnnouncements(Array.isArray(announcementsData) ? announcementsData : []); } catch { setAnnouncements([]); }
				try { const timetableData = await api.get(`/timetables/filter?role=student&course=${user.course}&semester=${user.currentSemester}`); setWeeklyTimetable(timetableData || {}); } catch { setWeeklyTimetable({}); } finally { setLoadingTimetable(false); }
				setSgpaHistory(user.sgpaHistory || []);
			} catch {}
		};
		fetchData();
	}, [user]);

	const filteredAttendance = attendance.filter((item: any) => item.semester <= (selectedSemester || 1));
	const filteredResults = results.filter((item: any) => item.semester <= (selectedSemester || 1));
	const filteredAnnouncements = announcements.filter((a: any) => !a.semester || a.semester <= (selectedSemester || 1));

	const calculateSGPA = (resultList: any[]) => {
		const validResults = resultList.filter((r) => r.internal != null && r.external != null);
		if (!validResults.length) return 0;
		const totalPoints = validResults.reduce((sum, r) => sum + (r.internal + r.external) / 2, 0);
		return totalPoints / validResults.length;
	};
	const sgpa = parseFloat(calculateSGPA(filteredResults).toFixed(2));

	useEffect(() => {
		if (!attendanceChartRef.current || !resultChartRef.current || !sgpaChartRef.current) return;
		Object.values(chartsRef.current).forEach((chart: any) => { if (chart) chart.destroy(); });
		const attCtx = attendanceChartRef.current.getContext("2d")!;
		chartsRef.current.attendanceChart = new Chart(attCtx, { type: "doughnut", data: { labels: filteredAttendance.map((a) => a.subject), datasets: [{ data: filteredAttendance.map((a) => a.percentage), backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#6366F"], }], }, });
		const resCtx = resultChartRef.current.getContext("2d")!;
		chartsRef.current.resultChart = new Chart(resCtx, { type: "bar", data: { labels: filteredResults.map((r) => r.subject), datasets: [{ label: "Internal", data: filteredResults.map((r) => r.internal || 0), backgroundColor: "#3B82F6" }, { label: "External", data: filteredResults.map((r) => r.external || 0), backgroundColor: "#10B981" }], }, options: { scales: { y: { beginAtZero: true, max: 10 } } } });
		const sgpaCtx = sgpaChartRef.current.getContext("2d")!;
		chartsRef.current.sgpaChart = new Chart(sgpaCtx, { type: "line", data: { labels: sgpaHistory.length > 0 ? sgpaHistory.map((_, i) => `Sem ${i + 1}`) : Array.from({ length: selectedSemester || 1 }).map((_, i) => `Sem ${i + 1}`), datasets: [{ label: "SGPA", data: sgpaHistory.length > 0 ? sgpaHistory : Array.from({ length: selectedSemester || 1 }).fill(sgpa), borderColor: "#6366F1", backgroundColor: "#E0E7FF", fill: true, tension: 0.3 }] }, options: { scales: { y: { beginAtZero: true, max: 10 } } } });
		return () => { Object.values(chartsRef.current).forEach((chart: any) => { if (chart) chart.destroy(); }); };
	}, [filteredAttendance, filteredResults, sgpaHistory, selectedSemester]);

	const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

	return (
		<div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex">
			<StudentSidebar />
			<main className={`flex-1 ${filteredAnnouncements.length ? "max-w-screen-lg mx-auto" : "w-full"} p-6 lg:p-10`}>
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3"><FaUser className="text-blue-600" /> {student?.name || user?.name || "Student"}</h1>
					<button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded" aria-label="Logout">Logout</button>
				</div>
				<section className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
					<p><strong>🎓 Course:</strong> {student?.course || user?.course || "N/A"}</p>
					<p><strong>🆔 Enrollment:</strong> {student?.enrollment || user?.enrollment || "N/A"}</p>
					<p><strong>📧 Email:</strong> {student?.email || user?.email || "N/A"}</p>
					<p><strong>🎂 DOB:</strong> {student?.dob ? new Date(student.dob).toDateString() : "N/A"}</p>
					<p><strong>📱 Phone:</strong> {student?.phone || user?.phone || "N/A"}</p>
					<p><strong>📍 Address:</strong> {student?.address || user?.address || "N/A"}</p>
				</section>
				<section className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-lg p-6 mb-6 inline-block">
					<label className="mr-2 font-semibold">Select Semester:</label>
					<select value={selectedSemester || 1} onChange={(e) => setSelectedSemester(Number(e.target.value))} className="border border-gray-300 px-3 py-1 rounded">
						{Array.from({ length: student?.currentSemester || 1 }).map((_, i) => (<option key={i + 1} value={i + 1}>Semester {i + 1}</option>))}
					</select>
				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
					<div className="bg-white rounded-lg shadow p-6"><h2 className="font-semibold text-lg mb-4">Attendance Overview</h2><canvas ref={attendanceChartRef} height={160} /></div>
					<div className="bg-white rounded-lg shadow p-6"><h2 className="font-semibold text-lg mb-4">Result Breakdown</h2><canvas ref={resultChartRef} height={160} /></div>
				</section>
				<section className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-lg p-6 mb-6"><h2 className="font-semibold text-lg mb-4">SGPA Trend</h2><canvas ref={sgpaChartRef} height={160} /></section>
				<section className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-lg p-6 mb-6 overflow-auto max-h-[300px]"><h2 className="font-semibold text-lg mb-4">Subject-wise Results</h2>{filteredResults.length === 0 ? (<p className="text-center text-gray-500">No results available.</p>) : (<table className="w-full text-sm border border-gray-200 rounded-md"><thead><tr className="bg-gray-100 text-gray-700"><th className="p-3 text-left">Subject</th><th className="p-3 text-center">Internal</th><th className="p-3 text-center">External</th><th className="p-3 text-center">Average</th></tr></thead><tbody>{filteredResults.map((res, i) => (<tr key={i} className="border-t hover:bg-gray-50"><td className="p-3">{res.subject}</td><td className="p-3 text-center">{res.internal ?? "-"}</td><td className="p-3 text-center">{res.external ?? "-"}</td><td className="p-3 text-center font-semibold">{res.internal != null && res.external != null ? ((res.internal + res.external) / 2).toFixed(1) : "-"}</td></tr>))}</tbody></table>)}</section>
				<section className="bg-white/80 backdrop-blur border border-white/20 rounded-2xl shadow-lg p-6"><h2 className="font-semibold text-lg mb-4">Weekly Timetable</h2>{loadingTimetable ? (<p>Loading timetable...</p>) : (<div className="overflow-auto"><table className="min-w-full table-auto border border-gray-200 rounded-md"><thead className="bg-gray-200"><tr><th className="border p-3">Day</th>{["9-10 AM","10-11 AM","11-12 PM","12-1 PM","1-1:30 PM","1:30-2:30 PM","2:30-3:30 PM"].map((slot, idx) => (<th key={idx} className="border p-3 text-center">{slot}</th>))}</tr></thead><tbody>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"].map((day) => (<tr key={day} className="border-t"><td className="border p-3 font-semibold bg-gray-100">{day}</td>{["9-10 AM","10-11 AM","11-12 PM","12-1 PM","1-1:30 PM","1:30-2:30 PM","2:30-3:30 PM"].map((slot) => { if (slot === "1-1:30 PM") return (<td key={slot} className="border p-3 bg-gray-50 text-center italic">Lunch</td>); const entry = weeklyTimetable?.[day]?.[slot]; if (!entry || entry.semester > (selectedSemester || 1)) return (<td key={slot} className="border p-3 bg-gray-50 text-center text-gray-400 italic">--</td>); const subjectName = entry.subjectName || entry.subject || ""; const teacherName = entry.teacher || ""; return (<td key={slot} className="border p-3 bg-blue-100 text-center" title={`Teacher: ${teacherName}`}>
							{subjectName}
							<br />
							<small className="text-xs text-gray-700">{teacherName}</small>
						</td>); })}</tr>))}</tbody></table></div>)}
				</section>
				<section className="bg-white rounded-lg shadow p-6 mt-6 max-w-screen-lg mx-auto"><h2 className="font-semibold text-lg mb-4">Announcements</h2>{filteredAnnouncements.length === 0 ? (<p className="text-center text-gray-500">No announcements available.</p>) : (<ul className="space-y-4">{filteredAnnouncements.map((announcement, idx) => (<li key={idx} className="border p-4 rounded-lg bg-blue-50"><p>{announcement.message}</p><small className="text-gray-600">{new Date(announcement.date || announcement.createdAt).toDateString()}</small></li>))}</ul>)}</section>
			</main>
		</div>
	);
};

export default StudentDashboard;