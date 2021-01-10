const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const Recruiter = require('../models/recruiterModel');

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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ msg: "All fields not provided" });

        const recruiter = await Recruiter.findOne({ email });
        if (!recruiter)
            return res.status(400).json({ msg: "This email is not registered" });

        const isMatch = await bcrypt.compare(password, recruiter.password);

        if (!isMatch)
            return res.status(400).json({ msg: "Invalid login credentials" });

        const token = jwt.sign({ id: recruiter._id, type: recruiter.type }, process.env.JWT_SECRET);

        return res.json({ token, recruiter });

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/editProfile', auth, async (req, res) => {
    try {
        const { name, email, phone, bio } = req.body;
        const recruiter = await Recruiter.findByIdAndUpdate((req.user), {
            $set: {
                name,
                email,
                phone,
                bio
            }
        });
        return res.json(recruiter);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
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
        const recruiter = await Recruiter.findById(verified.id);
        if (!recruiter)
            return res.json(null);
        return res.json(recruiter);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;