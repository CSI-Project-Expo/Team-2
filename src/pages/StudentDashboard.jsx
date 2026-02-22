import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiCheckCircle, FiStar, FiUpload, FiTrendingUp } from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import './Dashboard.css';

const stats = [
    { icon: <FiBriefcase />, label: 'Applied', value: 12, color: '#FFD700', trend: '+3 this week' },
    { icon: <FiStar />, label: 'Shortlisted', value: 4, color: '#457EFF', trend: '+1 today' },
    { icon: <FiCheckCircle />, label: 'Offers', value: 1, color: '#48C78E', trend: '🎉 Congrats!' },
    { icon: <FiTrendingUp />, label: 'Profile Views', value: 89, color: '#AC6CFF', trend: '+22 this week' },
];

const applications = [
    { company: 'Google', role: 'Software Engineer', status: 'Shortlisted', date: '20 Feb', color: '#4285F4', logo: 'G' },
    { company: 'Razorpay', role: 'Frontend Dev', status: 'Applied', date: '18 Feb', color: '#3395FF', logo: 'R' },
    { company: 'Microsoft', role: 'UX Researcher', status: 'Under Review', date: '15 Feb', color: '#00A4EF', logo: 'M' },
    { company: 'Swiggy', role: 'Product Manager', status: 'Rejected', date: '10 Feb', color: '#FC8019', logo: 'S' },
];

const statusColor = {
    'Shortlisted': '#48C78E',
    'Applied': '#457EFF',
    'Under Review': '#FFD700',
    'Rejected': '#FF5050',
};

const StudentDashboard = () => {
    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="student" />
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Good morning, <span className="text-gold">Vaishakh</span> 👋</h1>
                        <p className="dashboard-subtitle">Here's what's happening with your job search today.</p>
                    </div>
                    <button className="btn btn-gold btn-sm">
                        <FiUpload size={14} /> Update Resume
                    </button>
                </div>

                {/* Stats Row */}
                <div className="dash-stats-grid">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="dash-stat-card glass-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                        >
                            <div className="dash-stat-top">
                                <div className="dash-stat-icon" style={{ color: stat.color, background: stat.color + '15' }}>
                                    {stat.icon}
                                </div>
                                <span className="dash-stat-value" style={{ color: stat.color }}>{stat.value}</span>
                            </div>
                            <div className="dash-stat-label">{stat.label}</div>
                            <div className="dash-stat-trend">{stat.trend}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Two columns */}
                <div className="dashboard-cols">
                    {/* Applications */}
                    <motion.div
                        className="dash-panel glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="dash-panel-title">Recent Applications</h3>
                        <div className="applications-list">
                            {applications.map((app, i) => (
                                <div key={i} className="application-row">
                                    <div className="app-logo" style={{ background: app.color + '20', color: app.color }}>
                                        {app.logo}
                                    </div>
                                    <div className="app-info">
                                        <div className="app-company">{app.company}</div>
                                        <div className="app-role">{app.role}</div>
                                    </div>
                                    <div className="app-right">
                                        <span className="app-status" style={{ color: statusColor[app.status], background: statusColor[app.status] + '15', border: `1px solid ${statusColor[app.status]}30` }}>
                                            {app.status}
                                        </span>
                                        <div className="app-date">{app.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Profile Completion */}
                    <motion.div
                        className="dash-panel glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="dash-panel-title">Profile Completeness</h3>
                        <div className="profile-ring-wrap">
                            <svg width="120" height="120" className="profile-ring">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                <circle
                                    cx="60" cy="60" r="50"
                                    fill="none"
                                    stroke="url(#gold-grad)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${314 * 0.72} 314`}
                                    transform="rotate(-90 60 60)"
                                />
                                <defs>
                                    <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%">
                                        <stop offset="0%" stopColor="#FFD700" />
                                        <stop offset="100%" stopColor="#D4AF37" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <span className="ring-value">72%</span>
                        </div>

                        <div className="profile-items">
                            {[
                                { label: 'Basic Info', done: true },
                                { label: 'Resume Uploaded', done: true },
                                { label: 'College Email Verified', done: true },
                                { label: 'Skills Added', done: false },
                                { label: 'LinkedIn Connected', done: false },
                            ].map((item, i) => (
                                <div key={i} className="profile-item">
                                    <span className={`profile-item-icon ${item.done ? 'done' : ''}`}>
                                        {item.done ? '✓' : '○'}
                                    </span>
                                    <span className="profile-item-label" style={{ color: item.done ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
