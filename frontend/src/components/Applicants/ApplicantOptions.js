import { NavLink } from 'react-router-dom';

const ApplicantOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-1" to="/myApplications">My Applications</NavLink>
            <NavLink className="nav-link mx-1" to="/jobDashboard">Job Dashboard</NavLink>
            <NavLink className="nav-link mx-1" to='/myProfile'>My Profile</NavLink>
        </>
    )
};

export default ApplicantOptions;