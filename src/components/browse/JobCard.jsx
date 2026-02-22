import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiArrowRight, FiZap } from 'react-icons/fi';
import './JobCard.css';

const JobCard = ({ job }) => {
    const {
        title, company, logo, color, location,
        type, salary, experience, skills, tags,
        posted, applicants, remote, urgent, featured
    } = job;

    return (
        <motion.div
            className={`job-card glass-card ${featured ? 'job-card--featured' : ''}`}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
        >
            {/* Header */}
            <div className="job-card__header">
                <div className="job-card__company-info">
                    <div
                        className="job-card__logo"
                        style={{ background: color + '20', color, borderColor: color + '30' }}
                    >
                        {logo}
                    </div>
                    <div>
                        <div className="job-card__company">{company}</div>
                        <div className="job-card__location">
                            <FiMapPin size={11} />
                            {location}
                            {remote && <span className="remote-badge">Remote</span>}
                        </div>
                    </div>
                </div>
                <div className="job-card__badges">
                    {urgent && <span className="badge badge-urgent"><FiZap size={10} /> Urgent</span>}
                    {featured && <span className="badge badge-gold">Featured</span>}
                </div>
            </div>

            {/* Job Title */}
            <h3 className="job-card__title">{title}</h3>

            {/* Tags */}
            <div className="job-card__tags">
                {tags.map(tag => (
                    <span key={tag} className="tag tag-blue">{tag}</span>
                ))}
            </div>

            {/* Meta Row */}
            <div className="job-card__meta">
                <span><FiBriefcase size={12} /> {type}</span>
                <span><FiClock size={12} /> {experience}</span>
                <span><FiDollarSign size={12} /> {salary}</span>
            </div>

            {/* Skills */}
            <div className="job-card__skills">
                {skills.slice(0, 4).map(skill => (
                    <span key={skill} className="skill-chip">{skill}</span>
                ))}
            </div>

            {/* Footer */}
            <div className="job-card__footer">
                <div className="job-card__footer-info">
                    <span className="posted-time">{posted}</span>
                    <span className="applicants-count">{applicants} applicants</span>
                </div>
                <Link to={`/jobs/${job.id}`} className="btn btn-outline-gold btn-sm">
                    Apply <FiArrowRight size={12} />
                </Link>
            </div>
        </motion.div>
    );
};

export default JobCard;
