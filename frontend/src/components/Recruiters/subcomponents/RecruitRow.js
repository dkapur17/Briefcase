import { useState, useContext } from 'react';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import StarRatings from 'react-star-ratings';

import UserContext from '../../../contexts/UserContext';

const RecruitRow = (props) => {
    const { i, recruitList, setRecruitList } = props;
    const { userData } = useContext(UserContext);
    const [isRating, setIsRating] = useState(false);
    const [ratingValue, setRatingValue] = useState(0);

    const handleRating = async () => {
        try {
            let updatedRecruitList = recruitList;
            const res = await axios.post('/api/recruiter/rateRecruit', { applicantId: recruitList[i].applicantId, ratingValue }, { headers: { 'auth-token': userData.token } });
            updatedRecruitList[i].rated = true;
            updatedRecruitList[i].recruitRating = res.data.updatedRating;
            setRecruitList(updatedRecruitList);
            setIsRating(false);
        }
        catch (err) {
            console.log(err);
            setIsRating(false);
        }
    };

    return (
        <tr>
            <th scope='col'>{i + 1}</th>
            <td>{recruitList[i].recruitName}</td>
            <td>{moment(recruitList[i].joiningDate).format('L')}</td>
            <td>{recruitList[i].jobType === "fullTime" ? "Full Time" : recruitList[i].jobType === "partTime" ? "Part Time" : "Work From Home"}</td>
            <td>{recruitList[i].jobTitle}</td>
            <td>
                <StarRatings
                    rating={recruitList[i].recruitRating}
                    starRatedColor="black"
                    numberOfStars={5}
                    starDimension="20px"
                    starSpacing="2px"
                    name='rating'
                />
            </td>
            <td>{recruitList[i].rated ?
                <button className="btn btn-secondary" disabled>Rated</button> :
                isRating ?
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
                    </div> :
                    <button className="btn btn-outline-success" onClick={() => setIsRating(true)}>Rate</button>
            }
            </td>
        </tr>
    )
};

export default RecruitRow;