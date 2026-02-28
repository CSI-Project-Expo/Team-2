import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600, // Document will be automatically deleted after 10 minutes (600 seconds)
    }
});

// Hash the OTP before saving it to the database
otpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
});

// Compare entered OTP with hashed OTP
otpSchema.methods.matchOtp = async function (enteredOtp) {
    return await bcrypt.compare(enteredOtp, this.otp);
};

const OTP = mongoose.model('OTP', otpSchema);

export default OTP;
