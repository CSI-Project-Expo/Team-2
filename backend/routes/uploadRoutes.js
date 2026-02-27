import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import { protect, student } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Documents only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

router.post('/', protect, student, upload.single('resume'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const resumeUrl = `/${req.file.path.replace(/\\/g, '/')}`;
    let resumeText = '';
    let cgpa = req.body.cgpa ? parseFloat(req.body.cgpa) : 0; // Check manual CGPA input first

    try {
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdfParse(dataBuffer);
            resumeText = data.text;

            // Try to extract CGPA from text only if not provided manually
            if (!cgpa) {
                const cgpaMatch = resumeText.match(/cgpa[\s:]*([0-9.]+)/i);
                if (cgpaMatch && cgpaMatch[1]) {
                    const parsedCgpa = parseFloat(cgpaMatch[1]);
                    if (!isNaN(parsedCgpa) && parsedCgpa <= 10) {
                        cgpa = parsedCgpa;
                    }
                }
            }
        }
    } catch (e) {
        console.error('Error parsing PDF:', e);
    }

    // Update user with resume URL and parsed text
    const user = await User.findById(req.user._id);
    if (user) {
        user.resumeUrl = resumeUrl;
        user.resumeText = resumeText;
        user.cgpa = cgpa;
        await user.save();
    }

    res.send({ message: 'Resume Uploaded', resumeUrl });
});

export default router;
