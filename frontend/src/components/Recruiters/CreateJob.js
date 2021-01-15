import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';
import FullPageSpinner from '../General/Layout/FullPageSpinner';

const CreateJob = () => {

    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [maxApplications, setMaxApplications] = useState(0);
    const [maxPositions, setMaxPositions] = useState(0);
    const [deadline, setDeadline] = useState(new Date());
    const [skills, setSkills] = useState('');
    const [jobType, setJobType] = useState('fullTime');
    const [duration, setDuration] = useState(0);
    const [salary, setSalary] = useState(0);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== 'recruiter')
            history.push('/404');
    }, [userData.user, history]);

    const handleSubmission = async (e) => {
        try {
            e.preventDefault();
            const deadlineMoment = moment(deadline).format();
            const postDate = moment().format();
            const recruiterName = userData.user.name;
            const recruiterEmail = userData.user.email;
            const recruiterId = userData.user._id;
            const skillArray = skills.split(',');
            const newJob = { title, recruiterName, recruiterEmail, recruiterId, maxApplications, maxPositions, jobType, duration, salary, postDate, skills: skillArray, deadline: deadlineMoment };
            setLoading(true);
            await axios.post('/api/recruiter/createJob', { newJob }, {
                headers: { 'auth-token': userData.token }
            });
            setLoading(false);
            history.push('/activeJobs');

        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    return (
        loading ? <FullPageSpinner /> :
            <div className="container mt-3 mb-5">
                <div className="d-flex flex-column align-items-center">
                    <h1 className="text-center">Create New Job Listing</h1>
                    <form className='col-7' onSubmit={handleSubmission}>
                        <div className="form-group">
                            <label htmlFor="title">Job Title</label>
                            <input required type="text" className="form-control" id="title" value={title} onChange={({ target }) => setTitle(target.value)} />
                        </div>
                        <div className="form-row mb-3">
                            <div className="col ml-1">
                                <label htmlFor="maxApplications">Maximum Applications Accepted</label>
                                <input required type="number" min="1" className="form-control" id="maxApplications" value={maxApplications} onChange={({ target }) => setMaxApplications(target.value)} />
                            </div>
                            <div className="col mr-1">
                                <label htmlFor="maxPositions">Maximum Positions Available</label>
                                <input required type="number" min="1" className="form-control" id="maxPositions" value={maxPositions} onChange={({ target }) => setMaxPositions(target.value)} />
                            </div>
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <label htmlFor="deadline">Application Deadline</label>
                                <DateTimePicker disableClock={true} clearIcon={null} format="dd-MM-y hh:mm a" className='d-block rounded' value={deadline} onChange={setDeadline} />
                            </div>
                            <div className="col mr-1">
                                <label htmlFor="jobType">Job Type</label>
                                <select value={jobType} className="custom-select" id="jobType" onChange={({ target }) => setJobType(target.value)}>
                                    <option value="fullTime">Full Time</option>
                                    <option value="partTime">Part Time</option>
                                    <option value="workFromHome">Work From Home</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="skills">Skills Required</label>
                            <input required type="text" className="form-control" id="skills" placeholder="Comma Seperated Values" value={skills} onChange={({ target }) => setSkills(target.value)} />
                        </div>
                        <div className="form-row mb-3">
                            <div className="col">
                                <label htmlFor="duration">Duration in Months</label><span className="text-muted"> (0→Indefinite)</span>
                                <input required type="number" min="0" max="6" className="form-control" id="duration" value={duration} onChange={({ target }) => setDuration(target.value)} />
                            </div>
                            <div className="col">
                                <label htmlFor="salary">Salary per Month</label><span className="text-muted"> (INR)</span>
                                <input required type="number" min="0" className="form-control" id="salary" value={salary} onChange={({ target }) => setSalary(target.value)} />
                            </div>
                        </div>
                        <div className="row justify-content-between px-3 mt-4">
                            <button type="button" className="btn btn-outline-danger">Cancel</button>
                            <button type="submit" className="btn btn-outline-success">Create Job Listing</button>
                        </div>
                    </form>
                </div>
            </div>
    )
};

export default CreateJob;