import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiFilter, FiGrid, FiList, FiHome, FiSearch } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import IndustryFilterBar from '../components/browse/IndustryFilterBar';
import SidebarFilters from '../components/browse/SidebarFilters';
import JobCard from '../components/browse/JobCard';
import JobDetailModal from '../components/browse/JobDetailModal';
import { mockJobs } from '../data/mockJobs';
import './BrowsePage.css';

const JobsPage = () => {
    const [industry, setIndustry] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [backendJobs, setBackendJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/jobs');
                const data = await res.json();

                // Map backend jobs to match the format of mockJobs
                const mappedJobs = data.map(job => ({
                    id: job._id,
                    title: job.title,
                    company: job.companyName,
                    logo: job.companyName ? job.companyName.charAt(0).toUpperCase() : 'C',
                    color: '#4285F4', // Default blue color
                    location: job.location,
                    type: job.type,
                    salary: job.salary,
                    experience: 'Not specified', // Default since backend doesn't have it
                    skills: job.requirements || [],
                    tags: [job.type],
                    posted: new Date(job.createdAt).toLocaleDateString(),
                    applicants: job.applicants ? job.applicants.length : 0,
                    description: job.description,
                    industry: 'Tech', // Default or derived
                    department: 'Engineering',
                    remote: job.location?.toLowerCase().includes('remote'),
                    urgent: false,
                    featured: false,
                }));

                setBackendJobs(mappedJobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    const allJobs = [...backendJobs, ...mockJobs];

    const displayedJobs = industry === 'all'
        ? allJobs
        : allJobs.filter(j => j.industry?.toLowerCase().includes(industry));

    const handleApply = (job) => {
        setSelectedJob(job);
    };

    return (
        <div className="browse-page">
            <Navbar variant="browse" />

            <div className="browse-page__top" style={{ paddingTop: 'var(--nav-height)' }}>
                <IndustryFilterBar selected={industry} onSelect={setIndustry} />
            </div>

            <div className="browse-layout">
                {/* Desktop Sidebar */}
                <SidebarFilters />

                {/* Mobile Filter Overlay */}
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

                {/* Main Content */}
                <main className="browse-main">
                    <div className="browse-main__header">
                        <div>
                            <h2 className="browse-main__title">
                                Showing <span className="text-blue">{displayedJobs.length}</span> Jobs
                            </h2>
                            <p className="browse-main__subtitle">Verified opportunities from top companies</p>
                        </div>

                        <div className="browse-controls">
                            <Link to="/" className="btn btn-ghost btn-sm back-home-btn">
                                <FiHome size={14} /> Home
                            </Link>
                            <button
                                className="btn btn-ghost btn-sm mobile-filter-btn"
                                onClick={() => setShowMobileFilters(true)}
                            >
                                <FiFilter size={14} /> Filters
                            </button>
                            <div className="view-toggle">
                                <button
                                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                    onClick={() => setViewMode('grid')}
                                >
                                    <FiGrid size={16} />
                                </button>
                                <button
                                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                    onClick={() => setViewMode('list')}
                                >
                                    <FiList size={16} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={`browse-grid ${viewMode === 'list' ? 'browse-grid--list' : ''}`}>
                        {displayedJobs.map((job, i) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <JobCard job={job} onApply={handleApply} />
                            </motion.div>
                        ))}
                    </div>

                    {displayedJobs.length === 0 && (
                        <div className="no-results">
                            <FiSearch size={40} className="no-results__icon" />
                            <p>No jobs found for this filter. Try a different category.</p>
                        </div>
                    )}
                </main>
            </div>

            <Footer />

            {/* Job Detail Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <JobDetailModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobsPage;
