import mongoose from 'mongoose';
import fs from 'fs';

mongoose.connect('mongodb://127.0.0.1:27017/hiresphere').then(async () => {
    const files = fs.readdirSync('uploads').filter(f => f.endsWith('.pdf'));
    if (files.length > 0) {
        const url = '/uploads/' + files[0];
        const res = await mongoose.connection.db.collection('users').updateMany(
            { role: 'student' },
            { $set: { resumeUrl: url } }
        );
        console.log('Updated students:', res.modifiedCount);
    } else {
        console.log('No pdfs found');
    }
    mongoose.disconnect();
});
