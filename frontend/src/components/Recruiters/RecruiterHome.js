import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import RecruiterShowProfile from './RecruiterShowProfile';
import RecruiterEditProfile from './RecruiterEditProfile';

const RecruiterHome = () => {

    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="container mt-4 mb-5">
            <div className="d-flex flex-column align-items-center">
                <div className="row">
                    <h1 className='mb-4'>{isEditing ? "Edit" : "My"} Profile</h1>
                    {isEditing ? null :
                        <h3 className='ml-3 pt-2'>
                            <FontAwesomeIcon className='hoverable-icon' icon={faPencilAlt} onClick={() => setIsEditing(true)} />
                        </h3>}
                </div>
                {isEditing ? <RecruiterEditProfile setIsEditing={setIsEditing} /> : <RecruiterShowProfile />}
            </div>
        </div>
    )
};

export default RecruiterHome;