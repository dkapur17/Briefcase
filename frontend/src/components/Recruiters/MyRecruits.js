import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';

const MyRecruits = () => {

    const { userData, setUserData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== "recruiter")
            history.push('/404');
    }, [userData.user, userData.user?.type, history]);

    return (
        <div className="container mt-3 mb-5">
            <h1 className="text-center">My Recruits</h1>
        </div>
    )
};

export default MyRecruits;