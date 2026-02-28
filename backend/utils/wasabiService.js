import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '../config/wasabi.js';
import dotenv from 'dotenv';
dotenv.config();

const BUCKET_NAME = process.env.WASABI_BUCKET_NAME || 'your_bucket_name';

/**
 * Uploads a resume file to Wasabi Hot Cloud Storage.
 * 
 * @param {Object} file - The file object from multer (containing buffer and originalname).
 * @param {String} userId - The ID of the user uploading the resume.
 * @returns {Promise<String>} - The key of the uploaded object in the bucket.
 */
export const uploadResumeToWasabi = async (file, userId) => {
    // Generate an object key based on user ID, timestamp, and the original file name
    const timestamp = Date.now();
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '');
    const fileKey = `resumes/${userId}/${timestamp}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        // The bucket is private, so no ACL makes it private by default.
    });

    await s3Client.send(command);

    return fileKey;
};

/**
 * Generates a signed URL to retrieve a private resume from Wasabi Hot Cloud Storage.
 * The URL expires in 1 hour.
 * 
 * @param {String} fileKey - The key of the resume object in the bucket.
 * @returns {Promise<String>} - The signed URL.
 */
export const getSignedResumeUrl = async (fileKey) => {
    const command = new GetObjectCommand({
        Bucket: process.env.WASABI_BUCKET_NAME,
        Key: fileKey,
    });

    // Generate signed URL valid for 3600 seconds (1 hour)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return signedUrl;
};
