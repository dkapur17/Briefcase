import { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';

const ActiveJobs = () => {

    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [activeJobs, setActiveJobs] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const history = useHistory();

    useEffect(() => {
        if (userData.user.type !== 'recruiter')
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
                if (err.response.data.msg)
                    setErrorMessage(err.response.data.msg);
                else if (err.response.data.error)
                    setErrorMessage("Internal Server Error");
                setLoading(false);
            }
        };
        getActiveJobs();
    }, [history, userData.token, userData.user.email, userData.user.type]);

    return (loading ? <FullPageSpinner /> : <pre>{JSON.stringify(activeJobs, null, 2)}</pre>);
};

export default ActiveJobs;

