import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { FiUsers, FiBriefcase, FiAward, FiTrendingUp } from 'react-icons/fi';
import './StatsSection.css';

const stats = [
    { icon: <FiBriefcase size={28} />, value: 50000, suffix: '+', label: 'Active Jobs', desc: 'Fresh listings daily', color: '#FFD700' },
    { icon: <FiUsers size={28} />, value: 2000000, suffix: '+', label: 'Students', desc: 'Registered & growing', color: '#457EFF' },
    { icon: <FiAward size={28} />, value: 12000, suffix: '+', label: 'Companies', desc: 'Verified recruiters', color: '#D4AF37' },
    { icon: <FiTrendingUp size={28} />, value: 98, suffix: '%', label: 'Success Rate', desc: 'Placement satisfaction', color: '#48C78E' },
];

const StatsSection = () => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

    return (
        <section className="stats-section" ref={ref}>
            <div className="stats__glow" />
            <div className="container">
                <div className="stats__grid">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="stat-card glass-card"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="stat-card__icon" style={{ color: stat.color, background: `${stat.color}15` }}>
                                {stat.icon}
                            </div>
                            <div className="stat-card__value">
                                {inView ? (
                                    <CountUp
                                        end={stat.value}
                                        duration={2.5}
                                        separator=","
                                        formattingFn={val => {
                                            if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                                            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
                                            return `${val}`;
                                        }}
                                    />
                                ) : '0'}
                                <span style={{ color: stat.color }}>{stat.suffix}</span>
                            </div>
                            <div className="stat-card__label">{stat.label}</div>
                            <div className="stat-card__desc">{stat.desc}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
