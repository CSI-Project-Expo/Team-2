import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBriefcase, FiCheckCircle, FiStar, FiUpload, FiTrendingUp,
    FiEye, FiCalendar, FiX, FiMapPin
} from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import { useResume } from '../context/ResumeContext';
import './Dashboard.css';

const statusColor = {
    'Shortlisted': '#48C78E',
    'Applied': '#457EFF',
    'Under Review': '#FFD700',
    'Rejected': '#FF5050',
    'Interview': '#AC6CFF',
};

const ProfileItems = [
    { label: 'Basic Info', done: true },
    { label: 'Resume Uploaded', done: true },
    { label: 'College Email Verified', done: true },
    { label: 'Skills Added', done: false },
    { label: 'LinkedIn Connected', done: false },
];

const StudentDashboard = () => {
    const { applications } = useResume();
    const [user, setUser] = useState(null);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const [uploadModal, setUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadDone, setUploadDone] = useState(false);
    const [dragging, setDragging] = useState(false);
    const fileRef = useRef(null);

    // Derive stats from real context data
    const appliedCount = applications.length;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
    const offerCount = applications.filter(a => a.status === 'Offer').length;
    const avgScore = applications.length
        ? Math.round(applications.reduce((s, a) => s + a.aiScore, 0) / applications.length)
        : 0;

    const stats = [
        { icon: <FiBriefcase />, label: 'Applied', value: appliedCount || 12, color: '#FFD700', trend: '+3 this week' },
        { icon: <FiStar />, label: 'Shortlisted', value: shortlistedCount || 4, color: '#457EFF', trend: '+1 today' },
        { icon: <FiCheckCircle />, label: 'Offers', value: offerCount || 1, color: '#48C78E', trend: '🎉 Congrats!' },
        { icon: <FiTrendingUp />, label: 'Avg AI Score', value: avgScore ? `${avgScore}%` : '72%', color: '#AC6CFF', trend: 'Profile Views: 89' },
    ];

    const handleFileSelect = (file) => {
        if (file) setUploadFile(file);
    };

    const handleDone = async () => {
        if (!uploadFile) return;

        const formData = new FormData();
        formData.append('resume', uploadFile);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            if (res.ok) {
                const data = await res.json();
                console.log('Resume uploaded successfully', data);
                // Update local storage user info
                if (user) {
                    const updatedUser = { ...user, resumeUrl: data.resumeUrl };
                    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
                    setUser(updatedUser);
                }
                setUploadDone(true);
                setTimeout(() => {
                    setUploadModal(false);
                    setUploadDone(false);
                    setUploadFile(null);
                }, 1800);
            } else {
                const data = await res.json();
                alert(data.message || 'Failed to upload resume');
            }
        } catch (error) {
            console.error('Upload Error', error);
            alert('Something went wrong during file upload.');
        }
    };

    const [fetchedJobs, setFetchedJobs] = useState([]);

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/jobs');
                const data = await res.json();
                setFetchedJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };
        fetchJobs();
    }, []);

    const displayJobs = fetchedJobs.length > 0 ? fetchedJobs : [];

    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="student" />
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Good morning, <span className="text-gold">{user?.name?.split(' ')[0] || 'Student'}</span> 👋</h1>
                        <p className="dashboard-subtitle">Here's what's happening with your job search today.</p>
                    </div>
                    <button className="btn btn-gold btn-sm" onClick={() => setUploadModal(true)}>
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
                    {/* Recent Applications */}
                    <motion.div
                        className="dash-panel glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="dash-panel-title">
                            Recent Applications
                            {applications.length > 0 && (
                                <span className="sdash-live-badge">● Live</span>
                            )}
                        </h3>
                        <div className="applications-list">
                            {displayJobs.map((job, i) => (
                                <div key={i} className="application-row">
                                    <div className="app-logo" style={{ background: '#457EFF20', color: '#457EFF' }}>
                                        {job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div className="app-info">
                                        <div className="app-company">{job.companyName}</div>
                                        <div className="app-role">
                                            {job.title}
                                            {job.location && (
                                                <span className="app-location"><FiMapPin size={10} /> {job.location}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="app-right">
                                        <span
                                            className="app-status"
                                            style={{
                                                color: '#FFD700',
                                                background: '#FFD70015',
                                                border: `1px solid #FFD70030`
                                            }}
                                        >
                                            Available
                                        </span>
                                        <div className="app-date">{new Date(job.createdAt).toLocaleDateString()}</div>
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
                            {ProfileItems.map((item, i) => (
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

                        {/* Upload Resume CTA */}
                        <button
                            className="btn btn-gold btn-sm sdash-upload-cta"
                            onClick={() => setUploadModal(true)}
                            style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}
                        >
                            <FiUpload size={13} /> Upload / Update Resume
                        </button>
                    </motion.div>
                </div>
            </main>

            {/* Resume Upload Modal */}
            <AnimatePresence>
                {uploadModal && (
                    <motion.div
                        className="sdash-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setUploadModal(false)}
                    >
                        <motion.div
                            className="sdash-modal"
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="sdash-modal-close" onClick={() => setUploadModal(false)}>
                                <FiX size={18} />
                            </button>
                            <h3 className="sdash-modal-title">Update Your Resume</h3>
                            <p className="sdash-modal-sub">Upload your latest resume to stay visible to recruiters.</p>

                            {uploadDone ? (
                                <div className="sdash-upload-done">
                                    <FiCheckCircle size={40} color="#48C78E" />
                                    <p>Resume updated successfully!</p>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className={`sdash-dropzone ${dragging ? 'sdash-dropzone--drag' : ''} ${uploadFile ? 'sdash-dropzone--has' : ''}`}
                                        onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                        onDragLeave={() => setDragging(false)}
                                        onDrop={e => { e.preventDefault(); setDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            style={{ display: 'none' }}
                                            onChange={e => handleFileSelect(e.target.files[0])}
                                        />
                                        {uploadFile ? (
                                            <div className="sdash-file-selected">
                                                <FiCheckCircle size={22} color="#48C78E" />
                                                <span>{uploadFile.name}</span>
                                            </div>
                                        ) : (
                                            <div className="sdash-dropzone-placeholder">
                                                <FiUpload size={28} />
                                                <span>Drag & drop or click to browse</span>
                                                <small>PDF, DOC, DOCX</small>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="jdm-submit-btn"
                                        onClick={handleDone}
                                        disabled={!uploadFile}
                                        style={{ marginTop: 16 }}
                                    >
                                        <FiUpload size={14} /> Save Resume
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentDashboard;
