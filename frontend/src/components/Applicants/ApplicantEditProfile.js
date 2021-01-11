import { useState, useContext } from 'react';
import { generate } from 'shortid';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

const ApplicantEditProfile = (props) => {
    const { setIsEditing } = props;
    const { userData, setUserData } = useContext(UserContext);
    const [firstName, setFirstName] = useState(userData.user.firstName);
    const [lastName, setLastName] = useState(userData.user.lastName);
    const [email, setEmail] = useState(userData.user.email);
    const [education, setEducation] = useState(userData.user.education);
    const [skills, setSkills] = useState(userData.user.skills);
    const [image, setImage] = useState(userData.user.image);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editedUser = { ...(userData.user), firstName, lastName, email, education, skills, image }
        setUserData({ ...userData, user: editedUser });
        try {
            const res = await axios.patch('/api/applicant/editProfile', editedUser, { headers: { 'auth-token': userData.token } });
            console.log(res.data);
        }
        catch (err) {
            console.log(err.response.data.msg)
        }
        setIsEditing(false);
    }

    const resizeImage = file => new Promise(resolve => {
        Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0, uri => resolve(uri), 'base64');
    });

    const handleImageChange = async (target) => {
        const imageFile = target.files[0];
        const imageString = await resizeImage(imageFile);
        console.log(imageString);
        await setImage(imageString);
    }

    const educationInputList = education.map((ed) =>

        <div className="form-row my-2" key={ed.id}>
            <div className="col">
                <input type="text" className={`form-control`} required placeholder="Institution" value={ed.institute} onChange={({ target }) => {
                    const institute = target.value;
                    setEducation(currentEducation => currentEducation.map(entry => entry.id === ed.id ? { ...entry, institute } : entry))
                }} />
            </div>
            <div className="col">
                <input type="text" className={`form-control`} pattern="[0-9]{4}" onInput={({ target }) => target.setCustomValidity("")} onInvalid={({ target }) => target.setCustomValidity("Please enter a valid year")} required placeholder="From (YYYY)" value={ed.from} onChange={({ target }) => {
                    const fromYear = target.value;
                    setEducation(currentEducation => currentEducation.map(entry => entry.id === ed.id ? { ...entry, from: fromYear } : entry));
                }} />
            </div>
            <div className="col">
                <input type="text" className={`form-control`} pattern="[0-9]{4}" onInput={({ target }) => target.setCustomValidity("")} onInvalid={({ target }) => target.setCustomValidity("Please enter a valid year")} placeholder="To (YYYY) (Optional)" value={ed.to} onChange={({ target }) => {
                    const to = target.value;
                    setEducation(currentEducation => currentEducation.map(entry => entry.id === ed.id ? { ...entry, to } : entry));
                }} />
            </div>
            <button type="button" className={`btn btn-danger rounded-circle`} onClick={() => {
                setEducation(currentEducation => currentEducation.filter(entry => entry.id !== ed.id));
            }} >✕</button>
        </div >

    )

    return (
        <form className='col-7' onSubmit={handleSubmit}>
            <div className="custom-file mb-4 mt-2">
                <input type="file" className="custom-file-input" id="image" accept=".png" onChange={({ target }) => handleImageChange(target)} />
                <label className="custom-file-label" htmlFor="customFile">Choose Profile Image</label>
            </div>
            <div className="row justify-content-around">
                <div className="form-group col-6">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" className="form-control" id="firstName" required value={firstName} onChange={({ target }) => setFirstName(target.value)} />
                </div>
                <div className="form-group col-6">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" className="form-control" id="lastName" required value={lastName} onChange={({ target }) => setLastName(target.value)} />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" required value={email} onChange={({ target }) => setEmail(target.value)} />
            </div>
            <div className="form-group">
                <div className="row justify-content-between px-3">
                    <label>Education</label>
                </div>
                {educationInputList}
                <div className="row justify-content-end mt-3 pr-3">
                    <button type='button' className='btn btn-primary' onClick={() => setEducation(currentEducation => [...currentEducation, { id: generate(), institute: "", from: "", to: "" }])}>Add Entry</button>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <input type="text" className="form-control" placeholder="Comma separated values" id="skills" value={skills.join()} onChange={({ target }) => setSkills(target.value.split(','))} />
            </div>
            <div className="row justify-content-around">
                <button type="button" className='btn btn-outline-danger' onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-outline-success">Submit</button>
            </div>
        </form>
    )
};

export default ApplicantEditProfile;

