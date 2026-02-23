import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import './FinalCTA.css';

const FinalCTA = () => {
    return (
        <section className="final-cta section section-dark">
            <div className="cta__bg-gradient" />
            <div className="cta__particles">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="cta__particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 4}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                    }} />
                ))}
            </div>

            <div className="container">
                <motion.div
                    className="cta__content"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="cta__badge">
                        <FiZap size={14} fill="#FFD700" color="#FFD700" />
                        <span>Limited Time – Free for Students</span>
                    </div>

                    <h2 className="cta__title">
                        Get Your <span className="shimmer-gold">Dream Job</span>
                        <br />Now.
                    </h2>

                    <p className="text-secondary">
                        Join 2 million+ students who've found their path through HireSphere.
                        Your next chapter starts with one click.
                    </p>

                    <div className="cta__actions">
                        <Link to="/register" className="btn btn-gold btn-lg cta__main-btn">
                            Start for Free
                            <FiArrowRight size={18} />
                        </Link>
                        <Link to="/jobs" className="btn btn-ghost btn-lg">
                            Browse Jobs →
                        </Link>
                    </div>

                    <p className="cta__note">No credit card required · Free forever for students</p>
                </motion.div>
            </div>
        </section>
    );
};

export default FinalCTA;
