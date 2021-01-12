import { useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';

import ApplicantLogin from '../../Applicants/ApplicantLogin';
import RecruiterLogin from '../../Recruiters/RecruiterLogin';

const Login = () => {

    const [userType, setUserType] = useState("applicant");
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user)
            history.push('/');
    });

    return (
        <div className="container mt-3">
            <div className="d-flex-column">
                <h1 className='text-center'>Welcome Back</h1>
                <p className="lead text-center">Choose your role and enter login credentials</p>
                <div className="row justify-content-center">
                    <ul className="nav nav-tabs col-4 row justify-content-center">
                        <li className="nav-item">
                            <button
                                className={"nav-link " + (userType === 'applicant' ? "active" : "")}
                                onClick={() => setUserType("applicant")}>Applicant</button>
                        </li>
                        <li className="nav-item">
                            <button className={"nav-link " + (userType === 'recruiter' ? "active" : "")}
                                onClick={() => setUserType("recruiter")}>Recruiter</button>
                        </li>
                    </ul>
                </div>
                <div className="row justify-content-center">
                    {userType === "applicant" ? <ApplicantLogin /> : <RecruiterLogin />}
                </div>
                <p className="lead text-center">New to Briefcase? <Link to='/register'>Join now!</Link></p>
            </div>
        </div>
    )
};

export default Login;