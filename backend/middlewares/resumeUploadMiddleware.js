import multer from 'multer';

// Use memory storage so the file is kept in a buffer, preventing local disk writes
const storage = multer.memoryStorage();

// Validate file types to only allow PDF, DOC, and DOCX
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'), false);
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
    },
});

// Middleware wrapper to handle multer errors gracefully
export const resumeUploadMiddleware = (req, res, next) => {
    // Expected field name from the frontend is 'resume'
    console.log(`[Multer Middleware] Receiving request to upload resume. Content-Type: ${req.headers['content-type']}`);
    const uploadSingle = upload.single('resume');

    uploadSingle(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error(`[Multer Middleware] Multer Error: ${err.message}`);
            // A Multer error occurred when uploading (e.g., file too large).
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ success: false, message: 'File is too large. Max size is 5MB.' });
            }
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            // An unknown error occurred (e.g., invalid file type).
            console.error(`[Multer Middleware] Unknown Error: ${err.message}`);
            return res.status(400).json({ success: false, message: err.message });
        }

        console.log(`[Multer Middleware] File successfully parsed. Sending to controller.`);
        // No errors, continue
        next();
    });
};
