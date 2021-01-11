import { useState, useContext } from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';

import UserContext from '../../contexts/UserContext';

const RecruiterEditProfile = (props) => {

    const { setIsEditing } = props;
    const { userData, setUserData } = useContext(UserContext);
    const [name, setName] = useState(userData.user.name);
    const [email, setEmail] = useState(userData.user.email);
    const [phone, setPhone] = useState(userData.user.phone);
    const [bio, setBio] = useState(userData.user.bio);
    const [image, setImage] = useState(userData.user.image);

    const resizeImage = file => new Promise(resolve => {
        Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0, uri => resolve(uri), 'base64');
    });

    const handleImageChange = async (target) => {
        const imageFile = target.files[0];
        const imageString = await resizeImage(imageFile);
        console.log(imageString);
        await setImage(imageString);
    }

    const handleBioChange = (target) => {
        const wordList = target.value.split(/[\s]+/).slice(0, 250);
        setBio(wordList.join(' '));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const editedUser = { ...(userData.user), name, email, phone, bio, image };
        setUserData({ ...userData, user: editedUser });
        try {
            await axios.patch('/api/recruiter/editProfile', editedUser, { headers: { 'auth-token': userData.token } });
        }
        catch (err) {
            console.log(err.response.data.msg);
        }
        setIsEditing(false);
    }

    return (

        <form className="col-7" onSubmit={handleSubmit}>
            <div className="custom-file mb-4 mt-2">
                <input type="file" className="custom-file-input" id="image" accept=".png" onChange={({ target }) => handleImageChange(target)} />
                <label className="custom-file-label" htmlFor="customFile">Choose Profile Image</label>
            </div>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" className="form-control" id="name" required value={name} onChange={({ target }) => setName(target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" className="form-control" id="email" required value={email} onChange={({ target }) => setEmail(target.value)} />
            </div>
            <div className="form-group">
                <label htmlFor="phone">Contact Number</label>
                <input type="text" className="form-control" id="phone" required value={phone} pattern="[0-9]{10}" onInput={({ target }) => target.setCustomValidity("")} onInvalid={({ target }) => target.setCustomValidity("Contact Number must be 10 digits long")} onChange={({ target }) => setPhone(target.value)} />
            </div>
            <div className="form-floating">
                <label htmlFor="bio">Bio</label>
                <textarea className="form-control" placeholder="Tell us about your self in upto 250 words" value={bio} id="bio" style={{ height: "100px" }} onChange={({ target }) => handleBioChange(target)} />
            </div>
            <div className="row justify-content-around mt-3">
                <button type="button" className='btn btn-outline-danger' onClick={() => setIsEditing(false)}>Cancel</button>
                <button type="submit" className="btn btn-outline-success">Submit</button>
            </div>
        </form>

    )
};

export default RecruiterEditProfile;