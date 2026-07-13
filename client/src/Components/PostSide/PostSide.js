import React from 'react'
import './PostSide.css'
import PostShare from '../PostShare/PostShare'
import Posts from '../Posts/Posts'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const PostSide = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.authReducer.authData);
  const isOwnProfile = !params.id || params.id === user._id;

  return (
    <div className="PostSide">
        {isOwnProfile && <PostShare />}
        <Posts />
    </div>
  )
}

export default PostSide
