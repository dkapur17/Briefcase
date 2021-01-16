import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import UserContext from '../../contexts/UserContext';

const MyApplications = () => {

    const { userData } = useContext(UserContext);
    const history = useHistory();

    useEffect(() => {
        if (!userData.user)
            history.push('/');
        else if (userData.user.type !== "applicant")
            history.push('/404');
    });

    return (
        <div>My Applications</div>
    );
}

export default MyApplications;