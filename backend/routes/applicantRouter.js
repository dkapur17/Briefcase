const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const Applicant = require('../models/applicantModel');

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

router.post('/login', async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "All fields not provided" });

        let applicant = await Applicant.findOne({ email });
        if (!applicant)
            return res.status(400).json({ msg: "This email is not registered" });

        const isMatch = await bcrypt.compare(password, applicant.password);

        if (!isMatch)
            return res.status(400).json({ msg: "Invalid login credentials" });

        const token = jwt.sign({ id: applicant._id, type: applicant.type }, process.env.JWT_SECRET);
        applicant.password = undefined;
        return res.json({ token, applicant });
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }

});

router.patch('/editProfile', auth, async (req, res) => {

    try {
        const { firstName, lastName, email, education, skills, image } = req.body;
        const applicant = await Applicant.findByIdAndUpdate(req.user, {
            $set: {
                firstName,
                lastName,
                email,
                education,
                skills,
                image
            }
        });
        return res.json(applicant);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

});

router.post('/getUserData', async (req, res) => {
    try {
        const token = req.header("auth-token");
        if (!token)
            return res.json(null);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.json(null);
        let applicant = await Applicant.findById(verified.id);
        if (!applicant)
            return res.json(null);
        applicant.password = undefined;
        return res.json(applicant);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;