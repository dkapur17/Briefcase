import { NavLink } from 'react-router-dom';

const ApplicantOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-1" exact={true} to='/'>My Profile</NavLink>
            <NavLink className="nav-link mx-1" to="/jobDashboard">Job Dashboard</NavLink>
            <NavLink className="nav-link mx-1" to="/myApplications">My Applications</NavLink>
        </>
    )
};

export default ApplicantOptions;