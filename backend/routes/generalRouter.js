const router = require('express').Router();
const { application } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Applicant = require('../models/applicantModel');
const Recruiter = require('../models/recruiterModel');

router.post('/tokenType', (req, res) => {
    try {
        const token = req.header("auth-token");
        if (!token)
            return res.json({ type: null });
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.json({ type: null });
        return res.json({ type: verified.type });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "All fields not provided" });
        let applicant = await Applicant.findOne({ email });
        if (applicant) {
            const isMatch = await bcrypt.compare(password, applicant.password);

            if (!isMatch)
                return res.status(400).json({ msg: "Invalid login credentials" });

            const token = jwt.sign({ id: applicant._id, type: applicant.type }, process.env.JWT_SECRET);
            application.password = undefined;
            return res.json({ token, user: applicant });
        }
        else {
            let recruiter = await Recruiter.findOne({ email });
            if (!recruiter)
                return res.status(400).json({ msg: "This email is not registered" });

            const isMatch = await bcrypt.compare(password, recruiter.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid login credentials" });

            const token = jwt.sign({ id: recruiter._id, type: recruiter.type }, process.env.JWT_SECRET);
            recruiter.password = undefined;
            return res.json({ token, user: recruiter });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;