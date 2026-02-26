import mongoose from 'mongoose';

const jobSchema = mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        companyName: {
            type: String,
            required: true,
        },
        industry: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        salary: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [
            {
                type: String,
            },
        ],
        applicants: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                appliedAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    default: 'Applied',
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);

export default Job;
