import { NavLink } from 'react-router-dom';

const RecruiterOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-2" to="/activeJobs">Active Job Listings</NavLink>
            <NavLink className="nav-link mx-2" to='/createJob'>Create Job Listing</NavLink>
            <NavLink className="nav-link mx-2" to="/myRecruits">Recruits</NavLink>
            <NavLink className="nav-link mx-2" to='/myProfile'>My Profile</NavLink>
        </>
    )
};

export default RecruiterOptions;