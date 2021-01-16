import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import DateTimePicker from 'react-datetime-picker';
import swal from 'sweetalert';
import axios from 'axios';

const EditableJobListing = (props) => {
    const { job, handleDelete, token } = props;
    const [currentJob, setCurrentJob] = useState(job);
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState(moment(currentJob.deadline).toDate());
    const [maxApplications, setMaxApplications] = useState(currentJob.maxApplications);
    const [maxPositions, setMaxPositions] = useState(currentJob.maxPositions);
    const [editing, setEditing] = useState(false);

    const saveEdits = async () => {
        try {
            setLoading(true);
            if (Number(maxApplications) < currentJob.applicationCount) {
                swal({
                    text: `The value of Maximum Applications cannot be lower than the number of applications you have already recieved (which is ${currentJob.applicationCount}). `,
                    icon: "error",
                    dangerMode: true
                });
                setLoading(false);
                return;
            }
            if (Number(maxPositions) < currentJob.positionsFilled) {
                swal({
                    text: `The value of Maximum Positions cannot be lower than the number of positons you have already accepted (which is ${currentJob.positionsFilled}).`,
                    icon: "error",
                    dangerMode: true
                });
                setLoading(false);
                return;
            }
            const editedJob = { ...currentJob, maxApplications: Number(maxApplications), maxPositions: Number(maxPositions), deadline: moment(deadline).format() };
            setCurrentJob(editedJob);
            await axios.patch('/api/recruiter/editJob', { editedJob }, { headers: { 'auth-token': token } });
            setLoading(false);
            setEditing(false);

        }
        catch (err) {
            console.log(err);
        }
    }

    const cancelEditing = () => {
        setDeadline(moment(currentJob.deadline).toDate());
        setMaxApplications(currentJob.maxApplications);
        setMaxPositions(currentJob.maxPositions);
        setLoading(false);
        setEditing(false);
    }

    const miniSpinner = (<div className="spinner-border text-success spinner-border-sm mb-1" role="status">
        <span className="sr-only">Loading...</span>
    </div>);

    return (
        editing ?
            <div className="card m-2 col-4 p-0">
                <h5 className="card-header">
                    <div className="row justify-content-between px-3">
                        <span>{currentJob.title}</span>
                        <span>
                            <FontAwesomeIcon className='mr-2 hoverable-icon text-danger' onClick={cancelEditing} icon={faTimes} />
                            {loading ? miniSpinner : <FontAwesomeIcon className='ml-2 hoverable-icon text-success' onClick={saveEdits} icon={faCheck} />}
                        </span>
                    </div>
                </h5>
                <div className="card-body">

                    <div className="form-group">
                        <label htmlFor="deadline">Application Deadline</label>
                        <DateTimePicker id="deadline" disableClock={true} clearIcon={null} format="dd-MM-y hh:mm a" className='d-block rounded' value={deadline} onChange={setDeadline} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="maxApplicants">Maximum Applications</label>
                        <input id="maxApplicants" type="number" className='form-control' value={maxApplications} onChange={({ target }) => setMaxApplications(target.value)} />
                    </div>
                    <div className="form-group mt-2">
                        <label htmlFor="maxPositons">Maximum Positions</label>
                        <input id="maxPositions" type="number" className='form-control' value={maxPositions} onChange={({ target }) => setMaxPositions(target.value)} />
                    </div>
                </div>
            </div>
            :
            <div className="card m-2 col-4 p-0">
                <h5 className="card-header">
                    <div className="row justify-content-between px-3">
                        <span>{currentJob.title}</span>
                        <FontAwesomeIcon className='ml-auto hoverable-icon' onClick={() => setEditing(true)} icon={faPencilAlt} />
                    </div>
                </h5>
                <div className="card-body">
                    <p className="lead text-center">Posted: {moment(currentJob.postDate).format('L')}</p>
                    <div className="row justify-content-around">
                        <p className="card-text"><strong>Applicants: </strong>{`${currentJob.applicationCount}/${currentJob.maxApplications}`}</p>
                        <p className="card-text"><strong>Positions: </strong>{`${currentJob.positionsFilled}/${currentJob.maxPositions}`}</p>
                    </div>
                    <div className="row justify-content-around">
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(currentJob._id)}>Delete</button>
                        <Link to={`/viewApplications/${currentJob._id}`} className="btn btn-outline-info">View Application</Link>
                    </div>
                </div>
            </div>
    )
};

export default EditableJobListing;