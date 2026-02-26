import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiMenu, FiX, FiSearch, FiBell, FiChevronDown } from 'react-icons/fi';

import './Navbar.css';

const Navbar = ({ variant = 'landing', searchQuery, onSearchChange }) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Use controlled props if provided, otherwise use local state
    const currentSearchQuery = searchQuery !== undefined ? searchQuery : localSearchQuery;
    const handleSearchChange = (e) => {
        const val = e.target.value;
        if (onSearchChange) {
            onSearchChange(val);
        } else {
            setLocalSearchQuery(val);
        }
    };

    // Authentication state from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadUser = (e) => {
            const storedUser = localStorage.getItem('userInfo');
            console.log('Navbar loadUser fired:', storedUser ? 'Found user' : 'No user', e?.type);
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                setUser(null);
            }
        };

        loadUser();
        window.addEventListener('userUpdated', loadUser);

        return () => window.removeEventListener('userUpdated', loadUser);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

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
        { label: 'About Us', path: '/about' },
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
                                value={currentSearchQuery}
                                onChange={handleSearchChange}
                                className="search-input"
                            />
                        </div>
                    ) : (
                        <div className="navbar__links">
                            {navLinks.map(link => {
                                // For hash links, use normal anchor. For routes, use React Router Link
                                if (link.path.includes('#')) {
                                    return (
                                        <a
                                            key={link.label}
                                            href={link.path}
                                            className="nav-link"
                                        >
                                            {link.label}
                                        </a>
                                    );
                                }
                                return (
                                    <Link
                                        key={link.label}
                                        to={link.path}
                                        className={`nav-link ${isActive(link.path) ? 'nav-link--active' : ''}`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                    )}

                    {/* Right Actions */}
                    <div className="navbar__actions">
                        {user ? (
                            <div className="user-avatar-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link to={user.role === 'recruiter' ? '/dashboard/recruiter' : '/dashboard/student'} className="user-avatar" style={{ textDecoration: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div className="avatar-circle">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: '500', transition: 'color 0.2s' }}>{user.name}</span>
                                </Link>
                                <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                                <Link to="/register" className="btn btn-gold btn-sm">Sign Up</Link>
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
                        {navLinks.map(link => {
                            if (link.path.includes('#')) {
                                return (
                                    <a key={link.label} href={link.path} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                                        {link.label}
                                    </a>
                                );
                            }
                            return (
                                <Link key={link.label} to={link.path} className="mobile-nav-link" onClick={() => setMobileOpen(false)}>
                                    {link.label}
                                </Link>
                            );
                        })}
                        <div className="mobile-menu__actions">
                            {user ? (
                                <button onClick={handleLogout} className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Logout</button>
                            ) : (
                                <>
                                    <Link to="/login" className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
                                    <Link to="/register" className="btn btn-gold" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
