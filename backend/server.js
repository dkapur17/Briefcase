const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use("/api/applicant", require('./routes/applicantRouter'));
app.use("/api/recruiter", require('./routes/recruiterRouter'));
app.use("/api/general", require('./routes/generalRouter'));

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    err => {
        if (err)
            throw err;
        else
            console.log("Connection to MongoDB established successfully!");
    });

app.listen(port, () => console.log(`Server Listening on port ${port}`));