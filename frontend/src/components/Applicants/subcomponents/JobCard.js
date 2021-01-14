import { useState, useContext, useEffect } from 'react';
import StarRatings from 'react-star-ratings';
import moment from 'moment';
import swal from 'sweetalert';
import axios from 'axios';

import UserContext from '../../../contexts/UserContext';

const JobCard = (props) => {
    const { job } = props;
    const { userData, setUserData } = useContext(UserContext);
    const [hasApplied, setHasApplied] = useState(false);
    const [applying, setApplying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SOP, setSOP] = useState('');

    useEffect(() => {
        if (userData.user.applications.map(application => application.jobId).includes(job._id))
            setHasApplied(true);
    }, [job._id, userData.user.applications]);


    const handleSOPChange = (target) => {
        const wordList = target.value.split(/[\s]+/).slice(0, 250);
        setSOP(wordList.join(' '));
    };

    const handleApply = () => {
        if (userData.user.applications.filter(application => application.status !== "accepted" && application.status !== "rejected").length < 10)
            setApplying(true);
        else
            swal({ title: "Overachiever!", text: "You can't have more than 10 open applications at a time.", icon: "warning" });
    }

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const applicationDate = moment().format();
            const userPerspectiveApplication = {
                jobId: job._id,
                status: "applied",
                applicationDate,
                title: job.title,
                salary: job.salary,
                recruiterName: job.recruiterName
            };
            await axios.post('/api/applicant/addApplication', { newApplication: userPerspectiveApplication }, { headers: { 'auth-token': userData.token } });
            setUserData({ ...userData, user: { ...userData.user, applications: [...userData.user.applications, userPerspectiveApplication] } });
            const jobPerspectiveApplication = {
                jobId: job._id,
                applicantName: `${userData.user.firstName} ${userData.user.lastName}`,
                skills: userData.user.skills,
                applicationDate,
                education: userData.user.education,
                rating: userData.user.ratings,
                sop: SOP,
                status: "applied"
            };
            await axios.post('/api/applicant/addApplicationToJob', { newApplication: jobPerspectiveApplication }, { headers: { 'auth-token': userData.token } });
            setLoading(false);
            setApplying(false);
        }
        catch (err) {
            console.log(err);
        }
    };

    const ratingAvg = job.rating.length ? job.rating.reduce((p, a) => p + a, 0) / job.rating.length : 0;
    return (
        <div className="card col-5 mx-1 my-1 p-0">
            <div className="card-header">
                <div className="row justify-content-between px-2">
                    <p className='ml-1 lead mb-0 pt-1'>{job.title}</p>
                    {
                        applying ?
                            <div>
                                <button className="btn btn-outline-danger mr-1" onClick={() => setApplying(false)}>Cancel</button>
                                {loading ?
                                    <div className="spinner-border spinner-border-sm text-success ml-1" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    :
                                    <button className="btn btn-outline-success ml-1" onClick={handleSubmit}>Submit Application</button>
                                }
                            </div>
                            :
                            (job.applications.length >= job.maxApplications || job.positionsFilled >= job.maxPositions) ?
                                <button className="btn btn-danger" disabled>Full</button> :
                                hasApplied ?
                                    <button className="btn btn-info" disabled>Applied</button> :
                                    <button className="btn btn-outline-success" onClick={handleApply}>Apply</button>
                    }
                </div>
            </div>
            <ul className="list-group list-group-flush">
                {applying ?
                    <div className="form-floating p-3">
                        <label htmlFor="sop"><strong>Statement of Purpose</strong></label>
                        <textarea className="form-control" placeholder="Provide an SOP for your application in at most 250 words" value={SOP} id="sop" style={{ height: "150px" }} onChange={({ target }) => handleSOPChange(target)} />
                    </div> :
                    <li className="list-group-item">
                        <div className="d-flex flex-column align-items-center">
                            <strong>Recruiter Name: </strong>{job.recruiterName}
                            <strong>Recruiter Email: </strong>{job.recruiterEmail}
                            <div className='row'>
                                <StarRatings
                                    rating={ratingAvg}
                                    starRatedColor="black"
                                    numberOfStars={5}
                                    starDimension="20px"
                                    starSpacing="2px"
                                    name='rating'
                                />
                                <p className='pt-1 pl-1'> ({job.rating.length})</p>
                            </div>
                        </div>
                        <div className="row justify-content-around">
                            <span><strong>Salary: </strong>{job.salary}</span>
                            <span><strong>Duration: </strong>{job.duration ? `${job.duration} Months` : "Indefinite"}</span>
                        </div>
                        <p className='text-center mt-3'><strong>Required Skills: </strong>{job.skills.join(", ")}</p>
                        <p className="lead text-center text-danger mt-3">Deadline: {moment(job.deadline).format('LLLL')}</p>
                    </li>

                }
            </ul>
        </div>
    );
};

export default JobCard;