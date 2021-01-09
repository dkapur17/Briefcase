import { NavLink } from 'react-router-dom';

const ApplicantOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-1" to='/ao1'>AO1</NavLink>
            <NavLink className="nav-link mx-1" to="/ao2">AO2</NavLink>
        </>
    )
};

export default ApplicantOptions;