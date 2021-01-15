import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import ApplicantShowProfile from './ApplicantShowProfile';
import ApplicantEditProfile from './ApplicantEditProfile';

const ApplicantProfile = () => {

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
                {isEditing ? <ApplicantEditProfile setIsEditing={setIsEditing} /> : <ApplicantShowProfile />}
            </div>
        </div>
    )
};

export default ApplicantProfile;