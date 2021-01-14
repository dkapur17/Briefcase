import { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import JobCard from './subcomponents/JobCard';

const JobDashboard = () => {
    const { userData } = useContext(UserContext);
    const [allActiveJobs, setAllActiveJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    useEffect(() => {
        if (userData.user.type !== "applicant")
            history.push('/404');
        const getActiveJobs = async () => {
            try {
                const response = await axios.get('/api/applicant/getActiveJobs', { headers: { 'auth-token': userData.token } });
                setAllActiveJobs(response.data.jobs);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        getActiveJobs();
    }, [userData.token, history, userData.user.type]);
    return (
        loading ? <FullPageSpinner />
            :
            <div className="container mt-3 mb-5">
                <h1 className='text-center mb-5'>New Job Listings</h1>
                <div className="row justify-content-center">
                    {allActiveJobs.map(job => <JobCard job={job} key={job._id} />)}
                </div>
            </div>
    )
}

export default JobDashboard;