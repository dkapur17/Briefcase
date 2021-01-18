import { Link } from 'react-router-dom';

const Page404 = () => {
    return <div className="container mt-5 mb-5">
        <h1 className='text-center display-1'>Oops! Looks like we weren't able to find the page you were looking for.</h1>
        <p className="lead text-center mt-5">But we will definitely be able to help you find whatever else you're looking for 😉</p>
        <div className="row justify-content-center">
            <Link className="btn btn-outline-primary mt-3" to='/'>Take me back!</Link>
        </div>
    </div>
};

export default Page404;