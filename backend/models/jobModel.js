const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    recruiterId: { type: String, required: true },
    recruiterName: { type: String, required: true },
    recruiterEmail: { type: String, required: true },
    maxApplications: { type: Number, required: true },
    maxPositions: { type: Number, required: true },
    deadline: { type: String, required: true },
    postDate: { type: String, required: true },
    skills: { type: Array, required: true },
    jobType: { type: String, required: true, },
    duration: { type: Number, required: true },
    salary: { type: Number, required: true },
    rating: { type: Array, "default": [] },
    applicationCount: { type: Number, "default": 0 },
    positionsFilled: { type: Number, "default": 0 }
});

module.exports = Job = mongoose.model("job", jobSchema);