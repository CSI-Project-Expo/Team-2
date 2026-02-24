import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiTag, FiAlignLeft, FiCheckCircle } from 'react-icons/fi';
import './PostJobModal.css';

const CATEGORIES = ['Tech', 'Design', 'Marketing', 'Finance', 'HR', 'Sales', 'Operations', 'Data Science', 'Fintech', 'FMCG'];
const SKILL_SUGGESTIONS = ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'SQL', 'Figma', 'AWS', 'Docker', 'TensorFlow', 'Go', 'Kafka', 'Redis', 'MongoDB'];

const EMPTY_FORM = {
    title: '',
    company: '',
    type: 'Full-time',
    location: '',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    experience: '',
    description: '',
    categories: [],
    skills: [],
};

const PostJobModal = ({ onClose, onSubmit }) => {
    const [form, setForm] = useState(EMPTY_FORM);
    const [skillInput, setSkillInput] = useState('');
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const overlayRef = useRef(null);

    /* ── Helpers ── */
    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
    };

    const toggleCategory = (cat) => {
        setForm(f => ({
            ...f,
            categories: f.categories.includes(cat)
                ? f.categories.filter(c => c !== cat)
                : [...f.categories, cat],
        }));
    };

    const addSkill = (skill) => {
        const s = skill.trim();
        if (!s || form.skills.includes(s)) return;
        setForm(f => ({ ...f, skills: [...f.skills, s] }));
        setSkillInput('');
    };

    const removeSkill = (skill) => {
        setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }));
    };

    const handleSkillKey = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addSkill(skillInput);
        }
    };

    /* ── Validation ── */
    const validate = () => {
        const e = {};
        if (!form.title.trim()) e.title = 'Job title is required';
        if (!form.company.trim()) e.company = 'Company name is required';
        if (!form.location.trim()) e.location = 'Location is required';
        if (!form.salaryMin) e.salaryMin = 'Enter min salary';
        if (!form.salaryMax) e.salaryMax = 'Enter max salary';
        if (!form.experience.trim()) e.experience = 'Experience required';
        if (!form.description.trim()) e.description = 'Description is required';
        if (form.skills.length === 0) e.skills = 'Add at least one skill';
        return e;
    };

    const isIncomplete = () => {
        return (
            !form.title.trim() || !form.company.trim() || !form.location.trim() ||
            !form.salaryMin || !form.salaryMax || !form.experience.trim() ||
            !form.description.trim() || form.skills.length === 0
        );
    };

    /* ── Submit ── */
    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }
        const job = {
            id: Date.now(),
            title: form.title.trim(),
            company: form.company.trim(),
            type: form.type,
            location: form.location.trim(),
            remote: form.remote,
            salary: `₹${form.salaryMin}L - ₹${form.salaryMax}L`,
            experience: form.experience.trim(),
            skills: form.skills,
            tags: form.categories,
            description: form.description.trim(),
            applicants: 0,
            posted: 'Just now',
            status: 'Active',
            logo: form.company.trim()[0].toUpperCase(),
            color: '#FFD700',
            urgent: false,
            featured: false,
        };
        console.log('[PostJobModal] New Job Posted:', job);
        onSubmit?.(job);
        setSubmitted(true);
        setTimeout(() => {
            onClose();
        }, 1600);
    };

    /* ── Overlay click close ── */
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (submitted) {
        return (
            <motion.div className="pjm-overlay" ref={overlayRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div
                    className="pjm-success-container glass-card"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="pjm-success-icon">🎉</div>
                    <h3 className="pjm-success-title">Job Posted!</h3>
                    <p className="pjm-success-sub">
                        <strong>{form.title}</strong> at <strong>{form.company}</strong> has been created and is now active.
                    </p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="pjm-overlay"
            ref={overlayRef}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="pjm-modal glass-card"
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                onClick={e => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Post New Job"
            >
                {/* ── Header ── */}
                <div className="pjm-header">
                    <div>
                        <h2 className="pjm-title">Post a New Job</h2>
                        <p className="pjm-subtitle">Fill in the details to publish a new listing.</p>
                    </div>
                    <button className="pjm-close-btn" onClick={onClose} aria-label="Close"><FiX size={20} /></button>
                </div>

                {/* ── Scrollable Form Body ── */}
                <form className="pjm-form" onSubmit={handleSubmit} noValidate>
                    <div className="pjm-body">

                        {/* Row 1: Job Title + Company */}
                        <div className="pjm-row-2">
                            <div className="pjm-field">
                                <label className="pjm-label"><FiBriefcase size={13} /> Job Title <span className="pjm-req">*</span></label>
                                <input
                                    className={`pjm-input ${errors.title ? 'pjm-input--error' : ''}`}
                                    type="text"
                                    placeholder="e.g. Senior Frontend Engineer"
                                    value={form.title}
                                    onChange={e => set('title', e.target.value)}
                                />
                                {errors.title && <span className="pjm-error-msg">{errors.title}</span>}
                            </div>
                            <div className="pjm-field">
                                <label className="pjm-label">Company Name <span className="pjm-req">*</span></label>
                                <input
                                    className={`pjm-input ${errors.company ? 'pjm-input--error' : ''}`}
                                    type="text"
                                    placeholder="e.g. Google"
                                    value={form.company}
                                    onChange={e => set('company', e.target.value)}
                                />
                                {errors.company && <span className="pjm-error-msg">{errors.company}</span>}
                            </div>
                        </div>

                        {/* Row 2: Job Type + Location */}
                        <div className="pjm-row-2">
                            <div className="pjm-field">
                                <label className="pjm-label">Job Type <span className="pjm-req">*</span></label>
                                <select
                                    className="pjm-select"
                                    value={form.type}
                                    onChange={e => set('type', e.target.value)}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Contract">Contract</option>
                                </select>
                            </div>
                            <div className="pjm-field">
                                <label className="pjm-label"><FiMapPin size={13} /> Location <span className="pjm-req">*</span></label>
                                <div className="pjm-location-row">
                                    <input
                                        className={`pjm-input ${errors.location ? 'pjm-input--error' : ''}`}
                                        type="text"
                                        placeholder="e.g. Bangalore"
                                        value={form.location}
                                        onChange={e => set('location', e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <label className="pjm-toggle-label" title="Remote available">
                                        <input
                                            type="checkbox"
                                            checked={form.remote}
                                            onChange={e => set('remote', e.target.checked)}
                                            className="pjm-toggle-input"
                                        />
                                        <span className={`pjm-toggle-track ${form.remote ? 'pjm-toggle-track--on' : ''}`}>
                                            <span className="pjm-toggle-thumb" />
                                        </span>
                                        <span className="pjm-toggle-text">Remote</span>
                                    </label>
                                </div>
                                {errors.location && <span className="pjm-error-msg">{errors.location}</span>}
                            </div>
                        </div>

                        {/* Row 3: Salary Min + Salary Max + Experience */}
                        <div className="pjm-row-3">
                            <div className="pjm-field">
                                <label className="pjm-label"><FiDollarSign size={13} /> Salary Min (LPA) <span className="pjm-req">*</span></label>
                                <input
                                    className={`pjm-input ${errors.salaryMin ? 'pjm-input--error' : ''}`}
                                    type="number"
                                    placeholder="e.g. 12"
                                    min="0"
                                    value={form.salaryMin}
                                    onChange={e => set('salaryMin', e.target.value)}
                                />
                                {errors.salaryMin && <span className="pjm-error-msg">{errors.salaryMin}</span>}
                            </div>
                            <div className="pjm-field">
                                <label className="pjm-label">Salary Max (LPA) <span className="pjm-req">*</span></label>
                                <input
                                    className={`pjm-input ${errors.salaryMax ? 'pjm-input--error' : ''}`}
                                    type="number"
                                    placeholder="e.g. 24"
                                    min="0"
                                    value={form.salaryMax}
                                    onChange={e => set('salaryMax', e.target.value)}
                                />
                                {errors.salaryMax && <span className="pjm-error-msg">{errors.salaryMax}</span>}
                            </div>
                            <div className="pjm-field">
                                <label className="pjm-label"><FiClock size={13} /> Experience <span className="pjm-req">*</span></label>
                                <input
                                    className={`pjm-input ${errors.experience ? 'pjm-input--error' : ''}`}
                                    type="text"
                                    placeholder="e.g. 2-4 years"
                                    value={form.experience}
                                    onChange={e => set('experience', e.target.value)}
                                />
                                {errors.experience && <span className="pjm-error-msg">{errors.experience}</span>}
                            </div>
                        </div>

                        {/* Categories: multi-select chip system */}
                        <div className="pjm-field">
                            <label className="pjm-label"><FiTag size={13} /> Category</label>
                            <div className="pjm-chip-grid">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        type="button"
                                        className={`pjm-chip ${form.categories.includes(cat) ? 'pjm-chip--active' : ''}`}
                                        onClick={() => toggleCategory(cat)}
                                    >
                                        {form.categories.includes(cat) && <FiCheckCircle size={11} />}
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Required Skills: multi-input chip system */}
                        <div className="pjm-field">
                            <label className="pjm-label">Required Skills <span className="pjm-req">*</span></label>
                            <div className={`pjm-skills-input-box ${errors.skills ? 'pjm-input--error' : ''}`}>
                                {form.skills.map(skill => (
                                    <span key={skill} className="pjm-skill-tag">
                                        {skill}
                                        <button type="button" className="pjm-skill-remove" onClick={() => removeSkill(skill)}>
                                            <FiX size={10} />
                                        </button>
                                    </span>
                                ))}
                                <input
                                    className="pjm-skill-input-inline"
                                    type="text"
                                    placeholder={form.skills.length === 0 ? 'Type skill + Enter (e.g. React, Python)' : 'Add more...'}
                                    value={skillInput}
                                    onChange={e => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKey}
                                    onBlur={() => addSkill(skillInput)}
                                />
                            </div>
                            {/* Suggestion chips */}
                            <div className="pjm-skill-suggestions">
                                {SKILL_SUGGESTIONS.filter(s => !form.skills.includes(s)).slice(0, 8).map(s => (
                                    <button
                                        key={s}
                                        type="button"
                                        className="pjm-suggestion-chip"
                                        onClick={() => addSkill(s)}
                                    >
                                        <FiPlus size={9} /> {s}
                                    </button>
                                ))}
                            </div>
                            {errors.skills && <span className="pjm-error-msg">{errors.skills}</span>}
                        </div>

                        {/* Job Description */}
                        <div className="pjm-field pjm-field--full">
                            <label className="pjm-label"><FiAlignLeft size={13} /> Job Description <span className="pjm-req">*</span></label>
                            <textarea
                                className={`pjm-textarea ${errors.description ? 'pjm-input--error' : ''}`}
                                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                                value={form.description}
                                onChange={e => set('description', e.target.value)}
                                rows={5}
                            />
                            {errors.description && <span className="pjm-error-msg">{errors.description}</span>}
                        </div>

                        {/* Inline validation notice */}
                        {Object.keys(errors).length > 0 && (
                            <div className="pjm-global-error">
                                ⚠️ Please fill in all required fields before submitting.
                            </div>
                        )}
                    </div>

                    {/* ── Footer ── */}
                    <div className="pjm-footer">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="pjm-submit-btn"
                            disabled={isIncomplete()}
                        >
                            <FiBriefcase size={14} />
                            Post Job
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default PostJobModal;
