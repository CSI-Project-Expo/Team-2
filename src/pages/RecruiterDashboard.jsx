import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiUsers, FiMessageCircle, FiPlusCircle, FiTrendingUp } from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import './Dashboard.css';
import './RecruiterDashboard.css';

const stats = [
    { icon: <FiBriefcase />, label: 'Active Jobs', value: 5, color: '#FFD700' },
    { icon: <FiUsers />, label: 'Total Applicants', value: 247, color: '#457EFF' },
    { icon: <FiMessageCircle />, label: 'Active Chats', value: 12, color: '#48C78E' },
    { icon: <FiTrendingUp />, label: 'Views This Week', value: 1843, color: '#AC6CFF' },
];

const jobPostings = [
    { title: 'Senior Frontend Engineer', applicants: 89, status: 'Active', posted: '2d ago' },
    { title: 'Backend Developer', applicants: 64, status: 'Active', posted: '5d ago' },
    { title: 'Product Designer', applicants: 52, status: 'Paused', posted: '1w ago' },
    { title: 'Data Analyst', applicants: 42, status: 'Active', posted: '1w ago' },
];

const applicantRows = [
    { name: 'Priya S.', role: 'Frontend Eng', college: 'IIT Bombay', status: 'Shortlisted', avatar: 'PS' },
    { name: 'Rahul M.', role: 'Backend Dev', college: 'NIT Trichy', status: 'Applied', avatar: 'RM' },
    { name: 'Ananya P.', role: 'Designer', college: 'BITS Pilani', status: 'Interview', avatar: 'AP' },
];

const RecruiterDashboard = () => {
    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="recruiter" />
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Recruiter <span className="text-gold">Hub</span></h1>
                        <p className="dashboard-subtitle">Manage your job posts and find top talent.</p>
                    </div>
                    <button className="btn btn-gold btn-sm">
                        <FiPlusCircle size={14} /> Post New Job
                    </button>
                </div>

                {/* Stats */}
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
                        </motion.div>
                    ))}
                </div>

                <div className="dashboard-cols">
                    {/* Job Postings */}
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="dash-panel-title">Job Postings</h3>
                        <div className="job-rows">
                            {jobPostings.map((job, i) => (
                                <div key={i} className="job-row">
                                    <div className="job-row-info">
                                        <div className="job-row-title">{job.title}</div>
                                        <div className="job-row-meta">{job.applicants} applicants · {job.posted}</div>
                                    </div>
                                    <span className={`job-row-status ${job.status === 'Active' ? 'status-active' : 'status-paused'}`}>
                                        {job.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Applicants */}
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h3 className="dash-panel-title">Recent Applicants</h3>
                        <div className="applications-list">
                            {applicantRows.map((app, i) => (
                                <div key={i} className="application-row">
                                    <div className="app-logo" style={{ background: '#FFD70015', color: '#FFD700' }}>
                                        {app.avatar}
                                    </div>
                                    <div className="app-info">
                                        <div className="app-company">{app.name}</div>
                                        <div className="app-role">{app.college}</div>
                                    </div>
                                    <div className="app-right">
                                        <span className="tag tag-blue">{app.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default RecruiterDashboard;
