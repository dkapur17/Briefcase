const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const Applicant = require('../models/applicantModel');
const Recruiter = require('../models/recruiterModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        if (!name || !email || !phone || !password || !confirmPassword)
            return res.status(400).json({ msg: "All fields not provided!" });
        if (password.length < 5)
            return res.status(400).json({ msg: "Password not be shorter than 5 characters" });
        if (password !== confirmPassword)
            return res.status(400).json({ msg: "Passwords don't match" });

        const existingRecruiter = await Recruiter.findOne({ email });
        if (existingRecruiter)
            return res.status(400).json({ msg: "Account with this email already exists" });
        else {
            const existingApplicant = await Applicant.findOne({ email });
            if (existingApplicant)
                return res.status(400).json({ msg: "Account with this email already exists" });
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newRecruiter = Recruiter({ name, email, phone, password: passwordHash });
        const savedRecruiter = await newRecruiter.save();
        return res.json(savedRecruiter);

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/editProfile', auth, async (req, res) => {
    try {
        const { name, email, phone, bio, image } = req.body;
        const recruiter = await Recruiter.findByIdAndUpdate((req.user), {
            $set: { name, email, phone, bio, image }
        });
        return res.json(recruiter);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/getUserData', auth, async (req, res) => {
    try {
        let recruiter = await Recruiter.findById(req.user);
        if (!recruiter)
            return res.json(null);
        recruiter.password = undefined;
        return res.json(recruiter);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/createJob', auth, async (req, res) => {
    try {
        const { newJob } = req.body;
        console.log(newJob);
        const newJobItem = Job(newJob);
        const savedJob = await newJobItem.save();
        return res.json(savedJob);
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.post('/getActiveJobs', auth, async (req, res) => {
    try {
        const jobsListed = await Job.find({ recruiterId: req.user }).exec();
        const activeJobs = jobsListed.filter(job => job.positionsFilled < job.maxPositions);
        return res.json(activeJobs);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.delete('/deleteJob', auth, async (req, res) => {
    try {
        const { jobId } = req.body;
        const response = await Job.findByIdAndDelete(jobId);
        await Application.updateMany({ jobId }, { $set: { status: "deleted" } });
        return res.json(response);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/editJob', auth, async (req, res) => {
    try {
        const { editedJob } = req.body;
        const modifiedJob = await Job.findByIdAndUpdate(editedJob._id, editedJob);
        return res.json(modifiedJob);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/getJobApplications', auth, async (req, res) => {
    try {
        const { jobId } = req.body;
        const applications = await Application.find({ jobId, status: { $ne: "rejected" } }).exec();
        const applicationsWithExtraInfo = await Promise.all(applications.map(async (app) => {
            const applicant = await Applicant.findById(app.applicantId);
            return {
                ...app._doc,
                applicantName: `${applicant.firstName} ${applicant.lastName}`,
                applicantSkills: applicant.skills,
                applicantEducation: applicant.education,
                applicantRating: applicant.ratings.reduce((p, a) => p + a, 0) / Math.max(1, applicant.ratings.length)
            };
        }));
        return res.json(applicationsWithExtraInfo);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/setApplicationStatus', auth, async (req, res) => {
    try {
        const { appId, status } = req.body;
        await Application.findByIdAndUpdate(appId, { $set: { status } });
        return res.send("OK");
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/acceptApplication', auth, async (req, res) => {
    try {
        const { applicationId, applicantId, jobId, recruiterId } = req.body;
        await Application.updateMany({ applicantId, status: { $ne: "deleted" } }, { $set: { status: "rejected" } });
        await Application.findByIdAndUpdate(applicationId, { $set: { status: "accepted" } });

        const job = await Job.findById(jobId);
        const updatedPositionsCount = job.positionsFilled + 1;
        await Job.findByIdAndUpdate(jobId, { $set: { positionsFilled: updatedPositionsCount } });

        const recruiter = await Recruiter.findById(recruiterId);
        const updatedRecruitList = [...recruiter.recruits, { applicantId, rated: false }];
        await Recruiter.findByIdAndUpdate(recruiterId, { $set: { recruits: updatedRecruitList } });

        return res.send("OK");
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;