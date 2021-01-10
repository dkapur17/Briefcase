import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';

import ApplicantOptions from '../../Applicants/ApplicantOptions';
import RecruiterOptions from '../../Recruiters/RecruiterOptions';

const LoggedInOptions = () => {
    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();
    const handleSignOut = () => {
        setUserData({ token: null, user: null });
        localStorage.setItem('auth-token', '');
        history.push('/');
    }

    return (
        <>
            {userData.user.type === "applicant" ? <ApplicantOptions /> : <RecruiterOptions />}
            <button className='btn btn-outline-danger mx-2' onClick={handleSignOut}>Sign Out</button>
        </>
    )
};

export default LoggedInOptions;