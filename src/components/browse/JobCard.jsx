import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiBriefcase, FiClock, FiDollarSign, FiArrowRight, FiZap, FiBookmark } from 'react-icons/fi';
import './JobCard.css';

const JobCard = ({ job, onApply }) => {
    const {
        title, company, logo, color, location,
        type, salary, experience, skills, tags,
        posted, applicants, remote, urgent, featured
    } = job;

    const [isBookmarked, setIsBookmarked] = React.useState(false);
    const userId = React.useMemo(() => {
        const u = localStorage.getItem('userInfo');
        return u ? JSON.parse(u)._id : 'guest';
    }, []);

    React.useEffect(() => {
        const saved = JSON.parse(localStorage.getItem(`savedJobs_${userId}`) || '[]');
        if (saved.some(s => s.id === job.id)) {
            setIsBookmarked(true);
        }
    }, [job.id, userId]);

    const toggleBookmark = (e) => {
        e.stopPropagation();
        const saved = JSON.parse(localStorage.getItem(`savedJobs_${userId}`) || '[]');
        if (isBookmarked) {
            const updated = saved.filter(s => s.id !== job.id);
            localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(updated));
            setIsBookmarked(false);
        } else {
            saved.push(job);
            localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(saved));
            setIsBookmarked(true);
        }
    };

    return (
        <motion.div
            className={`job-card glass-card ${featured ? 'job-card--featured' : ''}`}
            whileHover={{ y: -6 }}
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
                <div className="job-card__badges" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {urgent && <span className="badge badge-urgent"><FiZap size={10} /> Urgent</span>}
                    {featured && <span className="badge badge-gold">Featured</span>}
                    <button
                        onClick={toggleBookmark}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isBookmarked ? 'var(--gold-primary)' : 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                    >
                        <FiBookmark fill={isBookmarked ? 'var(--gold-primary)' : 'transparent'} size={18} />
                    </button>
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
                <button
                    className="job-card__apply-btn"
                    onClick={() => onApply && onApply(job)}
                >
                    Apply <FiArrowRight size={12} />
                </button>
            </div>
        </motion.div>
    );
};

export default JobCard;
