import React from 'react';
import { motion } from 'framer-motion';
import { featuredCompanyLogos } from '../../data/mockCompanies';
import './FeaturedCompanies.css';

// Double the logos for seamless marquee
const logoSet = [...featuredCompanyLogos, ...featuredCompanyLogos];

const FeaturedCompanies = () => {
    return (
        <section className="featured section">
            <div className="container">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <p className="featured__eyebrow">TRUSTED BY THE BEST</p>
                    <h2 className="section-title">
                        Top Companies Hiring on <span className="text-gold">HireSphere</span>
                    </h2>
                    <div className="gold-divider" />
                </motion.div>
            </div>

            {/* Marquee */}
            <div className="marquee-wrapper">
                <div className="marquee-fade marquee-fade--left" />
                <div className="marquee-track">
                    <div className="marquee-inner">
                        {logoSet.map((company, i) => (
                            <div key={i} className="marquee-item">
                                <div
                                    className="company-chip"
                                    style={{ '--company-color': company.color }}
                                >
                                    <div
                                        className="company-chip__logo"
                                        style={{ background: company.color + '20', color: company.color }}
                                    >
                                        {company.logo}
                                    </div>
                                    <span className="company-chip__name">{company.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="marquee-fade marquee-fade--right" />
            </div>
        </section>
    );
};

export default FeaturedCompanies;
