const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlen: 5 },
    role: { type: String, "default": "Applicant" },
    education: { type: Array, "default": [] },
    skills: { type: Array, "default": [] },
    rating: { type: Number, "default": 0 },
    ratingCount: { type: Number, "default": 0 },
    applications: { type: Array, "default": [] },
});

module.exports = Applicant = mongoose.model("applicant", applicantSchema);