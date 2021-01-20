const router = require('express').Router();
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nodemailer = require('nodemailer');

const auth = require('../middleware/auth');
const Applicant = require('../models/applicantModel');
const Recruiter = require('../models/recruiterModel');
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
    }
});

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
        const applications = await Application.find({ jobId, status: "accepted" }).exec();
        const recruitIds = applications.map(app => app.applicantId);
        const recruiter = await Recruiter.findById(req.user);
        const filteredRecruits = recruiter.recruits.filter(rec => !recruitIds.includes(rec.applicantId));
        await Recruiter.findByIdAndUpdate(req.user, { $set: { recruits: filteredRecruits } });
        await Application.updateMany({ jobId }, { $set: { status: "deleted" } });
        return res.json(response);
    }
    catch (err) {
        console.log(err.message);
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
                applicantRating: applicant.ratings.reduce((p, a) => p + a, 0) / Math.max(1, applicant.ratings.length),
                applicantResume: applicant.resume
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
        await Application.findByIdAndUpdate(applicationId, { $set: { status: "accepted", joiningDate: moment().format() } });

        const job = await Job.findById(jobId);
        const updatedPositionsCount = job.positionsFilled + 1;
        await Job.findByIdAndUpdate(jobId, { $set: { positionsFilled: updatedPositionsCount } });
        if (job.positionsFilled === job.maxPositions - 1)
            await Application.updateMany({ jobId, status: { $ne: "accepted" } }, { $set: { status: "rejected" } });

        const recruiter = await Recruiter.findById(recruiterId);
        const exists = recruiter.recruits.find(rec => rec.applicantId === applicantId);
        if (!exists) {
            const updatedRecruitList = [...recruiter.recruits, { applicantId, rated: false }];
            await Recruiter.findByIdAndUpdate(recruiterId, { $set: { recruits: updatedRecruitList } });
        }

        const applicant = await Applicant.findById(applicantId);
        const mailOptions = {
            from: 'briefcasenotifs@gmail.com',
            to: applicant.email,
            subject: 'Your Application was Accepted!',
            html: `Congratulations ${applicant.firstName}!<br/>Your job appliation for the job posting <strong>${job.title}</strong> has been accepted!`
        };

        await transporter.sendMail(mailOptions);

        return res.send("OK");
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

router.get('/getRecruitList', auth, async (req, res) => {
    try {
        const recruiter = await Recruiter.findById(req.user);
        const modifiedRecruitList = await Promise.all(recruiter.recruits.map(async (recruit) => {
            const applicant = await Applicant.findById(recruit.applicantId);
            const application = await Application.findOne({ recruiterId: req.user, applicantId: applicant._id, status: "accepted" });
            const job = await Job.findById(application.jobId);
            return {
                ...recruit,
                recruitName: `${applicant.firstName} ${applicant.lastName}`,
                recruitRating: applicant.ratings.reduce((p, a) => p + a, 0) / Math.max(1, applicant.ratings.length),
                joiningDate: application.joiningDate,
                jobType: job.jobType,
                jobTitle: job.title
            };
        }));

        return res.json(modifiedRecruitList);
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
});

router.post('/rateRecruit', auth, async (req, res) => {
    try {
        const { applicantId, ratingValue } = req.body;
        const recruiter = await Recruiter.findById(req.user);
        const updatedRecruitList = recruiter.recruits.map(rec => rec.applicantId === applicantId ? { ...rec, rated: true } : rec);
        await Recruiter.findByIdAndUpdate(req.user, { $set: { recruits: updatedRecruitList } });
        const applicant = await Applicant.findById(applicantId);
        await Applicant.findByIdAndUpdate(applicantId, { $set: { ratings: [...applicant.ratings, Number(ratingValue)] } });
        return res.json({ updatedRating: [...applicant.ratings, Number(ratingValue)].reduce((p, a) => p + a, 0) / (applicant.ratings.length + 1) });
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;