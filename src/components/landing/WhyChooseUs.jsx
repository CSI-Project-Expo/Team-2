import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiZap, FiCheckCircle, FiLock, FiAward, FiUsers } from 'react-icons/fi';
import './WhyChooseUs.css';

const features = [
    {
        icon: <FiShield size={24} />,
        title: 'Verified Only',
        desc: 'Every recruiter and student is verified. No spam, no fake accounts – just genuine connections.',
        color: '#FFD700',
    },
    {
        icon: <FiAward size={24} />,
        title: 'Merit-Based Hiring',
        desc: 'Our two-level resume priority system ensures your skills speak louder than connections.',
        color: '#457EFF',
    },
    {
        icon: <FiLock size={24} />,
        title: 'Safe & Private',
        desc: 'Your data stays hidden until you apply. Controlled chat prevents unsolicited outreach.',
        color: '#48C78E',
    },
    {
        icon: <FiZap size={24} />,
        title: 'Instant Matching',
        desc: 'AI-powered job matching surfaces the most relevant opportunities within seconds.',
        color: '#F5C542',
    },
    {
        icon: <FiCheckCircle size={24} />,
        title: 'Transparent Process',
        desc: 'Standardized question banks and clear hiring pipelines so you always know where you stand.',
        color: '#FF7262',
    },
    {
        icon: <FiUsers size={24} />,
        title: 'Student First',
        desc: 'Built specifically for students and fresh graduates, with verified college ID priority.',
        color: '#AC6CFF',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="why section">
            <div className="why__bg-glow" />
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="section-title">
                        Why <span className="text-gold">HireSphere?</span>
                    </h2>
                    <div className="gold-divider" />
                    <p className="section-subtitle">
                        We built the platform we wished existed when we were job hunting.
                    </p>
                </motion.div>

                <div className="why__grid">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            className="why-card glass-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="why-card__icon" style={{ color: f.color, background: f.color + '15' }}>
                                {f.icon}
                            </div>
                            <h3 className="why-card__title">{f.title}</h3>
                            <p className="why-card__desc">{f.desc}</p>
                            <div className="why-card__line" style={{ background: f.color }} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
