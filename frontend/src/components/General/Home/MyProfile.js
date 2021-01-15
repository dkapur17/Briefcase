import { useContext } from 'react';

import UserContext from '../../../contexts/UserContext';
import LoggedOutHome from './LoggedOutHome';

import ApplicantProfile from '../../Applicants/ApplicantProfile';
import RecruiterProfile from '../../Recruiters/RecruiterProfile';

const MyProfile = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="container">
            {!userData.user ? <LoggedOutHome /> : userData.user.type === "applicant" ? <ApplicantProfile /> : <RecruiterProfile />}
        </div>
    )
};

export default MyProfile;