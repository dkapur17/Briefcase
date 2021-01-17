import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import ApplicationRow from './subcomponents/ApplicationRow';

const MyApplications = () => {

    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [userApplications, setUserApplications] = useState([]);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== "applicant")
            history.push('/404');

        const getUserApplications = async () => {
            try {
                const response = await axios.get('/api/applicant/getAllApplications', { headers: { 'auth-token': userData.token } });
                console.log(response.data);
                setUserApplications(response.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };
        getUserApplications();

    }, [userData.user, userData.user?.type, userData.token, history]);

    return (
        loading ? <FullPageSpinner /> :
            <div className="container-fluid px-5 mt-3 mb-5">
                <h1 className="text-center">My Applications</h1>
                <table className="table mt-5 table-striped">
                    <thead className='thead-dark'>
                        <tr>
                            <th className='text-center' scope="col">#</th>
                            <th className='text-center' scope="col">Title</th>
                            <th className='text-center' scope="col">Date of Joining</th>
                            <th className='text-center' scope="col">Salary</th>
                            <th className='text-center' scope="col">Recruiter Name</th>
                            <th className='text-center' scope="col">Status</th>
                            <th className='text-center' scope="col">Rate Job</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userApplications.map((app, i) => <ApplicationRow key={app._id} app={app} allUserApplications={userApplications} setUserApplications={setUserApplications} i={i} />)}
                    </tbody>
                </table>
            </div>
    );
}

export default MyApplications;