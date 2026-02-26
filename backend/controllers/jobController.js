import Job from '../models/Job.js';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
    const { title, companyName, location, type, salary, description, requirements } = req.body;

    try {
        const job = new Job({
            recruiter: req.user._id,
            title,
            companyName,
            location,
            type,
            salary,
            description,
            requirements,
        });

        const createdJob = await job.save();
        res.status(201).json(createdJob);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('recruiter', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Private/Student
const applyJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (job) {
            // Check if already applied
            const alreadyApplied = job.applicants.find(
                (app) => app.student.toString() === req.user._id.toString()
            );

            if (alreadyApplied) {
                return res.status(400).json({ message: 'You have already applied for this job' });
            }

            job.applicants.push({ student: req.user._id, status: 'Applied' });
            await job.save();
            res.status(200).json({ message: 'Application successful' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get recruiter jobs and applicants
// @route   GET /api/jobs/recruiter
// @access  Private/Recruiter
import nodemailer from 'nodemailer';

const getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).populate({
            path: 'applicants.student',
            select: 'name email resumeUrl resumeText cgpa',
        });

        // Calculate AI Score on the fly
        const jobsWithScores = jobs.map(job => {
            const jobReqs = job.requirements || [];

            const applicantsWithScores = job.applicants.map(app => {
                let aiScore = 40; // Base score
                const text = (app.student.resumeText || '').toLowerCase();

                // Keyword match
                if (jobReqs.length > 0) {
                    let matchCount = 0;
                    jobReqs.forEach(req => {
                        if (text.includes(req.toLowerCase())) {
                            matchCount++;
                        }
                    });
                    aiScore += Math.min(40, (matchCount / jobReqs.length) * 40);
                } else {
                    aiScore += 20; // Default if no reqs
                }

                // CGPA bonus
                const cgpa = app.student.cgpa || 0;
                if (cgpa >= 9) aiScore += 20;
                else if (cgpa >= 8) aiScore += 15;
                else if (cgpa >= 7) aiScore += 10;
                else if (cgpa >= 6) aiScore += 5;

                return {
                    ...app.toObject(),
                    aiScore: Math.round(Math.min(100, aiScore))
                };
            });

            // Sort by AI score descending, then by CGPA if score ties
            applicantsWithScores.sort((a, b) => {
                if (b.aiScore !== a.aiScore) return b.aiScore - a.aiScore;
                return (b.student.cgpa || 0) - (a.student.cgpa || 0);
            });

            return {
                ...job.toObject(),
                applicants: applicantsWithScores
            };
        });

        res.json(jobsWithScores);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Recruiter
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (job) {
            // Check if user is the owner
            if (job.recruiter.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this job' });
            }
            await Job.deleteOne({ _id: job._id });
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Shortlist Applicant
// @route   PATCH /api/jobs/:id/applicants/:studentId/shortlist
// @access  Private/Recruiter
const shortlistApplicant = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('applicants.student');
        if (job) {
            const applicant = job.applicants.find(a => a.student._id.toString() === req.params.studentId);
            if (applicant) {
                applicant.status = 'Shortlisted';
                await job.save();

                // Simulate sending email setup
                nodemailer.createTestAccount((err, account) => {
                    if (err) {
                        console.error('Failed to create a testing account. ' + err.message);
                        return;
                    }
                    // Create a SMTP transporter object
                    let transporter = nodemailer.createTransport({
                        host: account.smtp.host,
                        port: account.smtp.port,
                        secure: account.smtp.secure,
                        auth: {
                            user: account.user,
                            pass: account.pass
                        }
                    });

                    // Message object
                    let message = {
                        from: `"${job.companyName}" <hr@${job.companyName.replace(/\s+/g, '').toLowerCase()}.com>`,
                        to: applicant.student.email,
                        subject: `You have been shortlisted for in-person interview for ${job.title}`,
                        text: `Hello ${applicant.student.name},\n\nCongratulations! You have been shortlisted for an in-person interview for the ${job.title} role at ${job.companyName}.\n\nWe will reach out with the date and time details shortly.\n\nBest,\n${job.companyName} Hiring Team`,
                    };

                    transporter.sendMail(message, (err, info) => {
                        if (err) {
                            console.log('Error occurred. ' + err.message);
                            return;
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    });
                });

                res.json({ message: 'Applicant shortlisted and email sent' });
            } else {
                res.status(404).json({ message: 'Applicant not found' });
            }
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createJob, getJobs, applyJob, getRecruiterJobs, deleteJob, shortlistApplicant };
