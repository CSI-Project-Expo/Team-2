import User from '../models/User.js';
import OTP from '../models/OTP.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

// @desc    Send OTP to email for user registration (Recruiters only expected)
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Please provide an email' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a 6-digit random number
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Delete any existing OTP for this email
        await OTP.deleteMany({ email });

        // Save the new OTP to the database
        await OTP.create({
            email,
            otp: otpCode,
        });

        // Send the OTP via email
        try {
            await sendEmail({
                email,
                subject: 'Your OTP Verification Code',
                message: `Your OTP is ${otpCode}. It is valid for 10 minutes.`,
            });

            res.status(200).json({ success: true, message: 'OTP sent successfully' });
        } catch (error) {
            console.error('Email send error:', error);
            // Delete OTP from DB if email failed to send
            await OTP.deleteMany({ email });
            return res.status(500).json({ message: 'Error sending email. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                resumeUrl: user.resumeUrl,
                resumeKey: user.resumeKey,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, otp } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Recruiter requires OTP verification
        if (role === 'recruiter') {
            if (!otp) {
                return res.status(400).json({ message: 'OTP is required for recruiters' });
            }

            // Retrieve the OTP document from the DB
            const otpRecord = await OTP.findOne({ email });

            if (!otpRecord) {
                return res.status(400).json({ message: 'OTP has expired. Please resend.' });
            }

            const isMatch = await otpRecord.matchOtp(otp);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid OTP' });
            }

            // Valid OTP, so clean it up
            await OTP.deleteMany({ email });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            console.log('--- Profile Update Attempt ---');
            console.log('Incoming req.body:', req.body);
            console.log('Current user.name:', user.name);

            // Uniqueness check for email
            if (req.body.email && req.body.email !== user.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists) {
                    return res.status(400).json({ message: 'Email is already in use' });
                }
            }

            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;

            console.log('Modified user.name before save:', user.name);

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                resumeUrl: updatedUser.resumeUrl,
                resumeKey: updatedUser.resumeKey,
                token: generateToken(updatedUser._id),
                message: 'Profile updated successfully'
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export { authUser, registerUser, updateUserProfile, sendOtp };
