import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiX, FiMapPin, FiBriefcase, FiDollarSign, FiClock,
    FiUpload, FiCheckCircle, FiAlertCircle, FiZap, FiStar,
    FiUsers, FiCalendar, FiLink, FiTag
} from 'react-icons/fi';
import { useResume } from '../../context/ResumeContext';
import './JobDetailModal.css';

const JobDetailModal = ({ job, onClose }) => {
    const { applyToJob } = useResume();
    const [resumeFile, setResumeFile] = useState(null);
    const [studentName, setStudentName] = useState('');
    const [dragging, setDragging] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [aiScore, setAiScore] = useState(null);
    const fileInputRef = useRef(null);

    if (!job) return null;

    const handleFile = (file) => {
        if (file && ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
            setResumeFile(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile || !studentName.trim()) return;
        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/jobs/${job.id}/apply`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setAiScore(data.applicant?.aiScore || 45);
                setSubmitted(true);
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert('Something went wrong submitting your application.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="jdm-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="jdm-container"
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="jdm-header">
                        <div className="jdm-company-row">
                            <div
                                className="jdm-logo"
                                style={{ background: job.color + '20', color: job.color, borderColor: job.color + '30' }}
                            >
                                {job.logo}
                            </div>
                            <div>
                                <h2 className="jdm-title">{job.title}</h2>
                                <div className="jdm-company-name">{job.company}</div>
                            </div>
                        </div>
                        <button className="jdm-close" onClick={onClose}><FiX size={20} /></button>
                    </div>

                    <div className="jdm-body">
                        {/* Left: Job Details */}
                        <div className="jdm-info">
                            {/* Meta pills */}
                            <div className="jdm-meta-grid">
                                <div className="jdm-meta-item">
                                    <FiBriefcase className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Job Type</div>
                                        <div className="jdm-meta-value">{job.type}</div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiMapPin className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Location</div>
                                        <div className="jdm-meta-value">
                                            {job.location}
                                            {job.remote && <span className="jdm-remote-badge">Remote</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiDollarSign className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Salary Range</div>
                                        <div className="jdm-meta-value">{job.salary}</div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiTag className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Industry</div>
                                        <div className="jdm-meta-value">{job.industry || 'General'}</div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiClock className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Experience</div>
                                        <div className="jdm-meta-value">{job.experience}</div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiUsers className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Applicants</div>
                                        <div className="jdm-meta-value">{job.applicants} applied</div>
                                    </div>
                                </div>
                                <div className="jdm-meta-item">
                                    <FiCalendar className="jdm-meta-icon" />
                                    <div>
                                        <div className="jdm-meta-label">Posted</div>
                                        <div className="jdm-meta-value">{job.posted}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="jdm-section">
                                <h4 className="jdm-section-title">Category</h4>
                                <div className="jdm-tags">
                                    {job.tags?.map(tag => (
                                        <span key={tag} className="tag tag-blue">{tag}</span>
                                    ))}
                                    {job.urgent && <span className="tag tag-red"><FiZap size={10} /> Urgent Hire</span>}
                                    {job.featured && <span className="tag tag-gold"><FiStar size={10} /> Featured</span>}
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="jdm-section">
                                <h4 className="jdm-section-title">Required Skills</h4>
                                <div className="jdm-skills">
                                    {job.skills?.map(skill => (
                                        <span key={skill} className="jdm-skill-chip">{skill}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="jdm-section">
                                <h4 className="jdm-section-title">Job Description</h4>
                                <p className="jdm-description">{job.description}</p>
                                <div className="jdm-desc-extra">
                                    <p>As a <strong>{job.title}</strong> at <strong>{job.company}</strong>, you will collaborate with cross-functional teams to deliver high-impact solutions. You will be expected to bring technical depth, strong communication skills, and a passion for excellence to everything you do.</p>
                                    <p>The role requires proficiency in <strong>{job.skills?.slice(0, 2).join(' and ')}</strong>, along with a desire to grow and adapt in a fast-paced environment. This is an excellent opportunity to work on products that scale to millions of users.</p>
                                </div>
                            </div>

                            {/* Department */}
                            <div className="jdm-section">
                                <h4 className="jdm-section-title">Department</h4>
                                <p className="jdm-text-muted">{job.department}</p>
                            </div>
                        </div>

                        {/* Right: Application Panel */}
                        <div className="jdm-apply-panel">
                            {!submitted ? (
                                <form className="jdm-apply-form" onSubmit={handleSubmit}>
                                    <div className="jdm-apply-header">
                                        <h3 className="jdm-apply-title">Apply Now</h3>
                                        <p className="jdm-apply-sub">Upload your resume to apply for this role</p>
                                    </div>

                                    {/* Name Input */}
                                    <div className="jdm-field">
                                        <label className="jdm-label">Your Full Name</label>
                                        <input
                                            className="jdm-input"
                                            type="text"
                                            placeholder="e.g. Vaishakh Bhat"
                                            value={studentName}
                                            onChange={e => setStudentName(e.target.value)}
                                            required
                                        />
                                    </div>

                                    {/* Resume Upload */}
                                    <div className="jdm-field">
                                        <label className="jdm-label">Resume <span className="jdm-required">*</span></label>
                                        <div
                                            className={`jdm-dropzone ${dragging ? 'jdm-dropzone--dragging' : ''} ${resumeFile ? 'jdm-dropzone--has-file' : ''}`}
                                            onDragOver={e => { e.preventDefault(); setDragging(true); }}
                                            onDragLeave={() => setDragging(false)}
                                            onDrop={handleDrop}
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                style={{ display: 'none' }}
                                                onChange={e => handleFile(e.target.files[0])}
                                            />
                                            {resumeFile ? (
                                                <div className="jdm-file-info">
                                                    <FiCheckCircle size={24} className="jdm-file-icon-ok" />
                                                    <div>
                                                        <div className="jdm-file-name">{resumeFile.name}</div>
                                                        <div className="jdm-file-size">{(resumeFile.size / 1024).toFixed(1)} KB — click to change</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="jdm-dropzone-empty">
                                                    <FiUpload size={28} className="jdm-upload-icon" />
                                                    <div className="jdm-drop-text">Drag & drop or <span className="jdm-browse-link">browse</span></div>
                                                    <div className="jdm-drop-hint">PDF, DOC, DOCX supported</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Warning if incomplete */}
                                    {(!resumeFile || !studentName.trim()) && (
                                        <div className="jdm-warning">
                                            <FiAlertCircle size={14} />
                                            <span>Please fill in your name and upload a resume to submit.</span>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="jdm-submit-btn"
                                        disabled={!resumeFile || !studentName.trim() || submitting}
                                    >
                                        {submitting ? (
                                            <span className="jdm-spinner" />
                                        ) : (
                                            <>{/* Apply button: yellow bg, black text */}
                                                <FiLink size={14} /> Submit Application
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                /* Success State */
                                <motion.div
                                    className="jdm-success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="jdm-success-icon">🎉</div>
                                    <h3 className="jdm-success-title">Application Submitted!</h3>
                                    <p className="jdm-success-sub">
                                        Your resume has been sent to <strong>{job.company}</strong> for the <strong>{job.title}</strong> role.
                                    </p>

                                    {/* AI Score */}
                                    <div className="jdm-score-card">
                                        <div className="jdm-score-label">AI Match Score</div>
                                        <div className="jdm-score-value">{aiScore}%</div>
                                        <div className="jdm-score-bar-track">
                                            <motion.div
                                                className="jdm-score-bar-fill"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${aiScore}%` }}
                                                transition={{ duration: 0.8, delay: 0.2 }}
                                            />
                                        </div>
                                        <div className="jdm-score-hint">
                                            {aiScore >= 80 ? '🔥 Excellent match! You are a top candidate.' :
                                                aiScore >= 65 ? '✅ Good match. Strong profile.' :
                                                    '💪 Fair match. Consider adding more relevant skills.'}
                                        </div>
                                    </div>

                                    <button className="jdm-close-success" onClick={onClose}>
                                        Back to Jobs
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default JobDetailModal;
