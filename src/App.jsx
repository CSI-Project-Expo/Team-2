import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import { ResumeProvider } from './context/ResumeContext';
import CursorFollower from './components/common/CursorFollower';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import JobsPage from './pages/JobsPage';
import CompaniesPage from './pages/CompaniesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const AppRoutes = () => {
    const location = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
                <Route path="/jobs" element={<PageTransition><JobsPage /></PageTransition>} />
                <Route path="/companies" element={<PageTransition><CompaniesPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />

                {/* Protected Student Routes */}
                <Route path="/dashboard/student/*" element={<ProtectedRoute allowedRole="student"><PageTransition><StudentDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/dashboard/student/chat" element={<ProtectedRoute allowedRole="student"><PageTransition><ChatPage role="student" /></PageTransition></ProtectedRoute>} />

                {/* Protected Recruiter Routes */}
                <Route path="/dashboard/recruiter/*" element={<ProtectedRoute allowedRole="recruiter"><PageTransition><RecruiterDashboard /></PageTransition></ProtectedRoute>} />
                <Route path="/dashboard/recruiter/chat" element={<ProtectedRoute allowedRole="recruiter"><PageTransition><ChatPage role="recruiter" /></PageTransition></ProtectedRoute>} />

                {/* Protected Admin Routes */}
                <Route path="/dashboard/admin" element={<ProtectedRoute allowedRole="admin"><PageTransition><AdminDashboard /></PageTransition></ProtectedRoute>} />

                {/* Catch-all redirect */}
                <Route path="*" element={<PageTransition><LandingPage /></PageTransition>} />
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    const location = useLocation();

    return (
        <ResumeProvider>
            {location.pathname === "/" && <CursorFollower />}
            <AppRoutes />
        </ResumeProvider>
    );
};

export default App;
