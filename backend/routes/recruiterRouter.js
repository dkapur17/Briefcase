const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.patch('/editProfile', auth, async (req, res) => {
    try {

    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

router.post('/validateToken', async (req, res) => {
    try {
        const token = req.header("auth-token");
        if (!token)
            return res.json(false);
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.json(false);
        const applicant = await Applicant.findById(verified.id);
        if (!applicant)
            return res.json(false);
        return res.json(true);
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;