import { useState, useContext } from 'react';
import moment from 'moment';
import swal from 'sweetalert';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

import UserContext from '../../../contexts/UserContext';

const ApplicationRow = (props) => {
    const { i, applicationList } = props;
    const [app, setApp] = useState(applicationList[i]);
    const { userData, setUserData } = useContext(UserContext);
    const [shortlistLoading, setShortlistLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);

    const modifyStatus = async (newStatus) => {
        try {
            setShortlistLoading(true);
            await axios.post('/api/recruiter/setApplicationStatus', { appId: app._id, status: newStatus }, { headers: { 'auth-token': userData.token } });
            setApp({ ...app, status: newStatus });
            setShortlistLoading(false);
        }
        catch (err) {
            console.log(err);
            setShortlistLoading(false);
        }
    };

    const handleAccept = async () => {
        try {
            setAcceptLoading(true);
            await axios.post('/api/recruiter/acceptApplication', { applicationId: app._id, applicantId: app.applicantId, jobId: app.jobId, recruiterId: app.recruiterId }, { headers: { 'auth-token': userData.token } });
            setApp({ ...app, status: 'accepted' });
            setUserData({ ...userData, user: { ...userData.user, recruits: [...userData.user.recruits, { applicantId: app.applicantId, rated: false }] } });
            setAcceptLoading(false);
        }
        catch (err) {
            console.log(err);
            setAcceptLoading(false);
        }
    }

    return (
        <tr>
            <th className='text-center' scope="row">{i + 1}</th>
            <td className='text-center'>{app.applicantName}</td>
            <td className='text-center'>{app.applicantSkills.length ? app.applicantSkills.join(', ') : "-"}</td>
            <td className='text-center'>{moment(app.applicationDate).format('DD-MM-YYYY')}</td>
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
            <td className='text-center'>
                {app.applicantResume ? <h4 className='mt-2'>
                    <a href={app.applicantResume} download={`${app.applicantName}_Resume.pdf`}><FontAwesomeIcon icon={faFileDownload} /></a>
                </h4> : null}
            </td>
            <td className={`text-center text-${{ applied: "info", shortlisted: "warning", accepted: "success", rejected: "danger", deleted: "secondary" }[app.status]}`}>{app.status.toUpperCase()}</td>
            {
                app.status === "applied" ?
                    <td className="text-center">
                        <div className='d-flex flex-column align-items-center my-1'>
                            {shortlistLoading ?
                                <div className="spinner-border spinner-border-sm text-warning" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                                : <>
                                    <button className="btn btn-outline-warning mb-1" onClick={() => modifyStatus("shortlisted")}>Shortlist</button>
                                    <button className="btn btn-outline-danger mt-1" onClick={() => modifyStatus("rejected")}>Reject</button>
                                </>}
                        </div>
                    </td> :
                    app.status === "shortlisted" ?
                        <td className="text-center">
                            <div className='d-flex flex-column align-items-center my-1'>
                                {acceptLoading ?
                                    <div className="spinner-border spinner-border-sm text-success" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                    : <>
                                        <button className="btn btn-outline-success mb-1" onClick={handleAccept}>Accept</button>
                                        <button className="btn btn-outline-danger mt-1" onClick={() => modifyStatus("rejected")}>Reject</button>
                                    </>}
                            </div>
                        </td>
                        : <td />
            }
        </tr>
    );
}

export default ApplicationRow;