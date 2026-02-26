import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import {
    FiBriefcase, FiUsers, FiMessageCircle, FiPlusCircle, FiTrendingUp,
    FiFileText, FiEye, FiDownload, FiX, FiAward, FiCheckSquare, FiCheckCircle
} from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import PostJobModal from '../components/dashboard/PostJobModal';
import { useResume } from '../context/ResumeContext';
import './Dashboard.css';
import './RecruiterDashboard.css';

// Static dummy removed in favor of API

const ScoreBadge = ({ score }) => {
    const color = score >= 80 ? '#48C78E' : score >= 65 ? '#FFD700' : '#FF5050';
    return (
        <div className="rd-score-badge" style={{ color, borderColor: color + '40', background: color + '12' }}>
            <FiAward size={11} /> {score}%
        </div>
    );
};

const RecruiterDashboard = () => {
    const { getSortedApplications, applications } = useResume();
    const [viewingResume, setViewingResume] = useState(null);
    const [selectedJob, setSelectedJob] = useState('all');
    const [showPostModal, setShowPostModal] = useState(false);
    const [newJobs, setNewJobs] = useState([]);
    const [toast, setToast] = useState(null);
    const [fetchedJobs, setFetchedJobs] = useState([]);

    const location = useLocation();
    const [currentView, setCurrentView] = useState('overview');
    const [user, setUser] = useState(null);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setEditName(parsed.name || '');
            setEditEmail(parsed.email || '');
        }
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
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
                setToast('Profile updated successfully!');
                setTimeout(() => setToast(null), 3000);
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong.');
        }
    };

    React.useEffect(() => {
        const fetchJobs = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch('http://localhost:5000/api/jobs/recruiter', { headers });
                if (res.ok) {
                    const data = await res.json();
                    setFetchedJobs(data);
                } else {
                    console.error("Failed to fetch jobs");
                }
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        // Handle view changes and hash actions
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];

        if (lastPart === 'settings') {
            setCurrentView('settings');
        } else {
            setCurrentView('overview');
            // Check hash on overview
            if (location.hash === '#post-job') {
                setShowPostModal(true);
                // Clear hash without reloading
                window.history.replaceState('', document.title, window.location.pathname);
            } else if (location.hash === '#applicants') {
                setTimeout(() => {
                    const el = document.getElementById('applicant-list');
                    if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 100;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }, 100);
                window.history.replaceState('', document.title, window.location.pathname);
            }
        }
    }, [location]);

    const handlePostJob = async (job) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: job.title,
                    companyName: job.company,
                    industry: job.industry,
                    location: job.location,
                    type: job.type,
                    salary: job.salary,
                    description: job.description,
                    requirements: job.skills
                })
            });

            if (res.ok) {
                setNewJobs(prev => [job, ...prev]);
                console.log('[RecruiterDashboard] New job posted:', job);
                setToast(`"${job.title}" posted successfully!`);
                setTimeout(() => setToast(null), 3500);
            } else {
                const errorData = await res.json();
                alert(`Failed to post job: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert('Something went wrong while posting the job.');
        }
    };

    // Process fetched jobs to applications array
    let apiApplications = [];
    fetchedJobs.forEach(job => {
        if (job.applicants) {
            job.applicants.forEach((app, idx) => {
                apiApplications.push({
                    studentId: app.student?._id,
                    jobId: job._id,
                    status: app.status,
                    studentName: app.student?.name || 'Applicant',
                    studentEmail: app.student?.email || '',
                    job: { title: job.title, company: job.companyName || 'You', color: '#4285F4', skills: job.requirements },
                    aiScore: app.aiScore || 45,
                    appliedAt: new Date(app.appliedAt).toLocaleDateString(),
                    resumeFileName: app.student?.name ? `${app.student.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Candidate_Resume.pdf',
                    resumeUrl: app.student?.resumeUrl ? `http://localhost:5000${app.student.resumeUrl.startsWith('/') ? '' : '/'}${app.student.resumeUrl}` : null,
                });
            });
        }
    });

    const filteredApps = selectedJob === 'all'
        ? apiApplications
        : apiApplications.filter(a => a.job.title === selectedJob);

    let totalApplicantsCount = 0;
    fetchedJobs.forEach(j => {
        if (j.applicants) totalApplicantsCount += j.applicants.length;
    });

    const stats = [
        { icon: <FiBriefcase />, label: 'Active Jobs', value: fetchedJobs.length + newJobs.length, color: '#FFD700' },
        { icon: <FiUsers />, label: 'Total Applicants', value: totalApplicantsCount, color: '#457EFF' }
    ];

    const displayApps = filteredApps.length > 0 ? filteredApps : (selectedJob === 'all' ? apiApplications : []);

    // Sort array descending correctly
    displayApps.sort((a, b) => b.aiScore - a.aiScore);

    const handleDeleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setFetchedJobs(prev => prev.filter(j => j._id !== id));
                setToast('Job deleted successfully');
                setTimeout(() => setToast(null), 3000);
            } else {
                const data = await res.json();
                alert(`Failed to delete job: ${data.message || 'Server error'}`);
                console.error("Delete failed", data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateStatus = async (app, status) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/jobs/${app.jobId}/applicants/${app.studentId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setToast(`Applicant ${status.toLowerCase()} and email sent!`);
                setViewingResume({ ...app, status });
                setFetchedJobs(prev => prev.map(job => {
                    if (job._id === app.jobId) {
                        return {
                            ...job,
                            applicants: job.applicants.map(a =>
                                a.student?._id === app.studentId ? { ...a, status } : a
                            )
                        };
                    }
                    return job;
                }));
                setTimeout(() => setToast(null), 3500);
            } else {
                alert(`Failed to ${status.toLowerCase()} applicant`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="recruiter" />
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    {currentView === 'overview' ? (
                        <>
                            <div>
                                <h1 className="dashboard-title">Recruiter <span className="text-gold">Hub</span></h1>
                                <p className="dashboard-subtitle">Manage your job posts and find top talent.</p>
                            </div>
                            <button className="btn btn-gold btn-sm" onClick={() => setShowPostModal(true)}>
                                <FiPlusCircle size={14} /> Post New Job
                            </button>
                        </>
                    ) : (
                        <div>
                            <h1 className="dashboard-title">Account <span className="text-gold">Settings</span></h1>
                            <p className="dashboard-subtitle">Manage your recruiter profile and preferences.</p>
                        </div>
                    )}
                </div>

                {currentView === 'overview' && (
                    <>
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
                                <h3 className="dash-panel-title">
                                    Job Postings
                                    {newJobs.length > 0 && (
                                        <span className="rd-total-badge" style={{ marginLeft: 8 }}>+{newJobs.length} new</span>
                                    )}
                                </h3>
                                <div className="job-rows">
                                    {/* Newly posted jobs appear at top */}
                                    {newJobs.map((job, i) => (
                                        <div key={`new-${i}`} className="job-row rd-new-job-row">
                                            <div className="job-row-info">
                                                <div className="job-row-title">{job.title}</div>
                                                <div className="job-row-meta">{job.company} · {job.type} · Just now</div>
                                            </div>
                                            <span className="job-row-status status-active">Active</span>
                                        </div>
                                    ))}
                                    {fetchedJobs.map((job, i) => (
                                        <div key={i} className="job-row">
                                            <div className="job-row-info">
                                                <div className="job-row-title">{job.title}</div>
                                                <div className="job-row-meta">{job.applicants ? job.applicants.length : 0} applicants · {new Date(job.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <span className={`job-row-status status-active`}>
                                                    Active
                                                </span>
                                                <button className="btn btn-ghost btn-sm" style={{ color: '#FF5050', padding: '4px 8px' }} onClick={() => handleDeleteJob(job._id)}>
                                                    <FiX />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* AI Resume Analytics Panel */}
                            <motion.div className="dash-panel glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <h3 className="dash-panel-title">
                                    <FiAward size={15} style={{ color: '#FFD700' }} /> AI Match Overview
                                </h3>
                                <div className="rd-ai-bars">
                                    {['90-100%', '70-89%', '50-69%', 'Below 50%'].map((range, i) => {
                                        const counts = [
                                            displayApps.filter(a => a.aiScore >= 90).length,
                                            displayApps.filter(a => a.aiScore >= 70 && a.aiScore < 90).length,
                                            displayApps.filter(a => a.aiScore >= 50 && a.aiScore < 70).length,
                                            displayApps.filter(a => a.aiScore < 50).length,
                                        ];
                                        const colors = ['#48C78E', '#FFD700', '#F5A623', '#FF5050'];
                                        const pct = displayApps.length ? Math.round((counts[i] / displayApps.length) * 100) : 0;
                                        return (
                                            <div key={range} className="rd-ai-bar-row">
                                                <div className="rd-ai-bar-label">
                                                    <span>{range}</span>
                                                    <span style={{ color: colors[i] }}>{counts[i]} candidates</span>
                                                </div>
                                                <div className="rd-ai-bar-track">
                                                    <motion.div
                                                        className="rd-ai-bar-fill"
                                                        style={{ background: colors[i] }}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${pct || 0}%` }}
                                                        transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </div>

                        {/* === Resume List — Full Width === */}
                        <motion.div
                            id="applicant-list"
                            className="dash-panel glass-card rd-resume-panel"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="rd-resume-header">
                                <h3 className="dash-panel-title" style={{ marginBottom: 0 }}>
                                    <FiFileText size={15} style={{ color: '#FFD700' }} /> Applicant Resumes
                                    <span className="rd-total-badge">{displayApps.length} total</span>
                                </h3>
                                <div className="rd-filter-row">
                                    <span className="rd-ai-note">
                                        <FiCheckSquare size={12} /> Sorted by AI Match Score (highest first)
                                    </span>
                                    <select
                                        className="rd-job-select"
                                        value={selectedJob}
                                        onChange={e => setSelectedJob(e.target.value)}
                                    >
                                        <option value="all">All Jobs</option>
                                        {fetchedJobs.map(j => (
                                            <option key={j._id} value={j.title}>{j.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="rd-resume-list">
                                {/* Column Headers */}
                                <div className="rd-resume-col-header">
                                    <span>Candidate</span>
                                    <span>Applied For</span>
                                    <span>Date</span>
                                    <span>AI Score</span>
                                    <span>Resume</span>
                                </div>

                                {displayApps.map((app, i) => (
                                    <motion.div
                                        key={i}
                                        className="rd-resume-row"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.05 * i }}
                                    >
                                        {/* Rank */}
                                        <div className="rd-rank">
                                            <span className={`rd-rank-num ${i === 0 ? 'rd-rank-gold' : i === 1 ? 'rd-rank-silver' : i === 2 ? 'rd-rank-bronze' : ''}`}>
                                                #{i + 1}
                                            </span>
                                            <div>
                                                <div className="rd-applicant-name">{app.studentName}</div>
                                                <div className="rd-applicant-role" style={{ color: app.job.color }}>{app.job.company || 'Applicant'}</div>
                                            </div>
                                        </div>

                                        {/* Job */}
                                        <div className="rd-applied-job">{app.job.title}</div>

                                        {/* Date */}
                                        <div className="rd-apply-date">{app.appliedAt}</div>

                                        {/* AI Score */}
                                        <div>
                                            <ScoreBadge score={app.aiScore} />
                                            <div className="rd-score-bar-mini" style={{ marginTop: 5 }}>
                                                <div
                                                    className="rd-score-bar-mini-fill"
                                                    style={{
                                                        width: `${app.aiScore}%`,
                                                        background: app.aiScore >= 80 ? '#48C78E' : app.aiScore >= 65 ? '#FFD700' : '#FF5050'
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="rd-actions">
                                            <button
                                                className="rd-view-btn"
                                                onClick={() => setViewingResume(app)}
                                                title="View Resume Details"
                                            >
                                                <FiEye size={13} /> View
                                            </button>
                                            {app.resumeUrl && (
                                                <a
                                                    href={app.resumeUrl}
                                                    download={app.resumeFileName}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="rd-download-btn"
                                                    title="Download Resume"
                                                >
                                                    <FiDownload size={13} />
                                                </a>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {displayApps.length === 0 && (
                                    <div className="rd-empty">
                                        <FiFileText size={32} />
                                        <p>No applications yet. Resumes submitted via job cards will appear here.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}

                {currentView === 'settings' && (
                    <motion.div className="dash-panel glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
                        <div className="settings-section" style={{ marginBottom: 30 }}>
                            <h3 style={{ marginBottom: 16, color: 'var(--text-primary)' }}>Account Information</h3>
                            <form onSubmit={handleUpdateProfile}>
                                <div className="form-group" style={{ marginBottom: 16 }}>
                                    <label className="form-label">Company / Recruiter Name</label>
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

            {/* Resume Detail Viewer */}
            <AnimatePresence>
                {viewingResume && (
                    <motion.div
                        className="rd-viewer-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setViewingResume(null)}
                    >
                        <motion.div
                            className="rd-viewer-modal"
                            initial={{ opacity: 0, y: 30, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.96 }}
                            transition={{ duration: 0.3 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <button className="rd-viewer-close" onClick={() => setViewingResume(null)}>
                                <FiX size={18} />
                            </button>

                            <div className="rd-viewer-header">
                                <div>
                                    <h2 className="rd-viewer-name">{viewingResume.studentName}</h2>
                                    <p className="rd-viewer-sub">Applied for <strong>{viewingResume.job.title}</strong></p>
                                </div>
                                <ScoreBadge score={viewingResume.aiScore} />
                            </div>

                            <div className="rd-viewer-meta">
                                <div className="rd-viewer-meta-item">
                                    <span className="rd-viewer-meta-label">AI Match Score</span>
                                    <div className="rd-viewer-score-bar">
                                        <div className="rd-viewer-score-fill" style={{
                                            width: `${viewingResume.aiScore}%`,
                                            background: viewingResume.aiScore >= 80 ? '#48C78E' : viewingResume.aiScore >= 65 ? '#FFD700' : '#FF5050'
                                        }} />
                                    </div>
                                    <span className="rd-viewer-score-txt" style={{
                                        color: viewingResume.aiScore >= 80 ? '#48C78E' : viewingResume.aiScore >= 65 ? '#FFD700' : '#FF5050'
                                    }}>
                                        {viewingResume.aiScore}% — {viewingResume.aiScore >= 80 ? 'Excellent Match 🔥' : viewingResume.aiScore >= 65 ? 'Good Match ✅' : 'Fair Match 💪'}
                                    </span>
                                </div>

                                <div className="rd-viewer-meta-item">
                                    <span className="rd-viewer-meta-label">Applied On</span>
                                    <span className="rd-viewer-meta-val">{viewingResume.appliedAt}</span>
                                </div>

                                <div className="rd-viewer-meta-item">
                                    <span className="rd-viewer-meta-label">Resume File</span>
                                    <span className="rd-viewer-meta-val">
                                        <FiFileText size={13} /> {viewingResume.resumeFileName || 'resume.pdf'}
                                    </span>
                                </div>

                                <div className="rd-viewer-skills">
                                    <span className="rd-viewer-meta-label">Job Required Skills</span>
                                    <div className="rd-viewer-skill-chips">
                                        {(viewingResume.job.skills || ['React', 'Node.js', 'TypeScript', 'CSS']).map(s => (
                                            <span key={s} className="jdm-skill-chip">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rd-viewer-actions" style={{ justifyContent: 'space-between', width: '100%', marginTop: 'auto', paddingTop: 20 }}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {viewingResume.resumeUrl ? (
                                        <a
                                            href={viewingResume.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-gold btn-sm"
                                        >
                                            <FiEye size={13} /> Open Resume
                                        </a>
                                    ) : (
                                        <div className="rd-no-file">
                                            <FiFileText size={14} /> Candidate hasn't uploaded a resume yet.
                                        </div>
                                    )}
                                    {viewingResume.resumeUrl && (
                                        <a
                                            href={viewingResume.resumeUrl}
                                            download={viewingResume.resumeFileName || 'Resume'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-outline-gold btn-sm"
                                        >
                                            <FiDownload size={13} /> Download
                                        </a>
                                    )}
                                </div>
                                {viewingResume.status !== 'Shortlisted for in-person interview' && viewingResume.status !== 'Rejected' ? (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: '#48C78E', color: '#fff', fontWeight: 600, border: 'none', padding: '8px 16px' }}
                                            onClick={() => handleUpdateStatus(viewingResume, 'Shortlisted for in-person interview')}
                                        >
                                            <FiCheckSquare size={14} style={{ marginRight: 6 }} /> Accept
                                        </button>
                                        <button
                                            className="btn btn-sm"
                                            style={{ background: 'transparent', color: '#FF5050', border: '1px solid #FF5050', fontWeight: 600, padding: '8px 16px' }}
                                            onClick={() => handleUpdateStatus(viewingResume, 'Rejected')}
                                        >
                                            <FiX size={14} style={{ marginRight: 6 }} /> Reject
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ color: viewingResume.status === 'Shortlisted for in-person interview' ? '#48C78E' : '#FF5050', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.9rem', fontWeight: 600 }}>
                                        {viewingResume.status === 'Shortlisted for in-person interview' ? <FiCheckCircle size={16} /> : <FiX size={16} />} {viewingResume.status} & Emailed
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Job Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <PostJobModal
                        onClose={() => setShowPostModal(false)}
                        onSubmit={handlePostJob}
                    />
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className="rd-toast"
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    >
                        <FiCheckCircle size={18} />
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecruiterDashboard;
