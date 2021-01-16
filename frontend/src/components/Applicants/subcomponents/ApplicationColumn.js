import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import axios from 'axios';

import UserContext from '../../../contexts/UserContext';

const ApplicationColumn = (props) => {
    const { app, i, setUserApplications, allUserApplications } = props;
    const [ratedByApplicant, setRatedByApplicant] = useState(allUserApplications[i].ratedByApplicant);
    const { userData } = useContext(UserContext);
    const [isRating, setIsRating] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);

    const handleRating = async () => {
        try {
            let updatedUserApplications = allUserApplications;
            updatedUserApplications[i].ratedByApplicant = true;
            setUserApplications(updatedUserApplications);
            setRatedByApplicant(true);
            await axios.post('/api/applicant/rateJob', { jobId: app.jobId, ratingValue, appId: app._id }, { headers: { 'auth-token': userData.token } });
            setIsRating(false);
        }
        catch (err) {
            console.log(err);
        }
    }
    return (
        <tr key={app._id}>
            <th scope="row">{i + 1}</th>
            <td className='text-center px-0'>{app.jobTitle}</td>
            <td className='text-center'>{app.joiningDate ? moment(app.joiningDate).format('L') : "-"}</td>
            <td className='text-center'>{app.jobSalary}</td>
            <td className='text-center'>{app.recruiterName}</td>
            <td className={`text-center text-${{ applied: "info", shortlisted: "warning", accepted: "success", rejected: "danger", deleted: "secondary" }[app.status]}`}>{app.status.toUpperCase()}</td>
            {ratedByApplicant ?
                <td className="text-center py-1"><button className="btn btn-secondary" disabled>Rated</button></td> :
                isRating ? <td className='py-0'>
                    <div className='row justify-content-center'>
                        <select value={ratingValue} className="custom-select custom-select-sm col-3 mt-1 mr-3" onChange={({ target }) => setRatingValue(target.value)}>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <h3>
                            <FontAwesomeIcon icon={faCheck} className='text-success py-0 mx-1 hoverable-icon' onClick={handleRating} />
                            <FontAwesomeIcon icon={faTimes} className='text-danger py-0 ml-1 hoverable-icon' onClick={() => setIsRating(false)} />
                        </h3>
                    </div>
                </td> :
                    <td className="text-center py-1">
                        <button className="btn btn-primary"
                            title={app.status === "accepted" ? "" : "You can only rate the jobs for which you have been accepted"}
                            disabled={app.status !== "accepted"}
                            onClick={() => setIsRating(true)}
                        >Rate</button>
                    </td>
            }
        </tr>
    )
}

export default ApplicationColumn;