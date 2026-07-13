import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { followUser, unFollowUser } from '../../actions/UserAction';
import publicFolder from '../../utils/publicFolder';



const UserFollow = ({ person }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.authReducer.authData);
    const [following, setFollowing] = useState(person.followers.includes(user._id));

    const handleFollow = () => {
        following ? dispatch(unFollowUser(person._id, user))
            : dispatch(followUser(person._id, user))

        setFollowing((prev) => !prev)
    }

    return (
        <div className="follower">

            <div className="followerUser" onClick={() => navigate(`/profile/${person._id}`)}>
                <img src={person.profilePicture ? publicFolder + person.profilePicture : publicFolder + "defaultProfile.png"} alt="" className='followerImg' />
                <div className="name">
                    <span>{person.firstname}</span>
                    <span>@{person.firstname}  {person.lastname}</span>
                </div>
            </div>

            <button className='button fc-button' onClick={(e) => {
                e.stopPropagation();
                handleFollow();
            }}>
                {following ? "Unfollow" : "Follow"}
            </button>

        </div>

    )
}

export default UserFollow
