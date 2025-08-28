import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Header from './components/Header';
import Home from './pages/Public/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/Admin/Dashboard';
import SearchStudents from './pages/Admin/SearchStudents';
import SearchTeachers from './pages/Admin/SearchTeachers';
// removed AssignID
import AssignmentManager from './pages/Admin/Assignments';
import AdminTimetableManager from './pages/Admin/Timetable';
import TeacherDashboard from './pages/Teacher/Dashboard';
import GradeEntry from './pages/Teacher/Grades';
import AttendanceEntry from './pages/Teacher/Attendance';
import AnnouncementPanel from './pages/Teacher/Announcements';
import StudentDashboard from './pages/Student/Dashboard';
import { useAuthStore } from './store/auth';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Header />
			<main>{children}</main>
		</div>
	);
}

function WithUser({ children }: { children: (user: any) => React.ReactNode }) {
	const { user } = useAuthStore();
	return <>{children(user)}</>;
}

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},
	{ path: '/login', element: <Layout><Login /></Layout> },
	{ path: '/signup', element: <Layout><Signup /></Layout> },
	{
		path: '/admin',
		element: <PrivateRoute allow={['admin']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithUser>{(u) => <AdminDashboard user={u} />}</WithUser></Layout> },
			{ path: 'search-student', element: <Layout><SearchStudents /></Layout> },
			{ path: 'search-teacher', element: <Layout><SearchTeachers /></Layout> },
			{ path: 'assignments', element: <Layout><AssignmentManager /></Layout> },
			{ path: 'timetable', element: <Layout><AdminTimetableManager /></Layout> },
			// assign-id removed
		],
	},
	{
		path: '/teacher',
		element: <PrivateRoute allow={['teacher']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithUser>{(u) => <TeacherDashboard user={u} />}</WithUser></Layout> },
			{ path: 'grades', element: <Layout><GradeEntry /></Layout> },
			{ path: 'attendance', element: <Layout><WithUser>{(u) => <AttendanceEntry user={u} />}</WithUser></Layout> },
			{ path: 'announcements', element: <Layout><AnnouncementPanel /></Layout> },
		],
	},
	{
		path: '/student',
		element: <PrivateRoute allow={['student']} />,
		children: [
			{ path: 'dashboard', element: <Layout><WithUser>{(u) => <StudentDashboard user={u} />}</WithUser></Layout> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
