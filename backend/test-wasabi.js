import fs from 'fs';
import { uploadResumeToWasabi } from './utils/wasabiService.js';

// Self-contained test
(async () => {
    try {
        console.log("Creating dummy PDF buffer...");
        const buffer = Buffer.from('Dummy content');

        const fileObj = {
            originalname: 'test_student_resume.pdf',
            mimetype: 'application/pdf',
            buffer
        };

        console.log("Uploading to Wasabi...");
        const key = await uploadResumeToWasabi(fileObj, 'test-user-1234');
        console.log("Success! Uploaded with key:", key);

    } catch (e) {
        console.error("Test failed:", e);
    }
})();
