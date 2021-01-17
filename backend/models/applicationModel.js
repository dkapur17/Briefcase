const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    applicantId: { type: String, required: true },
    applicationDate: { type: String, required: true },
    ratedByApplicant: { type: Boolean, "default": false },
    recruiterId: { type: String, required: true },
    joiningDate: { type: String },
    jobId: { type: String, required: true },
    jobTitle: { type: String, required: true },
    jobSalary: { type: Number, required: true },
    applicantSOP: { type: String, required: true },
    ratings: { type: Array, "default": [] },
    status: { type: String, required: true }
});

module.exports = Application = mongoose.model("application", applicationSchema);