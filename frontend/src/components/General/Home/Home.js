import { useContext } from 'react';

import UserContext from '../../../contexts/UserContext';
import LoggedOutHome from './LoggedOutHome';

import ApplicantHome from '../../Applicants/ApplicantHome';
import RecruiterHome from '../../Recruiters/RecruiterHome';

const Home = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="container">
            {!userData.user ? <LoggedOutHome /> : userData.user.type === "applicant" ? <ApplicantHome /> : <RecruiterHome />}
        </div>
    )
};

export default Home;