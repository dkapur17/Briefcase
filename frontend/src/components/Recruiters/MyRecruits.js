import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

import UserContext from '../../contexts/UserContext';

import FullPageSpinner from '../General/Layout/FullPageSpinner';
import RecruitRow from './subcomponents/RecruitRow';

const MyRecruits = () => {

    const { userData } = useContext(UserContext);
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [recruitList, setRecruitList] = useState([]);
    const [sortOrder, setSortOrder] = useState(-1);

    useEffect(() => {
        if (!userData.user)
            return history.push('/');
        else if (userData.user?.type !== "recruiter")
            return history.push('/404');

        const getRecruitList = async () => {
            try {
                const response = await axios.get('/api/recruiter/getRecruitList', { headers: { 'auth-token': userData.token } });
                setRecruitList(response.data);
                setLoading(false);
            }
            catch (err) {
                console.log(err);
                setLoading(false);
            }
        };

        getRecruitList();

    }, [userData.user, userData.user?.type, history, userData.token]);

    const handleSort = (attr) => {
        setSortOrder(-1 * sortOrder);
        let modifiedRecruitList = recruitList;
        if (attr === "recruitName")
            modifiedRecruitList.sort((a, b) => sortOrder * ('' + a.recruitName).localeCompare(b.recruitName));
        else if (attr === "joiningDate")
            modifiedRecruitList.sort((a, b) => sortOrder * (moment(a.joiningDate).format('X') - moment(b.joiningDate).format('X')));
        else if (attr === "jobType")
            modifiedRecruitList.sort((a, b) => sortOrder * ('' + a.jobType).localeCompare(b.jobType));
        else if (attr === "jobTitle")
            modifiedRecruitList.sort((a, b) => sortOrder * ('' + a.jobTitle).localeCompare(b.jobTitle));
        else
            modifiedRecruitList.sort((a, b) => sortOrder * (a.recruitRating - b.recruitRating));
        setRecruitList(modifiedRecruitList);
    };

    return (
        loading ? <FullPageSpinner /> :
            <div className="container mt-3 mb-5">
                <h1 className="text-center">My Recruits</h1>
                <table className="table table-striped mt-4">
                    <thead className="thead-dark">
                        <tr>
                            <th scope='col'>#</th>
                            <th scope='col'>Name <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("recruitName")} /></th>
                            <th scope='col'>Date of Joining <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("joiningDate")} /></th>
                            <th scope='col'>Job Type <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("jobType")} /></th>
                            <th scope='col'>Job Title <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("jobTitle")} /></th>
                            <th scope='col'>Rating <FontAwesomeIcon className="ml-2 hoverable-icon" icon={faSort} onClick={() => handleSort("recruitRating")} /></th>
                            <th scope='col'>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recruitList.map((recruit, i) => <RecruitRow key={recruit.applicantId} i={i} recruitList={recruitList} setRecruitList={setRecruitList} />)}
                    </tbody>
                </table>
            </div>
    )
};

export default MyRecruits;