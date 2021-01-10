import { useContext } from 'react';
import { Link } from 'react-router-dom';

import UserContext from '../../../contexts/UserContext';

import LoggedInOptions from './LoggedInOptions';
import LoggedOutOptions from './LoggedOutOptions';

const Navbar = () => {

    const { userData } = useContext(UserContext);

    return (
        <div className="container">
            <nav className="navbar navbar-expand-lg navbar-light px-5">
                <Link className="navbar-brand" to="/">BRIEFCASE</Link>
                <div className="options ml-auto">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav">
                            {userData.user === undefined ? null : userData.user ? <LoggedInOptions /> : <LoggedOutOptions />}
                        </div>
                    </div>
                </div>
            </nav >
        </div>
    )
};

export default Navbar;