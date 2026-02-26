import express from 'express';
import { createJob, getJobs, applyJob, getRecruiterJobs, deleteJob, updateApplicantStatus, getStudentApplications } from '../controllers/jobController.js';
import { protect, recruiter, student } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getJobs).post(protect, recruiter, createJob);
router.route('/recruiter').get(protect, recruiter, getRecruiterJobs);
router.route('/student/applications').get(protect, student, getStudentApplications);

router.route('/:id').delete(protect, recruiter, deleteJob);
router.route('/:id/apply').post(protect, student, applyJob);
router.route('/:id/applicants/:studentId/status').patch(protect, recruiter, updateApplicantStatus);

export default router;
