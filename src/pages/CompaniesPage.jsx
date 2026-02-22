import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import IndustryFilterBar from '../components/browse/IndustryFilterBar';
import SidebarFilters from '../components/browse/SidebarFilters';
import CompanyCard from '../components/browse/CompanyCard';
import { mockCompanies } from '../data/mockCompanies';
import './BrowsePage.css';

const CompaniesPage = () => {
    const [industry, setIndustry] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    const displayedCompanies = industry === 'all'
        ? mockCompanies
        : mockCompanies.filter(c => c.industry?.toLowerCase().includes(industry));

    return (
        <div className="browse-page">
            <Navbar variant="browse" />

            <div className="browse-page__top" style={{ paddingTop: 'var(--nav-height)' }}>
                <IndustryFilterBar selected={industry} onSelect={setIndustry} />
            </div>

            <div className="browse-layout">
                <SidebarFilters />

                <AnimatePresence>
                    {showMobileFilters && (
                        <>
                            <motion.div
                                className="filter-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowMobileFilters(false)}
                            />
                            <motion.div
                                initial={{ x: -300 }}
                                animate={{ x: 0 }}
                                exit={{ x: -300 }}
                                transition={{ type: 'tween' }}
                            >
                                <SidebarFilters isMobile onClose={() => setShowMobileFilters(false)} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <main className="browse-main">
                    <div className="browse-main__header">
                        <div>
                            <h2 className="browse-main__title">
                                Showing <span className="text-blue">{displayedCompanies.length}</span> Companies
                            </h2>
                            <p className="browse-main__subtitle">Hire from the best companies in India</p>
                        </div>
                        <div className="browse-controls">
                            <button
                                className="btn btn-ghost btn-sm mobile-filter-btn"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <FiFilter size={14} /> Filters
                            </button>
                            <div className="view-toggle">
                                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                                    <FiGrid size={16} />
                                </button>
                                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                                    <FiList size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`browse-grid ${viewMode === 'list' ? 'browse-grid--list' : ''}`}>
                        {displayedCompanies.map((company, i) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <CompanyCard company={company} />
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default CompaniesPage;
