const router = require('express').Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');

const auth = require('../middleware/auth');
const Applicant = require('../models/applicantModel');
const Recruiter = require('../models/recruiterModel');
const Job = require('../models/jobModel');
const { json } = require('express');
const recruiterModel = require('../models/recruiterModel');

router.post('/register', async (req, res) => {

    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (!email || !password || !firstName || !lastName || !confirmPassword)
            return res.status(400).json({ msg: "All fields not provided" });
        if (password.length < 5)
            return res.status(400).json({ msg: "Password must not be shorter than 5 characters" });
        if (password !== confirmPassword)
            return res.status(400).json({ msg: "Passwords don't match" });

        const existingApplicant = await Applicant.findOne({ email });
        if (existingApplicant)
            return res.status(400).json({ msg: "Account with this email already exists" });
        else {
            const existingRecruiter = await Recruiter.findOne({ email });
            if (existingRecruiter)
                return res.status(400).json({ msg: "Account with this email already exists" });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newApplicant = Applicant({ firstName, lastName, email, password: passwordHash });
        const savedApplicant = await newApplicant.save();
        return res.json(savedApplicant);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }

});

router.patch('/editProfile', auth, async (req, res) => {
    try {
        const { firstName, lastName, email, education, skills, image, resume } = req.body;
        const applicant = await Applicant.findByIdAndUpdate(req.user, {
            $set: { firstName, lastName, email, education, skills, image, resume }
        });
        return res.json(applicant);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/getUserData', auth, async (req, res) => {
    try {
        let applicant = await Applicant.findById(req.user);
        if (!applicant)
            return res.json(null);
        applicant.password = undefined;
        return res.json(applicant);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getActiveJobs', auth, async (req, res) => {
    try {
        const jobs = await Job.find({}).exec();
        const activeJobs = jobs.filter(job => moment(job.deadline) > moment());
        return res.json({ jobs: activeJobs });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/addApplication', auth, async (req, res) => {
    try {
        const { newApplication } = req.body;
        const applicant = await Applicant.findById(req.user);
        const modifiedApplicationsList = [...applicant.applications, newApplication];
        await Applicant.findByIdAndUpdate(req.user, {
            $set: { applications: modifiedApplicationsList }
        });
        return res.send("OK");

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/addApplicationToJob', auth, async (req, res) => {
    try {
        const { newApplication } = req.body;
        const currentJob = await Job.findById(newApplication.jobId);
        const modifiedApplicationsList = [...currentJob.applications, newApplication];
        await Job.findByIdAndUpdate(newApplication.jobId, {
            $set: { applications: modifiedApplicationsList }
        });
        return res.json("OK");
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;