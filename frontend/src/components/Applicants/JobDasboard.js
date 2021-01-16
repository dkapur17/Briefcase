import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Fuse from 'fuse.js';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import JobCard from './subcomponents/JobCard';

const JobDashboard = () => {
    const { userData } = useContext(UserContext);
    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [visibleJobs, setVisibleJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchString, setSearchString] = useState("");
    const [sortStyle, setSortStyle] = useState({ attr: "none", order: "asc" });
    const [jobType, setJobType] = useState("any");
    const [salaryRange, setSalaryRange] = useState([0, Infinity]);
    const [durationUpperLimit, setDurationUpperLimit] = useState(7);
    const [userApplicationList, setUserApplicationList] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== "applicant")
            history.push('/404');
        const makeInitialAPICalls = async () => {
            try {
                let response = await axios.get('/api/applicant/getActiveJobs', { headers: { 'auth-token': userData.token } });
                setAllActiveJobs(response.data.jobs);
                setVisibleJobs(response.data.jobs);
                response = await axios.get('/api/applicant/getAllApplications', { headers: { 'auth-token': userData.token } });
                setUserApplicationList(response.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        makeInitialAPICalls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    useEffect(() => {
        // Search

        const fuzzyOptions = { includeScore: true, keys: ['title'] };
        const fuse = new Fuse(allActiveJobs, fuzzyOptions);
        const fuzzyResult = fuse.search(searchString);
        let filteredList = searchString ? fuzzyResult.map(fuzzyItem => fuzzyItem.refIndex).map(index => allActiveJobs[index]) : allActiveJobs;

        // JobType
        filteredList = filteredList.filter(job => jobType === "any" ? true : job.jobType === jobType);

        // Salary
        filteredList = filteredList.filter(job => job.salary >= salaryRange[0] && job.salary <= salaryRange[1]);

        // Duration
        filteredList = filteredList.filter(job => job.duration < durationUpperLimit);

        // Sorting
        filteredList = filteredList.map(job => ({ ...job, ratingVal: job.rating.length ? job.rating.reduce((p, a) => p + a, 0) / job.rating.length : 0 }));
        filteredList.sort((a, b) => sortStyle.attr === "none" ? null : (sortStyle.order === "asc" ? 1 : -1) * (a[sortStyle.attr] - b[sortStyle.attr]));

        setVisibleJobs(filteredList);
    }, [searchString, jobType, salaryRange, durationUpperLimit, sortStyle, allActiveJobs]);

    return (
        loading ? <FullPageSpinner />
            :
            <div className="container mt-3 mb-5">
                <h1 className='text-center mb-5'>New Job Listings</h1>
                <div className="row mb-4">
                    <div className="card col-12">
                        <div className="card-body">
                            <p className="lead text-center">Search, Sort and Filter</p>
                            <div className="form-group">
                                <label htmlFor="titleSeacrch"><strong>Search for a job title: </strong></label>
                                <input type="text" id="titleSearch" className='form-control' value={searchString} onChange={({ target }) => setSearchString(target.value)} />
                            </div>
                            <div className="row">
                                <div className="form-group col-3">
                                    <label htmlFor="jobType">Job Type</label>
                                    <select value={jobType} onChange={({ target }) => setJobType(target.value)} className="custom-select">
                                        <option value="any">Any</option>
                                        <option value="fullTime">Full Time</option>
                                        <option value="partTime">Part Time</option>
                                        <option value="workFromHome">Work From Home</option>
                                    </select>
                                </div>
                                <div className="form-group col-3">
                                    <label htmlFor="salaryRange">Salary</label>
                                    <div className="row justify-content-around">
                                        <input type="number" placeholder='Min' className='form-control col-5' value={salaryRange[0] === 0 ? "" : salaryRange[0]} onChange={({ target }) => setSalaryRange([target.value === "" ? 0 : Number(target.value), salaryRange[1]])} />
                                        <input type="number" placeholder='Max' className='form-control col-5' value={salaryRange[1] === Infinity ? "" : salaryRange[1]} onChange={({ target }) => setSalaryRange([salaryRange[0], target.value === "" ? Infinity : Number(target.value)])} />
                                    </div>
                                </div>
                                <div className="form-group col-2">
                                    <label htmlFor="duartion">Duration Upper Limit</label>
                                    <select value={durationUpperLimit} onChange={({ target }) => setDurationUpperLimit(Number(target.value))} className="custom-select">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                    </select>
                                </div>
                                <div className="form-group col-4">
                                    <label htmlFor="sort">Sorting Options</label>
                                    <div className="row justify-content-around">
                                        <select value={sortStyle.attr} onChange={({ target }) => setSortStyle({ ...sortStyle, attr: target.value })} className="custom-select col-5">
                                            <option value="none">None</option>
                                            <option value="salary">Salary</option>
                                            <option value="duration">Duration</option>
                                            <option value="ratingVal">Rating</option>
                                        </select>
                                        <select value={sortStyle.order} onChange={({ target }) => setSortStyle({ ...sortStyle, order: target.value })} className="custom-select col-5">
                                            <option value="asc">Ascending</option>
                                            <option value="dsc">Descending</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    {
                        visibleJobs.length ?
                            visibleJobs.map(job => <JobCard job={job} key={job._id} userApplicationList={userApplicationList} setUserApplicationList={setUserApplicationList} />) :
                            <h1 className='display-3 text-center'>Looks like there aren't any jobs matching the search criteria 😢</h1>
                    }
                </div>
            </div>
    )
}

export default JobDashboard;