import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiFileText, FiBookmark, FiMessageCircle, FiBriefcase, FiUsers, FiSettings, FiLogOut, FiBarChart2, FiShield, FiArrowLeft } from 'react-icons/fi';
import './DashboardSidebar.css';

const studentNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/student' },
    { icon: <FiUser size={18} />, label: 'Profile', path: '/dashboard/student/profile' },
    { icon: <FiFileText size={18} />, label: 'Resume', path: '/dashboard/student/resume' },
    { icon: <FiBriefcase size={18} />, label: 'Applications', path: '/dashboard/student/applications' },
    { icon: <FiBookmark size={18} />, label: 'Saved Jobs', path: '/dashboard/student/saved' },
    { icon: <FiMessageCircle size={18} />, label: 'Messages', path: '/dashboard/student/chat' },
    { icon: <FiSettings size={18} />, label: 'Settings', path: '/dashboard/student/settings' },
];

const recruiterNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/recruiter' },
    { icon: <FiBriefcase size={18} />, label: 'Post Job', path: '/dashboard/recruiter/post-job' },
    { icon: <FiUsers size={18} />, label: 'Applicants', path: '/dashboard/recruiter/applicants' },
    { icon: <FiMessageCircle size={18} />, label: 'Chat', path: '/dashboard/recruiter/chat' },
    { icon: <FiFileText size={18} />, label: 'Question Bank', path: '/dashboard/recruiter/questions' },
    { icon: <FiSettings size={18} />, label: 'Settings', path: '/dashboard/recruiter/settings' },
];

const adminNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/admin' },
    { icon: <FiShield size={18} />, label: 'Verification', path: '/dashboard/admin/verify' },
    { icon: <FiBarChart2 size={18} />, label: 'Analytics', path: '/dashboard/admin/analytics' },
    { icon: <FiUsers size={18} />, label: 'Users', path: '/dashboard/admin/users' },
];

const DashboardSidebar = ({ role = 'student' }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = role === 'student' ? studentNav : role === 'recruiter' ? recruiterNav : adminNav;
    const roleLabel = role === 'student' ? '🎓 Student' : role === 'recruiter' ? '🏢 Recruiter' : '🛡️ Admin';

    return (
        <aside className="dashboard-sidebar">
            <div className="ds-logo">
                <Link to="/" className="ds-logo-text">
                    <span className="text-gold">HIRE</span>SPHERE
                </Link>
            </div>

            {/* Profile Snippet */}
            <div className="ds-profile">
                <div className="ds-avatar">V</div>
                <div className="ds-profile-info">
                    <div className="ds-name">Vaishakh B.</div>
                    <div className="ds-role-tag">{roleLabel}</div>
                </div>
            </div>

            <div className="ds-divider" />

            {/* Back to Landing Page */}
            <Link to="/" className="ds-back-home">
                <FiArrowLeft size={15} />
                <span>Back to Home</span>
            </Link>

            <div className="ds-divider" />

            {/* Nav Items */}
            <nav className="ds-nav">
                {navItems.map(item => (
                    <Link
                        key={item.label}
                        to={item.path}
                        className={`ds-nav-item ${location.pathname === item.path ? 'ds-nav-item--active' : ''}`}
                    >
                        <span className="ds-nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.label === 'Messages' && (
                            <span className="ds-badge">3</span>
                        )}
                    </Link>
                ))}
            </nav>

            <div style={{ flex: 1 }} />

            <div className="ds-divider" />

            {/* Logout */}
            <button className="ds-nav-item ds-logout" onClick={() => navigate('/')}>
                <span className="ds-nav-icon"><FiLogOut size={18} /></span>
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default DashboardSidebar;
