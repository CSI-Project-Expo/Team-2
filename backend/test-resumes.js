import mongoose from 'mongoose';
import fs from 'fs';

mongoose.connect('mongodb://127.0.0.1:27017/hiresphere').then(async () => {
    // get a pdf file from uploads
    const files = fs.readdirSync('uploads').filter(f => f.endsWith('.pdf'));
    if (files.length > 0) {
        const url = `/uploads/${files[0]}`;
        const res = await mongoose.connection.db.collection('users').updateOne(
            { role: 'student' }, // update the first student
            { $set: { resumeUrl: url } }
        );
        console.log('Updated user:', res);
    } else {
        console.log('No pdfs found');
    }
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(users.map(u => ({ role: u.role, resume: u.resumeUrl })));
    mongoose.disconnect();
});
