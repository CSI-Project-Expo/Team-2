import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiUser, FiFileText, FiBookmark, FiMessageCircle, FiBriefcase, FiUsers, FiSettings, FiLogOut, FiBarChart2, FiShield, FiArrowLeft } from 'react-icons/fi';
import './DashboardSidebar.css';

const studentNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/student' },
    { icon: <FiBriefcase size={18} />, label: 'Applications', path: '/dashboard/student/applications' },
    { icon: <FiBookmark size={18} />, label: 'Saved Jobs', path: '/dashboard/student/saved' },
    { icon: <FiSettings size={18} />, label: 'Settings', path: '/dashboard/student/settings' },
];

const recruiterNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/recruiter' },
    { icon: <FiBriefcase size={18} />, label: 'Post Job', path: '/dashboard/recruiter#post-job' },
    { icon: <FiUsers size={18} />, label: 'Applicants', path: '/dashboard/recruiter#applicants' },
    { icon: <FiMessageCircle size={18} />, label: 'Chats', path: '/dashboard/recruiter#chats' },
    { icon: <FiSettings size={18} />, label: 'Settings', path: '/dashboard/recruiter/settings' },
];

const adminNav = [
    { icon: <FiHome size={18} />, label: 'Overview', path: '/dashboard/admin' },
    { icon: <FiShield size={18} />, label: 'Verification', path: '/dashboard/admin/verify' },
    { icon: <FiBarChart2 size={18} />, label: 'Analytics', path: '/dashboard/admin/analytics' },
    { icon: <FiUsers size={18} />, label: 'Users', path: '/dashboard/admin/users' },
];

const DashboardSidebar = ({ role = 'student' }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

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
                <div className="ds-avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <div className="ds-profile-info">
                    <div className="ds-name">{user?.name || 'User'}</div>
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
                        className={`ds-nav-item ${(location.pathname === item.path || location.pathname + location.hash === item.path) ? 'ds-nav-item--active' : ''}`}
                    >
                        <span className="ds-nav-icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div style={{ flex: 1 }} />

            <div className="ds-divider" />

            {/* Logout */}
            <button className="ds-nav-item ds-logout" onClick={handleLogout}>
                <span className="ds-nav-icon"><FiLogOut size={18} /></span>
                <span>Logout</span>
            </button>
        </aside>
    );
};

export default DashboardSidebar;
