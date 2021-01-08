const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/applicant", require('./routes/applicantRouter'));
app.use("/recruiter", require('./routes/recruiterRouter'));

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