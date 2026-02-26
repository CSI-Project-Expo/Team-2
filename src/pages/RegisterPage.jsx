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
    const [step, setStep] = useState(1); // 1=role, 2=form, 3=otp
    const [role, setRole] = useState(null);
    const [formData, setFormData] = useState({});
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
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
            const val = (value || '').toLowerCase().trim();
            if (val && val.length > 0 && !val.includes('@')) {
                return 'Please enter a valid email address';
            }
            // Removing strict .edu / .ac.in check to accommodate all valid college domains
        }
        if (key === 'password' && value.length < 8) return 'Password must be at least 8 characters';
        return '';
    };

    const handleChange = (key, value) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        const err = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: err }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Check local validation errors first
        if (Object.values(errors).some(err => err !== '')) {
            alert('Please fix the errors before proceeding.');
            return;
        }

        if (role === 'recruiter') {
            // Proceed to OTP step for recruiters
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setStep(3);
                setOtpSent(true);
            }, 1000); // Simulate API call to send OTP
        } else {
            // Students can register directly
            registerUser();
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1); // Only allow 1 char
        if (!/^[0-9]*$/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        // Auto focus previous input on backspace if empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const enteredOtp = otp.join('');
        if (enteredOtp.length !== 6) {
            alert('Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        // Simulate OTP verification logic
        setTimeout(() => {
            if (enteredOtp === '123456') { // Mock valid OTP
                registerUser();
            } else {
                setLoading(false);
                alert('Invalid OTP. Please try again. (Hint: use 123456)');
            }
        }, 1500);
    };

    const registerUser = async () => {
        setLoading(true);
        try {
            const payload = { ...formData, role };
            if (role === 'recruiter' && payload.companyEmail) {
                payload.email = payload.companyEmail;
            }

            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
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
            {/* Top Left Logo */}
            <Link to="/" className="auth-logo-top">
                <span className="text-gold">HIRE</span>SPHERE
            </Link>

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
                        <div className={`reg-step ${step >= 2 ? 'active' : ''}`}>
                            {step > 2 ? <FiCheck size={14} /> : '2'}
                        </div>

                        {role === 'recruiter' && (
                            <>
                                <div className={`reg-progress-line ${step > 2 ? 'filled' : ''}`} />
                                <div className={`reg-step ${step >= 3 ? 'active' : ''}`}>3</div>
                            </>
                        )}
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
                        ) : step === 2 ? (
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
                                <form onSubmit={handleFormSubmit} className="auth-form">
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

                                <button className="auth-back-step" onClick={() => setStep(1)} disabled={loading}>
                                    <FiArrowLeft size={14} /> Change role
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="otp-verification-step"
                            >
                                <div className="auth-card__header">
                                    <center>
                                        <div className="otp-icon-wrapper" style={{ margin: '0 auto 16px', width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 215, 0, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-primary)' }}>
                                            <FiLock size={24} />
                                        </div>
                                        <h1 className="auth-card__title">Verify Company Email</h1>
                                        <p className="auth-card__sub" style={{ lineHeight: '1.5' }}>
                                            We've sent a 6-digit verification code to<br />
                                            <strong style={{ color: 'var(--text-primary)' }}>{formData.companyEmail}</strong>
                                        </p>
                                    </center>
                                </div>

                                <form onSubmit={handleVerifyOtp} className="auth-form" style={{ marginTop: '24px' }}>
                                    <div className="otp-inputs" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                className="input"
                                                style={{ width: '45px', height: '50px', textAlign: 'center', fontSize: '1.25rem', fontWeight: 'bold', padding: '0', borderRadius: '8px' }}
                                                required
                                            />
                                        ))}
                                    </div>
                                    <div className="form-hint" style={{ textAlign: 'center', marginBottom: '24px' }}>
                                        Hint: Use <strong style={{ color: 'var(--gold-primary)' }}>123456</strong> to bypass verification
                                    </div>

                                    <button
                                        type="submit"
                                        className={`btn btn-gold btn-lg auth-submit ${loading ? 'loading' : ''}`}
                                        disabled={loading || otp.join('').length !== 6}
                                        style={{ width: '100%', justifyContent: 'center' }}
                                    >
                                        {loading ? <span className="spinner" /> : 'Verify & Setup Account'}
                                    </button>
                                </form>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                                    <button className="auth-back-step" onClick={() => { setStep(2); setOtp(['', '', '', '', '', '']); }} disabled={loading}>
                                        <FiArrowLeft size={14} /> Back
                                    </button>
                                    <button className="auth-back-step" style={{ color: 'var(--blue-accent)' }} disabled={loading}>
                                        Resend Code
                                    </button>
                                </div>
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