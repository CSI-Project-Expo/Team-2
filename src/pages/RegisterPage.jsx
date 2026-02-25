import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiArrowLeft, FiArrowRight, FiCheck } from 'react-icons/fi';
import './AuthPages.css';

const studentFields = [
    { key: 'name', label: 'Full Name', icon: <FiUser />, type: 'text', placeholder: 'Rahul Sharma' },
    { key: 'phone', label: 'Phone Number', icon: <FiPhone />, type: 'tel', placeholder: '+91 98765 43210' },
    { key: 'email', label: 'Personal Email', icon: <FiMail />, type: 'email', placeholder: 'rahul@gmail.com' },
    { key: 'collegeEmail', label: 'College Email', icon: <FiMail />, type: 'email', placeholder: 'rahul@iit.ac.in', hint: 'Used for verification & priority ranking' },
    { key: 'password', label: 'Password', icon: <FiLock />, type: 'password', placeholder: 'Min 8 characters' },
];

const recruiterFields = [
    { key: 'name', label: 'Full Name', icon: <FiUser />, type: 'text', placeholder: 'Priya Mehta' },
    { key: 'company', label: 'Company Name', icon: <FiBriefcase />, type: 'text', placeholder: 'Razorpay' },
    { key: 'companyEmail', label: 'Company Email', icon: <FiMail />, type: 'email', placeholder: 'priya@razorpay.com', hint: 'No personal emails (Gmail, Yahoo) allowed' },
    { key: 'password', label: 'Password', icon: <FiLock />, type: 'password', placeholder: 'Min 8 characters' },
];

const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1=role, 2=form
    const [role, setRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fields = role === 'student' ? studentFields : recruiterFields;

    const validateField = (key, value) => {
        if (key === 'companyEmail') {
            const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
            const domain = value.split('@')[1];
            if (blockedDomains.includes(domain)) {
                return 'Personal emails not allowed. Use your company email.';
            }
        }
        if (key === 'collegeEmail') {
            if (!value.includes('.edu') && !value.includes('.ac.in') && !value.includes('.edu.in')) {
                return 'Please use a valid college email (.ac.in or .edu)';
            }
        }
        if (key === 'password' && value.length < 8) return 'Password must be at least 8 characters';
        return '';
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        const err = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: err }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userInfo', JSON.stringify(data));
                localStorage.setItem('token', data.token);
                if (data.role === 'recruiter') {
                    navigate('/dashboard/recruiter');
                } else {
                    navigate('/dashboard/student');
                }
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error', error);
            alert('Something went wrong. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Left Panel */}
            <div className="auth-left">
                <div className="auth-left__blob auth-left__blob--1" />
                <div className="auth-left__blob auth-left__blob--2" />
                <div className="auth-left__grid" />
                <div className="auth-left__content">
                    <Link to="/" className="auth-logo">
                        <span className="text-gold">HIRE</span>SPHERE
                    </Link>
                    <div className="auth-left__shape">
                        <div className="shape-ring shape-ring--1" />
                        <div className="shape-ring shape-ring--2" />
                        <div className="shape-ring shape-ring--3" />
                        <div className="shape-center" />
                    </div>
                    <h2 className="auth-left__tagline">
                        Your Journey<br />
                        <span className="shimmer-gold">Starts Here</span>
                    </h2>
                    <p className="auth-left__sub">
                        Join 2M+ students and 12K+ companies on India's premium hiring platform.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <motion.div
                    className="auth-card glass-card"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <Link to="/" className="auth-back">
                        <FiArrowLeft size={16} /> Back
                    </Link>

                    {/* Progress */}
                    <div className="reg-progress">
                        <div className={`reg-step ${step >= 1 ? 'active' : ''}`}>
                            {step > 1 ? <FiCheck size={14} /> : '1'}
                        </div>
                        <div className={`reg-progress-line ${step > 1 ? 'filled' : ''}`} />
                        <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="auth-card__header">
                                    <center>
                                        <h1 className="auth-card__title">"I am a, "</h1>
                                        <p className="auth-card__sub">Choose your role to get started</p>
                                    </center>
                                </div>

                                <div className="role-cards">
                                    <button
                                        className={`role-card ${role === 'student' ? 'role-card--active' : ''}`}
                                        onClick={() => setRole('student')}
                                    >
                                        <span className="role-card__icon">
                                            <FiUser />
                                        </span>
                                        <span className="role-card__title">Student</span>
                                        <span className="role-card__desc">Find jobs & internships</span>
                                    </button>
                                    <button
                                        className={`role-card ${role === 'recruiter' ? 'role-card--active' : ''}`}
                                        onClick={() => setRole('recruiter')}
                                    >
                                        <span className="role-card__icon">
                                            <FiBriefcase />
                                        </span>
                                        <span className="role-card__title">Recruiter</span>
                                        <span className="role-card__desc">Hire top talent</span>
                                    </button>
                                </div>

                                <button
                                    className="btn btn-gold btn-lg"
                                    style={{ width: '100%', justifyContent: 'center' }}
                                    disabled={!role}
                                    onClick={() => setStep(2)}
                                >
                                    Continue <FiArrowRight size={16} />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="auth-card__header">
                                    <h1
                                        className="auth-card__title"
                                        style={{ display: "flex", alignItems: "center", gap: "8px" }}
                                    >
                                        {role === 'student' ? <FiUser /> : <FiBriefcase />}
                                        {role === 'student' ? 'Student' : 'Recruiter'} Sign Up
                                    </h1>
                                    <p className="auth-card__sub">
                                        Fill in your details to create your account
                                    </p>
                                </div>
                                <form onSubmit={handleSubmit} className="auth-form">
                                    {fields.map(f => (
                                        <div key={f.key} className="form-group">
                                            <label className="form-label">{f.label}</label>
                                            {f.hint && <p className="form-hint">{f.hint}</p>}
                                            <div className="input-wrapper">
                                                <span className="input-icon">{f.icon}</span>
                                                <input
                                                    type={f.type}
                                                    placeholder={f.placeholder}
                                                    value={formData[f.key] || ''}
                                                    onChange={e => handleChange(f.key, e.target.value)}
                                                    className={`input input-with-icon ${errors[f.key] ? 'input-error' : ''}`}
                                                    required
                                                />
                                            </div>
                                            {errors[f.key] && (
                                                <p className="error-message">{errors[f.key]}</p>
                                            )}
                                        </div>
                                    ))}

                                    <button
                                        type="submit"
                                        className={`btn btn-gold btn-lg auth-submit ${loading ? 'loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading ? <span className="spinner" /> : 'Create Account'}
                                    </button>
                                </form>

                                <button className="auth-back-step" onClick={() => setStep(1)}>
                                    <FiArrowLeft size={14} /> Change role
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <p className="auth-footer-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;