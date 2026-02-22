import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jobCategories } from '../../data/mockJobs';
import { FiArrowRight } from 'react-icons/fi';
import './JobCategories.css';

const JobCategories = () => {
    return (
        <section className="categories section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="section-title">
                        Browse by <span className="text-gold">Category</span>
                    </h2>
                    <div className="gold-divider" />
                    <p className="section-subtitle">
                        Explore thousands of opportunities across every industry and function.
                    </p>
                </motion.div>

                <div className="categories__grid">
                    {jobCategories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: i * 0.07 }}
                        >
                            <Link to={`/jobs?category=${cat.name}`} className="category-card glass-card">
                                <div className="category-card__icon" style={{ background: cat.color + '18', color: cat.color }}>
                                    <span className="cat-emoji">{cat.icon}</span>
                                </div>
                                <div className="category-card__info">
                                    <h3 className="category-card__name">{cat.name}</h3>
                                    <p className="category-card__count" style={{ color: cat.color }}>{cat.count} jobs</p>
                                </div>
                                <FiArrowRight className="category-card__arrow" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    className="categories__cta"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <Link to="/jobs" className="btn btn-outline-gold">
                        View All Categories
                        <FiArrowRight />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default JobCategories;
