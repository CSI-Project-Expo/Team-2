import mongoose from 'mongoose';
import User from './backend/models/User.js';

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/hiresphere');
    const users = await User.find({ role: 'student' }).select('email resumeUrl');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
}
main();
