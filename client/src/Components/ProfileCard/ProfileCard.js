import React, { useEffect, useState } from 'react';
import './ProfileCard.css';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { getUser } from '../../api/UserRequest';
import publicFolder from '../../utils/publicFolder';

const ProfileCard = ({ location }) => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const posts = useSelector((state) => state.postReducer.posts);
    const params = useParams();
    const profileUserId = params.id || user._id;
    const isOwnProfile = profileUserId === user._id;
    const [profileUser, setProfileUser] = useState(user);

    useEffect(() => {
        const fetchProfileUser = async () => {
            if (isOwnProfile) {
                setProfileUser(user);
                return;
            }

            const { data } = await getUser(profileUserId);
            setProfileUser(data);
        };

        fetchProfileUser();
    }, [profileUserId, isOwnProfile, user]);

    return (
        <div className='ProfileCard'>
            <div className="ProfileImages">
                <img src={profileUser.coverPicture ? publicFolder + profileUser.coverPicture : publicFolder + "defaultCover.jpg"} alt="" />
                <img src={profileUser.profilePicture ? publicFolder + profileUser.profilePicture : publicFolder + "defaultProfile.png"} alt="" />
            </div>

            <div className="ProfileName">
                <span>{profileUser.firstname} {profileUser.lastname}</span>
                <span>{profileUser.worksAt ? profileUser.worksAt : "write about yourself..."}</span>
            </div>

            <div className="followStatus">
                <hr />
                <div>
                    <div className="follow">
                        <span>{profileUser.followers?.length || 0}</span>
                        <span>Followers</span>
                    </div>
                    <div className="vl"></div>
                    <div className="follow">
                        <span>{profileUser.following?.length || 0}</span>
                        <span>Following</span>
                    </div>

                    {location === "profilePage" && (
                        <>
                            <div className="vl"></div>
                            <div className="follow">
                                <span>{posts.filter((post) => post.userId === profileUserId).length}</span>
                                <span>Posts</span>
                            </div>
                        </>
                    )}
                </div>
                <hr />
            </div>

            {location === "profilePage" || !isOwnProfile ? '' :
                <span>
                    <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profile/${user._id}`}>My Profile</Link>
                </span>
            }
        </div>
    );
};

export default ProfileCard;
