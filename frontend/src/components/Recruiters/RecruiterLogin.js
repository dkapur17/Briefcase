import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

const RecruiterLogin = (props) => {

    const { setLoading } = props;
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState();
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            setLoading(true);
            const loggedInUser = await axios.post('/api/recruiter/login', { email, password });
            console.log(loggedInUser);
            setUserData({ token: loggedInUser.data.token, user: loggedInUser.data.recruiter });
            localStorage.setItem("auth-token", loggedInUser.data.token);
            setLoading(false);
            history.push('/');
        }
        catch (err) {
            if (err.response.data.msg)
                setErrorMessage(err.response.data.msg);
        }
    };

    return (
        <form className='col-5 px-5 pb-5 pt-3' onSubmit={handleSubmit}>
            <h3 className='text-center'>Recruiter Login</h3>
            {errorMessage ?
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setErrorMessage("")}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                : null}
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={({ target }) => setEmail(target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={({ target }) => setPassword(target.value)} />
            </div>
            <button type="submit" className="btn btn-outline-success btn-block mt-4">Login</button>
        </form>
    )
};

export default RecruiterLogin;