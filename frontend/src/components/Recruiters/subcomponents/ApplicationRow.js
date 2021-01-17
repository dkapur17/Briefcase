import { useState, useContext } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import StarRatings from 'react-star-ratings';
import axios from 'axios';

import UserContext from '../../../contexts/UserContext';

const ApplicationRow = (props) => {
    const { i, applicationList } = props;
    const [app, setApp] = useState(applicationList[i]);
    const { userData, setUserData } = useContext(UserContext);

    const modifyStatus = async (newStatus) => {
        try {
            await axios.post('/api/recruiter/setApplicationStatus', { appId: app._id, status: newStatus }, { headers: { 'auth-token': userData.token } });
            setApp({ ...app, status: newStatus });
        }
        catch (err) {
            console.log(err);
        }
    };

    const handleAccept = async () => {
        try {
            await axios.post('/api/recruiter/acceptApplication', { applicationId: app._id, applicantId: app.applicantId, jobId: app.jobId, recruiterId: app.recruiterId }, { headers: { 'auth-token': userData.token } });
            setApp({ ...app, status: 'accepted' });
            setUserData({ ...userData, user: { ...userData.user, recruits: [...userData.user.recruits, { applicantId: app.applicantId, rated: false }] } });
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <tr>
            <th className='text-center' scope="row">{i + 1}</th>
            <td className='text-center'>{app.applicantName}</td>
            <td className='text-center'>{app.applicantSkills.join(', ')}</td>
            <td className='text-center'>{moment(app.applicationDate).format('L')}</td>
            <td className="text-center">
                <div className="d-flex flex-column align-items-center">
                    {app.applicantEducation.length ? app.applicantEducation.map(ed => <span key={ed.id}>{`${ed.institute} (${ed.from}-${ed.to ? ed.to : " "})`}</span>) : "-"}
                </div>
            </td>
            <td className="text-center">
                <button className="btn btn-outline-primary" onClick={() => swal({ title: `${app.applicantName}'s Statement of Purpose`, text: app.applicantSOP })}>View SOP</button>
            </td>
            <td className="class">
                <StarRatings
                    rating={app.applicantRating}
                    starRatedColor="black"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name='rating'
                />
            </td>
            <td className={`text-center text-${{ applied: "info", shortlisted: "warning", accepted: "success", rejected: "danger", deleted: "secondary" }[app.status]}`}>{app.status.toUpperCase()}</td>
            {
                app.status === "applied" ?
                    <td className="text-center">
                        <div className='d-flex flex-column align-items-center my-1'>
                            <button className="btn btn-outline-warning mt-1" onClick={() => modifyStatus("shortlisted")}>Shortlist</button>
                            <button className="btn btn-outline-danger mb-1" onClick={() => modifyStatus("rejected")}>Reject</button>
                        </div>
                    </td> :
                    app.status === "shortlisted" ?
                        <td className="text-center">
                            <div className='d-flex flex-column align-items-center my-1'>
                                <button className="btn btn-outline-success mt-1" onClick={handleAccept}>Accept</button>
                                <button className="btn btn-outline-danger mb-1" onClick={() => modifyStatus("rejected")}>Reject</button>
                            </div>
                        </td>
                        : <td />
            }
        </tr>
    );
}

export default ApplicationRow;