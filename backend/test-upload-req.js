// test-upload-req.js
import fs from 'fs';
import User from './models/User.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const student = await User.findOne({ role: 'student' });
        if (!student) throw new Error("No student found");

        const token = require('./utils/generateToken.js').default(student._id);

        const formData = new FormData();
        formData.append('resume', new Blob(['test resume content'], { type: 'application/pdf' }), 'myresume.pdf');
        formData.append('cgpa', '8.5');

        const res = await fetch('http://localhost:5000/api/resume/upload', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await res.json();
        console.log("Upload response:", data);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
})();
