import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';
import './Testimonials.css';

const testimonials = [
    {
        quote: "HireSphere completely changed how I approached job hunting. The verified company badges gave me confidence, and I landed my role at Google within 3 weeks!",
        name: 'Priya Sharma',
        role: 'Software Engineer at Google',
        college: 'IIT Bombay, 2024',
        avatar: 'PS',
        rating: 5,
        color: '#4285F4',
    },
    {
        quote: "As a recruiter, the quality of applicants on HireSphere is unmatched. The verified student profiles with college IDs mean I'm never wasting time on fake resumes.",
        name: 'Rahul Mehta',
        role: 'Talent Lead at Razorpay',
        college: 'Razorpay Recruiting Team',
        avatar: 'RM',
        rating: 5,
        color: '#3395FF',
    },
    {
        quote: "The two-level priority system is brilliant. My verified Coursera certificate got me ranked higher, and I got interview calls from 4 top companies in a week.",
        name: 'Ananya Patel',
        role: 'Data Scientist at Microsoft',
        college: 'BITS Pilani, 2024',
        avatar: 'AP',
        rating: 5,
        color: '#00A4EF',
    },
    {
        quote: "Finally a platform that actually protects students. The controlled chat system meant I only got contacted by serious recruiters after I was shortlisted.",
        name: 'Vikram Nair',
        role: 'Product Manager at Swiggy',
        college: 'NIT Trichy, 2023',
        avatar: 'VN',
        rating: 5,
        color: '#FC8019',
    },
];

const Testimonials = () => {
    const [active, setActive] = useState(0);

    const prev = () => setActive(i => (i - 1 + testimonials.length) % testimonials.length);
    const next = () => setActive(i => (i + 1) % testimonials.length);

    const t = testimonials[active];

    return (
        <section id="testimonials" className="testimonials section">
            <div className="testimonials__glow" />
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">
                        What Our <span className="text-gold">Community</span> Says
                    </h2>
                    <div className="gold-divider" />
                </motion.div>

                <div className="testimonials__carousel">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            className="testimonial-card glass-card"
                            initial={{ opacity: 0, x: 60 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -60 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Quote */}
                            <div className="testimonial__quote-icon">"</div>
                            <p className="testimonial__quote">{t.quote}</p>

                            {/* Stars */}
                            <div className="testimonial__stars">
                                {[...Array(t.rating)].map((_, i) => (
                                    <FiStar key={i} fill="#FFD700" color="#FFD700" />
                                ))}
                            </div>

                            {/* Author */}
                            <div className="testimonial__author">
                                <div
                                    className="testimonial__avatar"
                                    style={{ background: t.color + '20', color: t.color, border: `2px solid ${t.color}40` }}
                                >
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="testimonial__name">{t.name}</div>
                                    <div className="testimonial__role">{t.role}</div>
                                    <div className="testimonial__college">{t.college}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Controls */}
                    <div className="testimonial__controls">
                        <button onClick={prev} className="control-btn">
                            <FiChevronLeft size={20} />
                        </button>
                        <div className="testimonial__dots">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === active ? 'dot--active' : ''}`}
                                    onClick={() => setActive(i)}
                                />
                            ))}
                        </div>
                        <button onClick={next} className="control-btn">
                            <FiChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
