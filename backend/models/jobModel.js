const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    recruiterName: { type: String, required: true },
    recruiterEmail: { type: String, required: true },
    maxApplications: { type: Number, required: true },
    maxPositions: { type: Number, required: true },
    deadline: { type: Date, required: true },
    skills: { type: Array, required: true },
    jobType: { type: String, required: true, },
    duration: { type: Number, required: true },
    salary: { type: Number, required: true },
    rating: { type: Array, "default": [] },
    applications: { type: Array, "default": [] }
});

module.exports = jobSchema = mongoose.model("job", jobSchema);