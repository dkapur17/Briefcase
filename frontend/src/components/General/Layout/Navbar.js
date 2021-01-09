import { Link } from 'react-router-dom';

import LoggedInOptions from './LoggedInOptions';
import LoggedOutOptions from './LoggedOutOptions';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-5">
            <Link className="navbar-brand" to="/">Navbar</Link>
            <div className="options ml-auto">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                    <div className="navbar-nav">
                        <LoggedOutOptions />
                        <LoggedInOptions />
                    </div>
                </div>
            </div>
        </nav >
    )
};

export default Navbar;