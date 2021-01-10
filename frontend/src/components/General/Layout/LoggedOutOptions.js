import { NavLink } from 'react-router-dom';
const LoggedOutOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-2" to="/login">Login</NavLink>
            <NavLink className="nav-link mx-2" to="/register">Register</NavLink>
        </>
    )
};

export default LoggedOutOptions;