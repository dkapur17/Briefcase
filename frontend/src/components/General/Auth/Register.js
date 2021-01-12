import { useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';

import ApplicantRegister from '../../Applicants/ApplicantRegister';
import RecruiterRegister from '../../Recruiters/RecruiterRegister';

const Register = () => {

    const [userType, setUserType] = useState("applicant");
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user)
            history.push('/');
    });

    return (
        <div className="container mt-3 mb-5">
            <div className="d-flex flex-column">
                <h1 className='text-center'>Welcome to Briefcase</h1>
                <p className="lead text-center">Choose your role and fill in the required fields</p>
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
                    {userType === "applicant" ? <ApplicantRegister /> : <RecruiterRegister />}
                </div>
                <p className="lead text-center">Already on Briefcase? <Link to='/login'>Log In</Link></p>
            </div>
        </div>
    )
};

export default Register;