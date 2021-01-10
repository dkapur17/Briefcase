const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlen: 5 },
    type: { type: String, "default": "applicant" },
    education: { type: Array, "default": [] },
    skills: { type: Array, "default": [] },
    ratings: { type: Array, "default": [] },
    applications: { type: Array, "default": [] }
});

module.exports = Applicant = mongoose.model("applicant", applicantSchema);