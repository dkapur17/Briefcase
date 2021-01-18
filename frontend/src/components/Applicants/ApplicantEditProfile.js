import { useState, useContext } from 'react';
import { generate } from 'shortid';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import swal from 'sweetalert';

import FullPageSpinner from '../General/Layout/FullPageSpinner';

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
    const [resume, setResume] = useState(userData.user.resume);
    const [imageFileName, setImageFileName] = useState("Choose Profile Image");
    const [resumeFileName, setResumeFileName] = useState("Choose Resumé File (Upto 250Kb)");
    const [defaultSkills,] = useState(["HTML", "CSS", "JavaScript", "C++", "Python", "Tensorflow", "C#", "Unity"]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editedUser = { ...(userData.user), firstName, lastName, email, education, skills, image, resume };
        setUserData({ ...userData, user: editedUser });
        setLoading(true);
        try {
            await axios.patch('/api/applicant/editProfile', editedUser, { headers: { 'auth-token': userData.token } });
        }
        catch (err) {
            console.log(err.response.data.msg)
        }
        setLoading(false);
        setIsEditing(false);
    }

    const resizeImage = file => new Promise(resolve => {
        Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0, uri => resolve(uri), 'base64');
    });

    const handleImageChange = async (target) => {
        setImageFileName(target.files[0].name);
        const imageFile = target.files[0];
        const imageString = await resizeImage(imageFile);
        setImage(imageString);
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleResumeChange = async (target) => {
        if (target.files[0].size / 1024 > 250) {
            swal("Unable to upload selected file.", "Please select a file smaller than 250KB.");
            target.value = '';
        }
        else {
            setResumeFileName(target.files[0].name);
            const resumeFile = target.files[0];
            const resumeString = await toBase64(resumeFile);
            setResume(resumeString);
        }
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
        loading ? <FullPageSpinner /> :
            <form className='col-7' onSubmit={handleSubmit}>
                <div className="custom-file mb-4 mt-2">
                    <input type="file" className="custom-file-input" id="image" accept=".png" onChange={({ target }) => handleImageChange(target)} />
                    <label className="custom-file-label" htmlFor="customFile">{imageFileName}</label>
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
                    <input type="text" className="form-control" placeholder="Comma separated values" id="skills" value={skills.join().substr(skills.join()[0] === ',' ? 1 : 0)} onChange={({ target }) => setSkills(target.value.split(','))} />
                    <p>Some default skills you can choose: </p>
                    <div className="row justify-content-center">
                        {defaultSkills.map((skill, i) => skills.map(selectedSkill => selectedSkill.toLowerCase()).includes(skill.toLowerCase()) ?
                            null :
                            <span key={i} className="badge badge-primary mx-1 hoverable-icon" onClick={() => setSkills([...skills, skill])}>{skill}</span>)}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="custom-file mt-2 col-12">
                        <input type="file" className="custom-file-input" id="resume" accept=".pdf" onChange={({ target }) => handleResumeChange(target)} />
                        <label className="custom-file-label" htmlFor="customFile">{resumeFileName}</label>
                    </div>
                    <button type='button' className="btn btn-outline-danger mt-4 mb-2"
                        onClick={() => {
                            swal({ title: "Removing Resumé", text: "Your resumé has been tagged for removal. If you hit \"Cancel\", your current resumé will be preserved. If you hit \"Submit\", the change removal will be applied.", icon: "warning" })
                            setResumeFileName("Choose Resumé File (Upto 1MB)");
                            setResume("");
                        }}
                    >Remove Resumé</button>
                </div>
                <div className="row justify-content-around">
                    <button type="button" className='btn btn-outline-danger' onClick={() => setIsEditing(false)}>Cancel</button>
                    <button type="submit" className="btn btn-outline-success">Submit</button>
                </div>
            </form>
    )
};

export default ApplicantEditProfile;

