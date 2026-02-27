import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    FiBriefcase, FiCheckCircle, FiStar, FiUpload, FiTrendingUp,
    FiEye, FiCalendar, FiX, FiMapPin, FiBookmark, FiFileText, FiMail
} from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import JobCard from '../components/browse/JobCard';
import { useResume } from '../context/ResumeContext';
import './Dashboard.css';

const statusColor = {
    'Shortlisted': '#48C78E',
    'Applied': '#457EFF',
    'Under Review': '#FFD700',
    'Rejected': '#FF5050',
    'Shortlisted for in-person interview': '#AC6CFF',
    'Interview': '#AC6CFF',
};

const StudentDashboard = () => {
    const { applications: dummyApps } = useResume();
    const [user, setUser] = React.useState(null);
    const location = useLocation();

    // Determine current view from pathname
    const currentView = location.pathname.split('/').pop();
    const isOverview = currentView === 'student';

    const [applications, setApplications] = useState([]);
    const [fetchedJobs, setFetchedJobs] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Fetch Student's Real Applications
    React.useEffect(() => {
        const fetchStudentApps = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch('http://localhost:5000/api/jobs/student/applications', { headers });
                if (res.ok) {
                    const data = await res.json();
                    setApplications(data);
                }
            } catch (err) {
                console.error("Failed to fetch applications:", err);
            }
        };

        const fetchJobs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/jobs');
                const data = await res.json();
                setFetchedJobs(data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };

        fetchStudentApps();
        fetchJobs();

    }, [location]);

    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    React.useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setEditName(parsed.name || '');
            setEditEmail(parsed.email || '');

            // Load saved jobs strictly scoped to user
            const saved = JSON.parse(localStorage.getItem(`savedJobs_${parsed._id}`) || '[]');
            setSavedJobs(saved);
        }
    }, [location]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        alert('Sending Name: ' + editName + ' Email: ' + editEmail);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName, email: editEmail })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('userInfo', JSON.stringify(data));
                setUser(data);
                window.dispatchEvent(new Event('userUpdated'));
                alert('Profile updated successfully!');
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    const ProfileItems = [
        { label: 'Basic Info', done: true },
        { label: 'Resume Uploaded', done: !!user?.resumeUrl },
        { label: 'College Email Verified', done: true },
        { label: 'Skills Added', done: false },
        { label: 'LinkedIn Connected', done: false },
    ];

    const [uploadModal, setUploadModal] = React.useState(false);
    const [uploadFile, setUploadFile] = React.useState(null);
    const [uploadDone, setUploadDone] = React.useState(false);
    const [dragging, setDragging] = React.useState(false);
    const fileRef = React.useRef(null);

    const displayJobs = fetchedJobs.length > 0 ? fetchedJobs : [];

    // Derive stats from real application data
    const appliedCount = applications.length;
    const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
    const offerCount = applications.filter(a => a.status === 'Offer' || a.status === 'Accepted').length;

    const stats = [
        { icon: <FiBriefcase />, label: 'Applied', value: appliedCount, color: '#FFD700', trend: 'Total applications' },
        { icon: <FiStar />, label: 'Shortlisted', value: shortlistedCount, color: '#457EFF', trend: 'Under review' },
        { icon: <FiCheckCircle />, label: 'Offers', value: offerCount, color: '#48C78E', trend: 'Offers received' },
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



    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="student" />
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    {isOverview && (
                        <div>
                            <h1 className="dashboard-title">Good morning, <span className="text-gold">{user?.name?.split(' ')[0] || 'Student'}</span> 👋</h1>
                            <p className="dashboard-subtitle">Here's what's happening with your job search today.</p>
                        </div>
                    )}
                    {currentView === 'applications' && (
                        <div>
                            <h1 className="dashboard-title">Your <span className="text-gold">Applications</span></h1>
                            <p className="dashboard-subtitle">Track the status of roles you've applied for.</p>
                        </div>
                    )}
                    {currentView === 'saved' && (
                        <div>
                            <h1 className="dashboard-title">Saved <span className="text-gold">Jobs</span></h1>
                            <p className="dashboard-subtitle">Opportunities you've bookmarked for later.</p>
                        </div>
                    )}
                    {currentView === 'settings' && (
                        <div>
                            <h1 className="dashboard-title">Account <span className="text-gold">Settings</span></h1>
                            <p className="dashboard-subtitle">Manage your profile and account preferences.</p>
                        </div>
                    )}
                    <button className="btn btn-gold btn-sm" onClick={() => setUploadModal(true)}>
                        <FiUpload size={14} /> Update Resume
                    </button>
                </div>

                {isOverview && (
                    <>

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
                                    {applications.slice(0, 3).map((app, i) => (
                                        <div key={i} className="application-row">
                                            <div className="app-logo" style={{ background: '#457EFF20', color: '#457EFF' }}>
                                                {app.companyName ? app.companyName.charAt(0).toUpperCase() : 'C'}
                                            </div>
                                            <div className="app-info">
                                                <div className="app-company">{app.companyName}</div>
                                                <div className="app-role">
                                                    {app.jobTitle}
                                                    {app.location && (
                                                        <span className="app-location" style={{ marginLeft: 8 }}><FiMapPin size={10} /> {app.location}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="app-right">
                                                <span
                                                    className="app-status"
                                                    style={{
                                                        color: statusColor[app.status] || '#FFD700',
                                                        background: `${statusColor[app.status] || '#FFD700'}15`,
                                                        border: `1px solid ${statusColor[app.status] || '#FFD700'}30`
                                                    }}
                                                >
                                                    {app.status}
                                                </span>
                                                <div className="app-date">{app.date}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {applications.length === 0 && (
                                        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                            No applications yet.
                                        </div>
                                    )}
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
                                {user?.resumeUrl && (
                                    <a
                                        href={`http://localhost:5000${user.resumeUrl}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline-gold btn-sm"
                                        style={{ width: '100%', justifyContent: 'center', marginTop: 10, display: 'flex' }}
                                    >
                                        <FiFileText size={13} style={{ marginRight: 6 }} /> View Current Resume
                                    </a>
                                )}
                            </motion.div>
                        </div>
                    </>
                )}

                {currentView === 'applications' && (
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="applications-list">
                            {applications.length > 0 ? applications.map((app, i) => (
                                <div key={i} className="application-row">
                                    <div className="app-logo" style={{ background: '#457EFF20', color: '#457EFF' }}>
                                        {app.jobTitle ? app.jobTitle.charAt(0).toUpperCase() : 'J'}
                                    </div>
                                    <div className="app-info">
                                        <div className="app-company" style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>{app.companyName || 'Corporate'}</div>
                                        <div className="app-role" style={{ color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            {app.jobTitle || 'Role'}
                                            {app.location && <span>• <FiMapPin size={11} style={{ display: 'inline', transform: 'translateY(-1px)' }} /> {app.location}</span>}
                                        </div>
                                    </div>
                                    <div className="app-right" style={{ textAlign: 'right' }}>
                                        <span
                                            className="app-status"
                                            style={{
                                                color: statusColor[app.status] || '#FFD700',
                                                background: `${statusColor[app.status] || '#FFD700'}15`,
                                                border: `1px solid ${statusColor[app.status] || '#FFD700'}30`,
                                                display: 'inline-block',
                                                marginBottom: '6px'
                                            }}
                                        >
                                            {app.status === 'Shortlisted for in-person interview' ? '🎉 ' : ''}{app.status}
                                        </span>
                                        {app.status === 'Shortlisted for in-person interview' && app.recruiterEmail && (
                                            <a
                                                href={`mailto:${app.recruiterEmail}`}
                                                className="btn btn-outline-gold btn-sm"
                                                style={{ display: 'block', marginTop: 8, fontSize: '0.8rem', padding: '4px 10px', width: 'fit-content', marginLeft: 'auto' }}
                                            >
                                                <FiMail size={12} style={{ marginRight: 4 }} /> Contact Recruiter
                                            </a>
                                        )}
                                        <div className="app-date" style={{ fontSize: '0.8rem', marginTop: '6px' }}>Applied on {app.date}</div>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    <FiBriefcase size={40} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <p>You haven't applied to any jobs yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {currentView === 'saved' && (
                    <motion.div className="browse-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        {savedJobs.length > 0 ? (
                            savedJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))
                        ) : (
                            <div className="dash-panel glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 20px' }}>
                                <FiBookmark size={40} style={{ color: 'var(--text-muted)', marginBottom: 16, opacity: 0.5 }} />
                                <h3 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>No saved jobs</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Jobs you bookmark will appear here.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {currentView === 'settings' && (
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                        <div className="settings-section" style={{ marginBottom: 30 }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Account Information</h3>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="form-group" style={{ marginBottom: 16 }}>
                                    <label className="form-label">Username</label>
                                    <input type="text" className="input" value={editName} onChange={e => setEditName(e.target.value)} required />
                                </div>
                                <div className="form-group" style={{ marginBottom: 16 }}>
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="input" value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
                                </div>
                                <button type="submit" className="btn btn-ghost" style={{ border: '1px solid var(--border-light)' }}>Update Info</button>
                            </form>
                        </div>

                        <div className="settings-section" style={{ marginBottom: 30, borderTop: '1px solid var(--border-light)', paddingTop: 30 }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Security</h3>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">Current Password</label>
                                <input type="password" className="input" placeholder="••••••••" />
                            </div>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label">New Password</label>
                                <input type="password" className="input" placeholder="••••••••" />
                            </div>
                            <button className="btn btn-ghost" style={{ border: '1px solid var(--border-light)' }}>Change Password</button>
                        </div>

                        <div className="settings-section" style={{ marginBottom: 30, borderTop: '1px solid var(--border-light)', paddingTop: 30 }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Login Activity</h3>
                            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span>Windows • Chrome</span>
                                    <span style={{ color: '#48C78E' }}>Active Now</span>
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>IP: 192.168.1.1 • Location: Bangalore, India</div>
                            </div>
                        </div>

                        <div className="settings-section" style={{ borderTop: '1px solid rgba(255, 80, 80, 0.2)', paddingTop: 30 }}>
                            <h3 style={{ marginBottom: 16, color: '#FF5050' }}>Danger Zone</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>Once you delete your account, there is no going back. Please be certain.</p>
                            <button className="btn" style={{ background: 'rgba(255, 80, 80, 0.1)', color: '#FF5050', border: '1px solid rgba(255, 80, 80, 0.3)' }}>
                                Delete Account
                            </button>
                        </div>
                    </motion.div>
                )}
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
