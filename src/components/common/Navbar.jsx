import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';
import './Navbar.css';

const Navbar = ({ variant = 'landing' }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();

    // Mock auth state
    const [user] = useState(null); // null = not logged in

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const navLinks = [
        { label: 'Jobs', path: '/jobs' },
        { label: 'Companies', path: '/companies' },
        { label: 'Services', path: '#' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`navbar ${scrolled || variant !== 'landing' ? 'navbar--scrolled' : ''}`}>
                <div className="navbar__inner">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        <span className="logo-text text-gold">HIRE</span>
                        <span className="logo-text logo-text--white">SPHERE</span>
                        <span className="logo-dot" />
                    </Link>

                    {/* Center: Search (browse pages) or Nav Links (landing) */}
                    {variant === 'browse' ? (
                        <div className="navbar__search">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search jobs here..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                    ) : (
                        <div className="navbar__links">
                            {navLinks.map(link => (
                                <Link
                                    key={link.label}
                                    to={link.path}
                                    className={`nav-link ${isActive(link.path) ? 'nav-link--active' : ''}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="navbar__actions">
                        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
                            {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
                        </button>

                        {user ? (
                            <div className="user-avatar">
                                <div className="avatar-circle">V</div>
                                <FiChevronDown size={14} />
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-gold btn-sm">Register</Link>
                            </>
                        )}

                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="mobile-menu"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {navLinks.map(link => (
                            <Link key={link.label} to={link.path} className="mobile-nav-link">
                                {link.label}
                            </Link>
                        ))}
                        <div className="mobile-menu__actions">
                            <Link to="/login" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
                            <Link to="/register" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
