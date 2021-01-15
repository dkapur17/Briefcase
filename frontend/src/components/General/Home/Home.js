import { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';
import LoggedOutHome from './LoggedOutHome';

const Home = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="container">
            {!userData.user ? <LoggedOutHome /> : <Redirect to={userData.user.type === "applicant" ? "/myApplications" : "/activeJobs"} />}
        </div>
    )
};

export default Home;