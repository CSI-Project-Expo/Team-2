import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiMoreVertical } from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import ChartComponent from '../components/dashboard/ChartComponent';
import './Dashboard.css';

const adminStats = [
    { icon: <FiUsers />, label: 'Total Users', value: '14,245', color: '#FFD700', trend: '+12% this month' },
    { icon: <FiCheckCircle />, label: 'Verified Accounts', value: '11,850', color: '#48C78E', trend: '+8% this month' },
    { icon: <FiAlertCircle />, label: 'Pending Verification', value: '342', color: '#FF5050', trend: '-5 this week' },
    { icon: <FiTrendingUp />, label: 'Platform Revenue', value: '$24.5k', color: '#AC6CFF', trend: '+18% this month' },
];

const verifyQueue = [
    { id: 'RC-1042', name: 'Google Inc.', type: 'Company', requested: '2h ago', status: 'Pending' },
    { id: 'ST-8891', name: 'Arjun Mehta', type: 'Student', requested: '4h ago', status: 'Pending' },
    { id: 'RC-1043', name: 'Stripe India', type: 'Company', requested: '5h ago', status: 'Pending' },
    { id: 'ST-8892', name: 'Priya Sharma', type: 'Student', requested: '1d ago', status: 'Pending' },
];

const chartData = [
    { label: 'Mon', value: 120, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Tue', value: 180, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Wed', value: 240, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Thu', value: 190, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Fri', value: 310, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Sat', value: 150, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
    { label: 'Sun', value: 90, color: 'linear-gradient(to top, #FFD700, #D4AF37)' },
];

const AdminDashboard = () => {
    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="admin" />
            <main className="dashboard-main">
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Platform <span className="text-gold">Admin</span></h1>
                        <p className="dashboard-subtitle">Monitor signups, verify companies, and analyze traffic.</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="dash-stats-grid">
                    {adminStats.map((stat, i) => (
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
                                <span className="dash-stat-value" style={{ color: stat.color, fontSize: '1.5rem' }}>{stat.value}</span>
                            </div>
                            <div className="dash-stat-label">{stat.label}</div>
                            <div className="dash-stat-trend">{stat.trend}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="dashboard-cols">
                    {/* Traffic Chart */}
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <h3 className="dash-panel-title">Weekly Signups</h3>
                        <div style={{ marginTop: '20px' }}>
                            <ChartComponent data={chartData} height={220} />
                        </div>
                    </motion.div>

                    {/* Verification Queue */}
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                        <h3 className="dash-panel-title">Verification Queue</h3>
                        <div className="applications-list">
                            {verifyQueue.map((item, i) => (
                                <div key={i} className="application-row">
                                    <div className="app-info">
                                        <div className="app-company">{item.name} <span className="tag tag-blue" style={{ marginLeft: '8px', fontSize: '0.65rem' }}>{item.type}</span></div>
                                        <div className="app-role">ID: {item.id} · Req: {item.requested}</div>
                                    </div>
                                    <div className="app-right" style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                                        <button className="btn btn-outline-gold btn-sm" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>Review</button>
                                        <button className="btn btn-ghost btn-sm" style={{ padding: '4px' }}><FiMoreVertical size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '16px' }}>View All Requests</button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
