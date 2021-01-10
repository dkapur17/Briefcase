const router = require('express').Router();
const jwt = require('jsonwebtoken');

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

module.exports = router;