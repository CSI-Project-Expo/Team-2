import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMapPin, FiBriefcase, FiArrowRight, FiChevronDown } from 'react-icons/fi';
import ParticleBackground from '../common/ParticleBackground';
import ThreeScene from '../common/ThreeScene';
import './HeroSection.css';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const [jobType, setJobType] = useState('Jobs');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/jobs?q=${query}`);
    };

    const stats = [
        { value: '50K+', label: 'Active Jobs' },
        { value: '12K+', label: 'Companies' },
        { value: '2M+', label: 'Students' },
        { value: '98%', label: 'Success Rate' },
    ];

    return (
        <section className="hero">
            <ParticleBackground />
            <ThreeScene />

            {/* Background Gradient Blobs */}
            <div className="hero__blob hero__blob--1" />
            <div className="hero__blob hero__blob--2" />
            <div className="hero__blob hero__blob--3" />

            {/* Grid Overlay */}
            <div className="hero__grid" />

            <div className="hero__content">
                {/* Badge */}
                <motion.div
                    className="hero__badge"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="badge__dot" />
                    <span>India's #1 Premium Job Platform</span>
                    <FiArrowRight size={12} />
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="hero__headline"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                >
                    Find Your{' '}
                    <span className="shimmer-gold">Dream Career</span>

                    <br />
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    className="hero__subtext"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    HireSphere connects verified students with top-tier companies through a fair,
                    transparent, and merit-based hiring ecosystem.
                </motion.p>

                {/* Search Bar */}
                <motion.form
                    className="hero__search"
                    onSubmit={handleSearch}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                >
                    <div className="search__type">
                        <FiBriefcase size={16} />
                        <select
                            value={jobType}
                            onChange={e => setJobType(e.target.value)}
                            className="search__select"
                        >
                            <option>Jobs</option>
                            <option>Internships</option>
                        </select>
                        <FiChevronDown size={14} />
                    </div>

                    <div className="search__divider" />

                    <div className="search__input-wrap">
                        <FiSearch size={18} className="search__icon" />
                        <input
                            type="text"
                            placeholder="Job title, company, or skills..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="search__main-input"
                        />
                    </div>

                    <div className="search__divider" />

                    <div className="search__location">
                        <FiMapPin size={16} />
                        <input
                            type="text"
                            placeholder="City or Remote"
                            className="search__location-input"
                        />
                    </div>

                    <button type="submit" className="search__btn btn btn-gold">
                        <FiSearch size={16} />
                        Search
                    </button>
                </motion.form>

                {/* Quick Tags */}
                <motion.div
                    className="hero__quick-tags"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                >
                    <span className="quick-tag-label">Popular:</span>
                    {['React Developer', 'Data Scientist', 'UI/UX Designer', 'Product Manager', 'Marketing'].map(tag => (
                        <button
                            key={tag}
                            className="quick-tag"
                            onClick={() => navigate(`/jobs?q=${tag}`)}
                        >
                            {tag}
                        </button>
                    ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                    className="hero__ctas"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.45 }}
                >
                    <Link to="/register" className="btn btn-gold btn-lg">
                        Get Started Free
                        <FiArrowRight size={18} />
                    </Link>
                    <Link to="/companies" className="btn btn-ghost btn-lg">
                        Browse Companies
                    </Link>
                </motion.div>

                {/* Mini Stats */}
                <motion.div
                    className="hero__stats"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55 }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="hero-stat">
                            <span className="hero-stat__value text-gold">{stat.value}</span>
                            <span className="hero-stat__label">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="hero__scroll-hint"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <FiChevronDown size={20} />
            </motion.div>
        </section>
    );
};

export default HeroSection;
