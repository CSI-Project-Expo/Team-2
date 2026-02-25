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

            job.applicants.push({ student: req.user._id });
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
const getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ recruiter: req.user._id }).populate({
            path: 'applicants.student',
            select: 'name email resumeUrl',
        });
        res.json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { createJob, getJobs, applyJob, getRecruiterJobs };
