import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin, FiUsers, FiStar, FiCalendar, FiGlobe, FiBriefcase } from 'react-icons/fi';

const generateStaticDescription = (company) => {
    const templates = [
        `{name} is revolutionizing the {industry} sector with cutting-edge innovations and a strong focus on {impact}. Established in {founded} and headquartered in {location}, they have rapidly scaled their operations to encompass a dynamic workforce of {employees} professionals.`,

        `Driven by a mission to redefine {industry}, {name} stands at the forefront of technological and operational excellence. With a stellar {rating}-star rating based on {reviews} reviews, their {employees}-strong team in {location} continues to push boundaries, emphasizing a culture of {impact}.`,

        `Recognized for their profound impact in {industry}, {name} (est. {founded}) blends industry expertise with forward-thinking strategies. Operating out of {location}, they offer an inclusive and fast-paced environment for their {employees} employees, actively focusing on overarching {impact} globally.`,

        `As a key player in the {industry} domain, {name} is renowned for commitment to high-quality solutions and {impact}. Since {founded}, their presence in {location} has grown significantly, housing a dedicated team of {employees} innovators who maintain a robust {rating}/5 market reputation.`
    ];

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    const tagsJoined = company.tags.length >= 2 ? `${company.tags[0]} and ${company.tags[1]}` : company.tags[0] || 'growth';

    return randomTemplate
        .replace(/{name}/g, company.name || 'This company')
        .replace(/{industry}/g, company.industry || 'technology')
        .replace(/{impact}/g, tagsJoined.toLowerCase())
        .replace(/{founded}/g, company.founded || 'recent years')
        .replace(/{location}/g, company.location || 'India')
        .replace(/{employees}/g, company.employees || 'numerous')
        .replace(/{rating}/g, company.rating || '4.5')
        .replace(/{reviews}/g, company.reviews || 'many');
};

const CompanyDetailsModal = ({ company, isOpen, onClose }) => {
    if (!company) return null;

    const description = generateStaticDescription(company);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="sdash-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                >
                    <motion.div
                        className="sdash-modal"
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onClick={e => e.stopPropagation()}
                        style={{ maxWidth: '600px', width: '90%', background: '#ffffff', border: '1px solid #eaeaea', borderRadius: '16px', padding: '30px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', position: 'relative' }}
                    >
                        <button className="sdash-modal-close" onClick={onClose} style={{ position: 'absolute', top: 15, right: 15, background: '#f5f5f5', border: 'none', color: '#333', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyItems: 'center', cursor: 'pointer' }}>
                            <FiX size={18} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', borderBottom: '1px solid #eaeaea', paddingBottom: '16px' }}>
                            <div style={{
                                width: '60px', height: '60px', borderRadius: '12px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.5rem', fontWeight: 'bold',
                                background: `${company.color}15`, color: company.color, border: `1px solid ${company.color}30`
                            }}>
                                {company.logo}
                            </div>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#111', display: 'flex', alignItems: 'center', gap: 8 }}>
                                    {company.name}
                                    {company.verified && <span style={{ fontSize: '0.85rem', background: '#E8F5E9', color: '#2E7D32', padding: '2px 8px', borderRadius: '10px' }}>✓ Verified</span>}
                                </h2>
                                <p style={{ margin: '4px 0 0', color: '#666', fontSize: '0.9rem' }}>
                                    {company.industry} • {company.location}
                                </p>
                            </div>
                        </div>

                        {/* Company Description Section */}
                        <div style={{ background: '#f9f9f9', border: '1px solid #eaeaea', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                            <div style={{ color: '#111', marginBottom: '10px', fontSize: '1rem', fontWeight: 600 }}>
                                Company Description
                            </div>
                            <p style={{ margin: 0, color: '#444', lineHeight: 1.6, fontSize: '0.95rem' }}>
                                {company.description || description}
                            </p>
                        </div>

                        {/* Quick Stats Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                            <div style={{ background: '#fdfdfd', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}><FiCalendar /> Founded</div>
                                <div style={{ color: '#222', fontWeight: 500 }}>{company.founded}</div>
                            </div>
                            <div style={{ background: '#fdfdfd', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}><FiUsers /> Employees</div>
                                <div style={{ color: '#222', fontWeight: 500 }}>{company.employees}</div>
                            </div>
                            <div style={{ background: '#fdfdfd', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}><FiStar /> Rating</div>
                                <div style={{ color: '#F5A623', fontWeight: 500 }}>{company.rating} / 5.0</div>
                            </div>
                            <div style={{ background: '#fdfdfd', padding: '12px', borderRadius: '8px', border: '1px solid #eee' }}>
                                <div style={{ color: '#666', fontSize: '0.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: 6 }}><FiBriefcase /> Open Roles</div>
                                <div style={{ color: company.color, fontWeight: 500 }}>{company.openJobs} available</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CompanyDetailsModal;
