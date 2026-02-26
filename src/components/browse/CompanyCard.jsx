import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiUsers, FiCalendar, FiExternalLink } from 'react-icons/fi';
import './CompanyCard.css';

const CompanyCard = ({ company, onViewDetails }) => {
    const {
        name, logo, color, tags, rating, reviews,
        founded, employees, location, openJobs, verified
    } = company;

    const renderStars = (r) => {
        const fullStars = Math.floor(r);
        return [...Array(5)].map((_, i) => (
            <FiStar
                key={i}
                size={12}
                fill={i < fullStars ? '#FFD700' : 'none'}
                color="#FFD700"
            />
        ));
    };

    return (
        <motion.div
            className="company-card glass-card"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
        >
            {/* Logo */}
            <div className="company-card__header">
                <div
                    className="company-card__logo"
                    style={{ background: color + '18', color: color, borderColor: color + '30' }}
                >
                    {logo}
                </div>
                {verified && (
                    <div className="company-card__verified" title="Verified Company">✓</div>
                )}
            </div>

            {/* Info */}
            <h3 className="company-card__name">{name}</h3>

            {/* Rating */}
            <div className="company-card__rating">
                <span className="stars">{renderStars(rating)}</span>
                <span className="rating-value">{rating}</span>
                <span className="rating-count">({reviews} reviews)</span>
            </div>

            {/* Tags */}
            <div className="company-card__tags">
                {tags.slice(0, 3).map(tag => (
                    <span key={tag} className="tag tag-blue">{tag}</span>
                ))}
            </div>

            {/* Meta */}
            <div className="company-card__meta">
                <span><FiCalendar size={12} /> Est. {founded}</span>
                <span><FiUsers size={12} /> {employees}</span>
                <span><FiMapPin size={12} /> {location.split(',')[0]}</span>
            </div>

            {/* Footer */}
            <div className="company-card__footer">
                <div className="open-jobs">
                    <span className="open-jobs__count" style={{ color }}>{openJobs}</span>
                    <span className="open-jobs__label"> open jobs</span>
                </div>
                <button onClick={onViewDetails} className="btn btn-outline-gold btn-sm">
                    View Details <FiExternalLink size={12} />
                </button>
            </div>
        </motion.div>
    );
};

export default CompanyCard;
