import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import ThreeScene from '../components/common/ThreeScene';
import './AuthPages.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
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
                alert(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error', error);
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
                <ThreeScene />
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
                        Welcome Back to<br />
                        <span className="shimmer-gold">Opportunity</span>
                    </h2>
                    <p className="auth-left__sub">
                        Your next career move is waiting. Log in and take the next step.
                    </p>
                </div>
            </div>

            {/* Right Panel */}
            <div className="auth-right">
                <motion.div
                    className="auth-card glass-card"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Link to="/" className="auth-back">
                        <FiArrowLeft size={16} /> Back to Home
                    </Link>

                    <div className="auth-card__header">
                        <h1 className="auth-card__title">Sign In</h1>
                        <p className="auth-card__sub">Access your HireSphere account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <FiMail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="input input-with-icon"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <div className="form-label-row">
                                <label className="form-label">Password</label>
                                <a href="#" className="forgot-link">Forgot password?</a>
                            </div>
                            <div className="input-wrapper">
                                <FiLock size={16} className="input-icon" />
                                <input
                                    type={showPw ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input input-with-icon"
                                    required
                                />
                                <button
                                    type="button"
                                    className="pw-toggle"
                                    onClick={() => setShowPw(!showPw)}
                                >
                                    {showPw ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-gold btn-lg auth-submit ${loading ? 'loading' : ''}`}
                            disabled={loading}
                        >
                            {loading ? <span className="spinner" /> : 'Sign In'}
                        </button>
                    </form>

                    <div className="auth-divider"><span>or continue with</span></div>

                    <div className="social-auth">
                        <button className="social-btn">
                            <span>G</span> Google
                        </button>
                        <button className="social-btn">
                            <span>in</span> LinkedIn
                        </button>
                    </div>

                    <p className="auth-footer-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">Create account</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
