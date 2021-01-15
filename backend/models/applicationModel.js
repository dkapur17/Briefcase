const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicantId: { type: String, required: true },
    applicantName: { type: String, required: true },
    applicantSkills: { type: Array, required: true },
    applicantEducation: { type: Array, required: true },
    applicationDate: { type: String, required: true },
    recruiterId: { type: String, required: true },
    recruiterName: { type: String, required: true },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobSalary: { type: Number, required: true },
    applicantSOP: { type: String, required: true },
    ratings: { type: Array, "default": [] },
    status: { type: String, required: true }
});

module.exports = Application = mongoose.model("application", applicationSchema);