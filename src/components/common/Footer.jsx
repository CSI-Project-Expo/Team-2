import React from 'react';
import { Link } from 'react-router-dom';
import { FiTwitter, FiLinkedin, FiInstagram, FiGithub, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const links = {
        Product: ['Find Jobs', 'Browse Companies', 'Post a Job', 'Internships', 'Career Advice'],
        Company: ['About Us', 'Careers', 'Press', 'Blog', 'Partners'],
        Support: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
    };

    return (
        <footer className="footer">
            <div className="footer__glow" />
            <div className="container">
                <div className="footer__top">
                    {/* Brand */}
                    <div className="footer__brand">
                        <Link to="/" className="footer__logo">
                            <span className="text-gold">HIRE</span>
                            <span>SPHERE</span>
                        </Link>
                        <p className="footer__tagline">
                            The premium platform connecting verified students with top recruiters.
                            Fair. Transparent. Ethical.
                        </p>
                        <div className="footer__socials">
                            {[
                                { icon: <FiTwitter />, href: '#', label: 'Twitter' },
                                { icon: <FiLinkedin />, href: '#', label: 'LinkedIn' },
                                { icon: <FiInstagram />, href: '#', label: 'Instagram' },
                                { icon: <FiGithub />, href: '#', label: 'GitHub' },
                            ].map(social => (
                                <a key={social.label} href={social.href} className="social-link" title={social.label}>
                                    {social.icon}
                                </a>
                            ))}
                        </div>

                        <div className="footer__contact">
                            <span><FiMail size={14} /> hello@hiresphere.in</span>
                            <span><FiPhone size={14} /> +91 98765 43210</span>
                            <span><FiMapPin size={14} /> Bangalore, India</span>
                        </div>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(links).map(([category, items]) => (
                        <div key={category} className="footer__col">
                            <h4 className="footer__col-title">{category}</h4>
                            <ul className="footer__col-links">
                                {items.map(item => (
                                    <li key={item}>
                                        <a href="#" className="footer__link">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div className="footer__newsletter">
                        <h4 className="footer__col-title">Stay Updated</h4>
                        <p className="footer__newsletter-desc">
                            Get the latest job opportunities directly in your inbox.
                        </p>
                        <div className="newsletter-form">
                            <input type="email" placeholder="Enter your email" className="newsletter-input" />
                            <button className="btn btn-gold btn-sm">Subscribe</button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer__bottom">
                    <p>© {currentYear} HireSphere. All rights reserved. Built with ❤️ for students.</p>
                    <div className="footer__bottom-links">
                        <a href="#">Privacy</a>
                        <span>·</span>
                        <a href="#">Terms</a>
                        <span>·</span>
                        <a href="#">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
