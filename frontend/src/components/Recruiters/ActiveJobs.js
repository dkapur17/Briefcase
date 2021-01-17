import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import swal from 'sweetalert';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import EditableJobListing from './subcomponents/EditableJobListing';

const ActiveJobs = () => {

    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [activeJobs, setActiveJobs] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== 'recruiter')
            history.push('/404');
        const getActiveJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/recruiter/getActiveJobs', { email: userData.user.email }, {
                    headers: { 'auth-token': userData.token }
                });
                setActiveJobs(response.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        getActiveJobs();
    }, [history, userData.token, userData.user, userData.user?.email, userData.user?.type]);

    const handleDelete = async (jobId) => {
        const willDelete = await swal({
            title: "Are you sure?",
            text: "Once deleted this job listing, you will not be able to recover it!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });
        try {
            if (willDelete) {
                setLoading(true);
                const modifiedActiveJobs = activeJobs.filter(job => job._id !== jobId);
                setActiveJobs(modifiedActiveJobs);
                console.log(userData.token);
                const response = await axios.delete('/api/recruiter/deleteJob', {
                    headers: { 'auth-token': userData.token },
                    data: { jobId }
                });
                console.log(response);
                setLoading(false);
            }
        }
        catch (err) {
            console.log(err.response.data.msg);
            setLoading(false);
        }
    };

    return (loading ? <FullPageSpinner /> :
        <div className="container-fluid mt-5 mb-5 px-5">
            <div className="d-flex flex-column align-items-center">
                <h1 className="text-center">Active Job Listings</h1>
                <div className="row justify-content-center mt-3 w-100">
                    {activeJobs.map(job => <EditableJobListing job={job} handleDelete={handleDelete} token={userData.token} key={job._id} />)}
                </div>
            </div>
        </div>
    );
};

export default ActiveJobs;

