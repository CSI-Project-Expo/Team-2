import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
dotenv.config();

// Ensure all required variables are present
if (!process.env.WASABI_ACCESS_KEY || !process.env.WASABI_SECRET_KEY || !process.env.WASABI_REGION) {
    console.warn("Wasabi Hot Cloud Storage credentials missing. Resume uploads to S3 will fail.");
}

const s3Client = new S3Client({
    region: process.env.WASABI_REGION || 'us-east-1',
    endpoint: `https://s3.${process.env.WASABI_REGION || 'us-east-1'}.wasabisys.com`,
    credentials: {
        accessKeyId: process.env.WASABI_ACCESS_KEY || '',
        secretAccessKey: process.env.WASABI_SECRET_KEY || ''
    }
});

export default s3Client;
