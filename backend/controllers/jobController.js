import Job from '../models/Job.js';
import Chat from '../models/Chat.js';
import nodemailer from 'nodemailer';

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private/Recruiter
const createJob = async (req, res) => {
    const { title, companyName, industry, location, type, salary, description, requirements } = req.body;

    try {
        const job = new Job({
            recruiter: req.user._id,
            title,
            companyName,
            industry,
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

            // Calculate initial AI Score for immediate frontend display
            let aiScore = 40; // Base score
            const jobReqs = job.requirements || [];
            const text = (req.user.resumeText || '').toLowerCase(); // Note: resume is now populated on user profile
            const cgpa = req.user.cgpa || 0;

            if (jobReqs.length > 0) {
                let matchCount = 0;
                jobReqs.forEach(req => {
                    if (text.includes(req.toLowerCase())) {
                        matchCount++;
                    }
                });
                aiScore += Math.min(40, (matchCount / jobReqs.length) * 40);
            } else {
                aiScore += 20;
            }

            if (cgpa >= 9) aiScore += 20;
            else if (cgpa >= 8) aiScore += 15;
            else if (cgpa >= 7) aiScore += 10;
            else if (cgpa >= 6) aiScore += 5;

            aiScore = Math.round(Math.min(100, aiScore));

            const newApplicant = { student: req.user._id, status: 'Applied', aiScore };
            job.applicants.push(newApplicant);
            await job.save();

            res.status(200).json({ message: 'Application successful', applicant: newApplicant });
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
                if (!app.student) {
                    return { ...app.toObject(), aiScore: 0 };
                }

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
            await Job.findByIdAndDelete(req.params.id);
            res.json({ message: 'Job removed' });
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update Applicant Status
// @route   PATCH /api/jobs/:id/applicants/:studentId/status
// @access  Private/Recruiter
const updateApplicantStatus = async (req, res) => {
    try {
        const { status } = req.body; // Expects 'Accepted' or 'Rejected'
        const job = await Job.findById(req.params.id).populate('applicants.student');
        if (job) {
            // Check if auth user is the recruiter who posted the job
            if (job.recruiter.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to modify applicants for this job' });
            }

            const applicant = job.applicants.find(a => a.student._id.toString() === req.params.studentId);
            if (applicant) {
                applicant.status = status;
                await job.save();

                // On Accept, auto-create Chat and send first message
                if (status === 'Shortlisted for in-person interview') {
                    try {
                        let chat = await Chat.findOne({
                            studentId: applicant.student._id,
                            jobId: job._id
                        });
                        if (!chat) {
                            chat = await Chat.create({
                                studentId: applicant.student._id,
                                recruiterId: job.recruiter,
                                jobId: job._id,
                                messages: [{
                                    senderId: job.recruiter,
                                    senderRole: 'recruiter',
                                    message: 'Your application has been accepted. You can now chat.',
                                    timestamp: new Date()
                                }]
                            });
                        }
                    } catch (chatError) {
                        console.error('Failed to auto-create chat:', chatError);
                    }
                }

                // Send email notification
                const sendNotificationEmail = async () => {
                    let transporter;

                    // If user has actual SMTP credentials in .env, use them (e.g., Gmail App Password)
                    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
                        transporter = nodemailer.createTransport({
                            host: process.env.SMTP_HOST,
                            port: process.env.SMTP_PORT || 587,
                            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
                            auth: {
                                user: process.env.SMTP_USER,
                                pass: process.env.SMTP_PASS
                            }
                        });
                    } else {
                        // Fallback to ethereal test account
                        let testAccount = await nodemailer.createTestAccount();
                        transporter = nodemailer.createTransport({
                            host: testAccount.smtp.host,
                            port: testAccount.smtp.port,
                            secure: testAccount.smtp.secure,
                            auth: {
                                user: testAccount.user,
                                pass: testAccount.pass
                            }
                        });
                    }

                    let subject = '';
                    let text = '';
                    if (status === 'Shortlisted for in-person interview') {
                        subject = `Congratulations! You have been shortlisted for ${job.title}`;
                        text = `Hello ${applicant.student.name},\n\nCongratulations! We are thrilled to inform you that you have been shortlisted for an in-person interview for the ${job.title} role at ${job.companyName}.\n\nOur hiring team will reach out with the onboarding and next step details shortly.\n\nBest,\n${job.companyName} Hiring Team`;
                    } else {
                        subject = `Update regarding your application for ${job.title}`;
                        text = `Hello ${applicant.student.name},\n\nThank you for applying to the ${job.title} role at ${job.companyName}. After careful consideration, we have decided to move forward with other candidates at this time.\n\nWe appreciate your interest and encourage you to apply for future openings.\n\nBest,\n${job.companyName} Hiring Team`;
                    }

                    // Message object
                    let message = {
                        from: `"${job.companyName}" <hr@${job.companyName.replace(/\s+/g, '').toLowerCase()}.com>`,
                        to: applicant.student.email,
                        subject: subject,
                        text: text,
                    };

                    let info = await transporter.sendMail(message);
                    console.log('Message sent: %s', info.messageId);

                    if (!process.env.SMTP_HOST) {
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    }
                };

                sendNotificationEmail().catch(console.error);

                res.json({ message: `Applicant status updated to ${status}` });
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

// @desc    Get apps for student
// @route   GET /api/jobs/student/applications
// @access  Private/Student
const getStudentApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ 'applicants.student': req.user._id })
            .select('title companyName location applicants createdAt recruiter')
            .populate('recruiter', 'email name')
            .sort({ createdAt: -1 });

        const mappedApps = jobs.map(job => {
            const myApp = job.applicants.find(a => a.student.toString() === req.user._id.toString());
            return {
                _id: job._id,
                jobTitle: job.title,
                companyName: job.companyName,
                location: job.location,
                recruiterEmail: job.recruiter?.email,
                status: myApp ? myApp.status : 'Applied',
                date: myApp ? new Date(myApp.appliedAt).toLocaleDateString() : new Date(job.createdAt).toLocaleDateString()
            };
        });

        res.json(mappedApps);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createJob, getJobs, applyJob, getRecruiterJobs, deleteJob, updateApplicantStatus, getStudentApplications };
