import User from '../models/User.js';
import { uploadResumeToWasabi, getSignedResumeUrl } from '../utils/wasabiService.js';

// @desc    Upload user resume to Wasabi S3
// @route   POST /api/resume/upload
// @access  Private/Student
export const uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const userId = req.user._id;

        // Ensure user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Upload to Wasabi and get the key
        console.log(`[Resume Upload] Starting S3 upload for user ${userId} with file size ${req.file.size}`);
        const resumeKey = await uploadResumeToWasabi(req.file, userId);
        console.log(`[Resume Upload] S3 upload successful. Key: ${resumeKey}`);

        // Store the key instead of typical pathUrl in DB
        user.resumeKey = resumeKey;
        if (req.body.cgpa) {
            user.cgpa = parseFloat(req.body.cgpa);
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Resume uploaded successfully',
            data: {
                resumeKey
            }
        });
    } catch (error) {
        console.error('Wasabi S3 Upload Error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload resume to S3' });
    }
};

// @desc    Retrieve a signed URL to access a student's resume
// @route   GET /api/resume/:userId
// @access  Private/Recruiter
export const getResumeUrl = async (req, res) => {
    try {
        const { userId } = req.params;

        // Verify the student entity exists
        const studentUser = await User.findById(userId);
        if (!studentUser) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Check if student actually uploaded a resume prior
        if (!studentUser.resumeKey) {
            return res.status(404).json({ success: false, message: 'No resume found for this student' });
        }

        // Request a 1-hour signed URL from Wasabi
        const signedUrl = await getSignedResumeUrl(studentUser.resumeKey);

        res.status(200).json({
            success: true,
            data: {
                signedUrl
            }
        });

    } catch (error) {
        console.error('Wasabi S3 Signed URL Error:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve resume URL' });
    }
};
