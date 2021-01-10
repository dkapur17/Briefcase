import { useContext, useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';

import ApplicantRegister from '../../Applicants/ApplicantRegister';
import RecruiterRegister from '../../Recruiters/RecruiterRegister';

const Register = () => {

    const [userType, setUserType] = useState("Applicant");
    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (userData.user)
            history.push('/');
    });

    return (
        <div className="container mt-3 mb-5">
            <div className="d-flex-column">
                <h1 className='text-center'>Welcome to Briefcase</h1>
                <p className="lead text-center">Choose your role and fill in the required fields</p>
                <div className="row justify-content-center">
                    <ul className="nav nav-tabs col-4 row justify-content-center">
                        <li className="nav-item">
                            <button
                                className={"nav-link " + (userType === 'Applicant' ? "active" : "")}
                                onClick={() => setUserType("Applicant")}>Applicant</button>
                        </li>
                        <li className="nav-item">
                            <button className={"nav-link " + (userType === 'Recruiter' ? "active" : "")}
                                onClick={() => setUserType("Recruiter")}>Recruiter</button>
                        </li>
                    </ul>
                </div>
                <div className="row justify-content-center">
                    {userType === "Applicant" ? <ApplicantRegister /> : <RecruiterRegister />}
                </div>
                <p className="lead text-center">Already on Briefcase? <Link to='/login'>Log In</Link></p>
            </div>
        </div>
    )
};

export default Register;