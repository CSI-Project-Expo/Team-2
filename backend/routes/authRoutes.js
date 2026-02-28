import express from 'express';
import rateLimit from 'express-rate-limit';
import { authUser, registerUser, updateUserProfile, sendOtp } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rate limiting for OTP
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 3, // Limit each IP to 3 requests per `window` (here, per 10 minutes)
    message: { message: 'Too many OTP requests from this IP, please try again after 10 minutes' },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.post('/send-otp', otpLimiter, sendOtp);
router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/profile', protect, updateUserProfile);

export default router;
