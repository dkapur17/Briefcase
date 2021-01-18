import { useContext } from 'react';
import StarRatings from 'react-star-ratings';

import UserContext from '../../contexts/UserContext';

const ApplicantShowProfile = () => {

    const { userData } = useContext(UserContext);
    const { user } = userData;

    const instituteList = user.education.map((ed, i) => (<p className='text-center' key={i}>{ed.institute}</p>));
    const fromYearList = user.education.map((ed, i) => (<p className='text-center' key={i}>{ed.from}</p>));
    const toYearList = user.education.map((ed, i) => (<p className='text-center' key={i}>{ed.to ? ed.to : "-"}</p>));
    const skillList = user.skills.map((ed, i) => (<h4 className='mx-1' key={i}><span className="badge badge-pill badge-info">{ed}</span></h4>));
    const ratingAvg = user.ratings.reduce((p, a) => p + a, 0) / Math.max(1, user.ratings.length);

    return (
        <>
            <img className='mb-2 rounded-circle' src={user.image} alt='profile_image' style={{ height: "100px", width: "100px" }} />
            <div className='row mb-2'>
                <StarRatings
                    rating={ratingAvg}
                    starRatedColor="black"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name='rating'
                />
                <p className='pt-1 ml-3'>({user.ratings.length})</p>
            </div>
            <div className="row justify-content-center w-100">
                <div className="row col-6 justify-content-end pr-4">
                    <h5><strong>First Name:</strong></h5>
                </div>
                <div className="row col-6 justify-content-start pl-4">
                    <h5>{user.firstName}</h5>
                </div>
            </div>
            <div className="row justify-content-center w-100">
                <div className="row col-6 justify-content-end pr-4">
                    <h5><strong>Last Name:</strong></h5>
                </div>
                <div className="row col-6 justify-content-start pl-4">
                    <h5>{user.lastName}</h5>
                </div>
            </div>
            <div className="row justify-content-center w-100">
                <div className="row col-6 justify-content-end pr-4">
                    <h5><strong>Email:</strong></h5>
                </div>
                <div className="row col-6 justify-content-start pl-4">
                    <h5>{user.email}</h5>
                </div>
            </div>
            <h4 className='my-3'><strong>Education</strong></h4>
            <div className="row w-100">
                <div className="d-flex flex-column col-4 align-items-center">
                    <h5 className='mb-4'>Insitute Name</h5>
                    {instituteList}
                </div>
                <div className="d-flex flex-column col-4 align-items-center">
                    <h5 className='mb-4'>From (Year)</h5>
                    {fromYearList}
                </div>
                <div className="d-flex flex-column col-4 align-items-center">
                    <h5 className='mb-4'>To (Year)</h5>
                    {toYearList}
                </div>
            </div>
            <h4 className='mb-4'><strong>Skills</strong></h4>
            <div className="row justify-content-center" >
                {skillList}
            </div>
            {user.resume ? <a className='btn btn-outline-info mt-3' download='Resume.pdf' href={user.resume}>Download Resumé</a> : null}
        </>
    )
};

export default ApplicantShowProfile;