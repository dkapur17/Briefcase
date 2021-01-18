import { useContext } from 'react';

import UserContext from '../../contexts/UserContext';

const RecruiterShowProfile = () => {

    const { userData } = useContext(UserContext);
    const { user } = userData;

    return (
        <>
            <img className='mb-2 rounded-circle' src={user.image} alt='profile_image' style={{ height: "100px", width: "100px" }} />
            <div className="row justify-content-center w-100 mt-3">
                <div className="row col-6 justify-content-end pr-4">
                    <h5><strong>Name:</strong></h5>
                </div>
                <div className="row col-6 justify-content-start pl-4">
                    <h5>{user.name}</h5>
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
            <div className="row justify-content-center w-100">
                <div className="row col-6 justify-content-end pr-4">
                    <h5><strong>Contact Number:</strong></h5>
                </div>
                <div className="row col-6 justify-content-start pl-4">
                    <h5>{user.phone}</h5>
                </div>
            </div>
            <h5 className='mt-3'><strong>Bio:</strong></h5>
            <p className='lead px-5 text-justify' >{user.bio}</p>
        </>
    )
};

export default RecruiterShowProfile;