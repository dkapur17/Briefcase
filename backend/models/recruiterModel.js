const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlen: 5 },
    phone: { type: String, required: true },
    type: { type: String, "default": "recruiter" },
    bio: { type: String, "default": "" },
    ratings: { type: Array, "default": [] },
    jobsListed: { type: Array, "default": [] }
});

module.exports = Recruiter = mongoose.model("recruiter", recruiterSchema);