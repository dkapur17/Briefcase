import ApplicantOptions from '../../Applicants/ApplicantOptions';
import RecruiterOptions from '../../Recruiters/RecruiterOptions';

const LoggedInOptions = () => {
    return (
        <>
            <ApplicantOptions />
            <RecruiterOptions />
            <button className='btn btn-outline-danger mx-2'>Sign Out</button>
        </>
    )
};

export default LoggedInOptions;