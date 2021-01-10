import { useState } from 'react';

const ApplicantEditProfile = (props) => {
    const { userData, setUserData, setIsEditing } = props;
    const [firstName, setFirstName] = useState(userData.user.firstName);
    const [lastName, setLastName] = useState(userData.user.lastName);
    const [email, setEmail] = useState(userData.user.email);
    const [education, setEducation] = useState(userData.user.education);
    const [skills, setSkills] = useState(userData.user.skills);
    const [image, setImage] = useState(userData.user.skills);

    const handleDeleteEducation = (target) => {
        console.log(target.classList[3]);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(firstName, lastName, email, education, skills, image);
    }

    return (
        <form className='col-7'>
            <div className="row justify-content-around">
                <div className="form-group col-6">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="form-control" id="firstName" value={firstName} onChange={({ target }) => setFirstName(target.value)} />
                </div>
                <div className="form-group col-6">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName" value={lastName} onChange={({ target }) => setLastName(target.value)} />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" value={email} onChange={({ target }) => setEmail(target.value)} />
            </div>
            <div className="form-group">
                <label>Education</label>
                <div className="row">
                </div>
            </div>
            <div className="row justify-content-around">
                <button type="button" className='btn btn-outline-danger' onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-outline-success">Submit</button>
            </div>
        </form>
    )
};

export default ApplicantEditProfile;

