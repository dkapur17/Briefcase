import { NavLink } from 'react-router-dom';

const RecruiterOptions = () => {
    return (
        <>
            <NavLink className="nav-link mx-2" to='/ro1'>RO1</NavLink>
            <NavLink className="nav-link mx-2" to="/ro2">RO2</NavLink>
        </>
    )
};

export default RecruiterOptions;