import React, { createContext, useContext, useState } from 'react';

const ResumeContext = createContext(null);

/**
 * AI scoring: extracts keywords from the resume filename and matches against
 * job required skills. Returns a percentage 0-100.
 */
function computeAIScore(resumeFile, jobSkills = []) {
    if (!resumeFile || !jobSkills.length) return Math.floor(Math.random() * 30) + 40; // fallback random 40-70

    // Use filename as a simple proxy for resume content (no backend needed)
    const filename = (resumeFile.name || '').toLowerCase();

    // Also generate a deterministic base score from filename length to add variety
    const base = (filename.length % 25) + 50; // 50–74 base

    const matched = jobSkills.filter(skill =>
        filename.toLowerCase().includes(skill.toLowerCase().slice(0, 4))
    ).length;

    const skillBonus = Math.round((matched / jobSkills.length) * 26); // 0–26 points
    return Math.min(100, base + skillBonus);
}

export const ResumeProvider = ({ children }) => {
    const [applications, setApplications] = useState([]);

    /**
     * Store an application with the resume file and compute AI score.
     * @param {object} job - The full job object from mockJobs
     * @param {string} studentName - Student's name
     * @param {File|null} resumeFile - The uploaded File object
     */
    const applyToJob = (job, studentName, resumeFile) => {
        const resumeUrl = resumeFile ? URL.createObjectURL(resumeFile) : null;
        const aiScore = computeAIScore(resumeFile, job.skills || []);

        const newApplication = {
            id: Date.now(),
            jobId: job.id,
            job,
            studentName: studentName || 'Anonymous Student',
            resumeFile,
            resumeFileName: resumeFile ? resumeFile.name : null,
            resumeUrl,
            appliedAt: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
            status: 'Applied',
            aiScore,
        };

        setApplications(prev => {
            // Prevent duplicate applications for same job by same student
            const exists = prev.find(a => a.jobId === job.id && a.studentName === newApplication.studentName);
            if (exists) {
                return prev.map(a =>
                    a.jobId === job.id && a.studentName === newApplication.studentName
                        ? { ...a, ...newApplication }
                        : a
                );
            }
            return [...prev, newApplication];
        });

        return aiScore;
    };

    /**
     * Returns all applications sorted by AI score descending.
     */
    const getSortedApplications = () => {
        return [...applications].sort((a, b) => b.aiScore - a.aiScore);
    };

    return (
        <ResumeContext.Provider value={{ applications, applyToJob, getSortedApplications }}>
            {children}
        </ResumeContext.Provider>
    );
};

export const useResume = () => {
    const ctx = useContext(ResumeContext);
    if (!ctx) throw new Error('useResume must be used within ResumeProvider');
    return ctx;
};
