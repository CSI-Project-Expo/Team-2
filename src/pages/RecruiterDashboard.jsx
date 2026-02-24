import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiBriefcase, FiUsers, FiMessageCircle, FiPlusCircle, FiTrendingUp,
    FiFileText, FiEye, FiDownload, FiX, FiAward, FiCheckSquare, FiCheckCircle
} from 'react-icons/fi';
import DashboardSidebar from '../components/dashboard/DashboardSidebar';
import PostJobModal from '../components/dashboard/PostJobModal';
import { useResume } from '../context/ResumeContext';
import './Dashboard.css';
import './RecruiterDashboard.css';

const jobPostings = [
    { title: 'Senior Frontend Engineer', applicants: 89, status: 'Active', posted: '2d ago', requiredSkills: ['React', 'TypeScript', 'CSS', 'Redux'] },
    { title: 'Backend Developer', applicants: 64, status: 'Active', posted: '5d ago', requiredSkills: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL'] },
    { title: 'Product Designer', applicants: 52, status: 'Paused', posted: '1w ago', requiredSkills: ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'] },
    { title: 'Data Analyst', applicants: 42, status: 'Active', posted: '1w ago', requiredSkills: ['Python', 'SQL', 'TensorFlow', 'ML'] },
];

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

    const handlePostJob = (job) => {
        setNewJobs(prev => [job, ...prev]);
        console.log('[RecruiterDashboard] New job posted:', job);
        setToast(`"${job.title}" posted successfully!`);
        setTimeout(() => setToast(null), 3500);
        // modal closes itself after success screen
    };

    const sortedApps = getSortedApplications();

    const filteredApps = selectedJob === 'all'
        ? sortedApps
        : sortedApps.filter(a => a.job.title === selectedJob);

    const stats = [
        { icon: <FiBriefcase />, label: 'Active Jobs', value: 5 + newJobs.length, color: '#FFD700' },
        { icon: <FiUsers />, label: 'Total Applicants', value: applications.length || 247, color: '#457EFF' },
        { icon: <FiMessageCircle />, label: 'Active Chats', value: 12, color: '#48C78E' },
        { icon: <FiTrendingUp />, label: 'Views This Week', value: 1843, color: '#AC6CFF' },
    ];

    // Static fallback applicants for demo when no context data
    const staticApplicants = [
        { studentName: 'Priya S.', job: { title: 'Senior Frontend Eng', company: 'You', color: '#4285F4' }, aiScore: 91, appliedAt: '20 Feb', resumeFileName: 'priya_resume.pdf', resumeUrl: null },
        { studentName: 'Rahul M.', job: { title: 'Backend Developer', company: 'You', color: '#3395FF' }, aiScore: 78, appliedAt: '19 Feb', resumeFileName: 'rahul_cv.pdf', resumeUrl: null },
        { studentName: 'Ananya P.', job: { title: 'Product Designer', company: 'You', color: '#FF7262' }, aiScore: 85, appliedAt: '18 Feb', resumeFileName: 'ananya_portfolio.pdf', resumeUrl: null },
        { studentName: 'Karthik V.', job: { title: 'Data Analyst', company: 'You', color: '#48C78E' }, aiScore: 62, appliedAt: '17 Feb', resumeFileName: 'karthik_resume.docx', resumeUrl: null },
        { studentName: 'Divya R.', job: { title: 'Senior Frontend Eng', company: 'You', color: '#AC6CFF' }, aiScore: 70, appliedAt: '16 Feb', resumeFileName: 'divya_cv.pdf', resumeUrl: null },
    ].sort((a, b) => b.aiScore - a.aiScore);

    const displayApps = filteredApps.length > 0 ? filteredApps : staticApplicants;

    return (
        <div className="dashboard-layout">
            <DashboardSidebar role="recruiter" />
            <main className="dashboard-main">
                {/* Header */}
                <div className="dashboard-header">
                    <div>
                        <h1 className="dashboard-title">Recruiter <span className="text-gold">Hub</span></h1>
                        <p className="dashboard-subtitle">Manage your job posts and find top talent.</p>
                    </div>
                    <button className="btn btn-gold btn-sm" onClick={() => setShowPostModal(true)}>
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
                                {jobPostings.map(j => (
                                    <option key={j.title} value={j.title}>{j.title}</option>
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

                            <div className="rd-viewer-actions">
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
                                        <FiFileText size={14} /> Resume preview not available for demo data.
                                    </div>
                                )}
                                {viewingResume.resumeUrl && (
                                    <a
                                        href={viewingResume.resumeUrl}
                                        download={viewingResume.resumeFileName}
                                        className="btn btn-outline-gold btn-sm"
                                    >
                                        <FiDownload size={13} /> Download
                                    </a>
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
