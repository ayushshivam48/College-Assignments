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
import AssignID from './pages/Admin/AssignID';
import TeacherDashboard from './pages/Teacher/Dashboard';
import TeacherGrades from './pages/Teacher/Grades';
import TeacherAttendance from './pages/Teacher/Attendance';
import TeacherAnnouncements from './pages/Teacher/Announcements';
import StudentDashboard from './pages/Student/Dashboard';

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen">
			<Header />
			<main>{children}</main>
		</div>
	);
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
			{ path: 'dashboard', element: <Layout><AdminDashboard /></Layout> },
			{ path: 'search-student', element: <Layout><SearchStudents /></Layout> },
			{ path: 'search-teacher', element: <Layout><SearchTeachers /></Layout> },
			{ path: 'assign-id', element: <Layout><AssignID /></Layout> },
		],
	},
	{
		path: '/teacher',
		element: <PrivateRoute allow={['teacher']} />,
		children: [
			{ path: 'dashboard', element: <Layout><TeacherDashboard /></Layout> },
			{ path: 'grades', element: <Layout><TeacherGrades /></Layout> },
			{ path: 'attendance', element: <Layout><TeacherAttendance /></Layout> },
			{ path: 'announcements', element: <Layout><TeacherAnnouncements /></Layout> },
		],
	},
	{
		path: '/student',
		element: <PrivateRoute allow={['student']} />,
		children: [
			{ path: 'dashboard', element: <Layout><StudentDashboard /></Layout> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
