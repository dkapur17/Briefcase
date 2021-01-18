import { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import ApplicationRow from './subcomponents/ApplicationRow';

const JobApplications = (props) => {
    const jobId = props.match.params.jobId;

    const { userData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [applicationList, setApplicationList] = useState([]);
    const [sortOrder, setSortOrder] = useState(-1);
    const history = useHistory();

    const handleSort = (attr) => {
        setSortOrder(sortOrder === -1 ? 1 : -1);
        let modifiedApplicationList = applicationList;
        if (attr === "applicantName")
            modifiedApplicationList.sort((a, b) => sortOrder * ('' + a.applicantName).localeCompare(b.applicantName));
        else if (attr === "applicationDate")
            modifiedApplicationList.sort((a, b) => sortOrder * (moment(a.applicationDate).format('X') - moment(b.applicationDate).format('X')))
        else
            modifiedApplicationList.sort((a, b) => sortOrder * (a.applicantRating - b.applicantRating));

        setApplicationList(modifiedApplicationList);
    };

    useEffect(() => {

        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== "recruiter")
            history.push('/404');
        const getJobApplications = async () => {
            try {
                const response = await axios.post('/api/recruiter/getJobApplications', { jobId }, { headers: { 'auth-token': userData.token } });
                setApplicationList(response.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        getJobApplications();

    }, [userData.user, userData.user?.type, history, jobId, userData.token]);

    return (
        loading ? <FullPageSpinner /> :
            <div className="container-fluid mt-3 mb-5 px-5">
                <h1 className="text-center">Application List</h1>
                <table className="table mt-5 table-striped">
                    <thead className='thead-dark'>
                        <tr>
                            <th className='text-center' scope="col">#</th>
                            <th className='text-center' scope="col">Name <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("applicantName")} /></th>
                            <th className='text-center' scope="col">Skills</th>
                            <th className='text-center' scope="col">Application Date <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("applicationDate")} /></th>
                            <th className='text-center' scope="col">Education</th>
                            <th className='text-center' scope="col">SOP</th>
                            <th className='text-center' scope="col">Rating <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("applicantRating")} /></th>
                            <th className='text-center' scope="col">Status</th>
                            <th className='text-center' scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicationList.map((app, i) => <ApplicationRow key={app._id} i={i} applicationList={applicationList} />)}
                    </tbody>
                </table>
            </div>
    )
};

export default JobApplications;