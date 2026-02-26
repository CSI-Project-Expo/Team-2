import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/hiresphere').then(async () => {
    const jobs = await mongoose.connection.db.collection('jobs').find({ 'applicants.0': { $exists: true } }).toArray();
    console.dir(jobs, { depth: null });
    mongoose.disconnect();
});
