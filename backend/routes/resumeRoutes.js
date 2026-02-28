import express from 'express';
import { uploadResume, getResumeUrl } from '../controllers/resumeController.js';
import { resumeUploadMiddleware } from '../middlewares/resumeUploadMiddleware.js';
import { protect, student, recruiter } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   POST /api/resume/upload
// @desc    Upload student resume to Wasabi S3
// @access  Private/Student
router.post('/upload', protect, student, resumeUploadMiddleware, uploadResume);

// @route   GET /api/resume/:userId
// @desc    Get signed URL for student resume
// @access  Private/Recruiter
router.get('/:userId', protect, recruiter, getResumeUrl);

export default router;
