import { useContext } from 'react';

import UserContext from '../../../contexts/UserContext';

import ApplicantProfile from '../../Applicants/ApplicantProfile';
import RecruiterProfile from '../../Recruiters/RecruiterProfile';
import { Redirect } from 'react-router-dom';

const MyProfile = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="container">
            {!userData.user ? <Redirect to='/' /> : userData.user.type === "applicant" ? <ApplicantProfile /> : <RecruiterProfile />}
        </div>
    )
};

export default MyProfile;