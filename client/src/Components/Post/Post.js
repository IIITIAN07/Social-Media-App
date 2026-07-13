import React, { useState } from 'react';
import './Post.css';
import Comment from '../../Img/comment.png';
import Share from '../../Img/share.png';
import Like from '../../Img/like.png';
import Notlike from '../../Img/notlike.png';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import { commentPost, likePost } from '../../api/PostRequest';
import { deletePost } from '../../actions/PostAction';
import publicFolder from '../../utils/publicFolder';



const Post = ({ data }) => {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData)
  const [liked, setLiked] = useState(data.likes.includes(user._id))
  const [likes, setLikes] = useState(data.likes.length)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(data.comments || [])
  const [commentText, setCommentText] = useState('')


  const handleLike = () => {
    setLiked((prev) => !prev)
    likePost(data._id, user._id)
    liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1)
  }

  const handleComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      return;
    }

    const comment = {
      userId: user._id,
      name: `${user.firstname} ${user.lastname}`,
      text: commentText
    };

    const { data: savedComment } = await commentPost(data._id, comment);
    setComments((prev) => [...prev, savedComment]);
    setCommentText('');
  }

  const handleShare = async () => {
    const postLink = `${window.location.origin}/profile/${data.userId}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(postLink);
      window.alert('Post link copied!');
    } else {
      window.alert(postLink);
    }
  }

  const handleDelete = () => {
    if (window.confirm('Delete this post?')) {
      dispatch(deletePost(data._id, user._id));
    }
  }

  return (
    <div className='Post'>
      {data.userId === user._id && (
        <button className="deletePostButton" onClick={handleDelete} title="Delete post">
          <DeleteOutlineIcon fontSize="small" />
        </button>
      )}

      {data.image && (
        data.mediaType === 'video'
          ? <video src={publicFolder + data.image} controls className="postMedia" />
          : <img src={publicFolder + data.image} alt="" />
      )}

      <div className="postReact">
        <img src={liked ? Like : Notlike} alt="" style={{ cursor: "pointer" }} onClick={handleLike} />
        <img src={Comment} alt="" style={{ cursor: "pointer" }} onClick={() => setShowComments((prev) => !prev)} />
        <img src={Share} alt="" style={{ cursor: "pointer" }} onClick={handleShare} />
      </div>

      <span style={{ color: "var(--gray)", fontSize: '14px' }}>{likes} likes</span>
      <span className="commentCount" onClick={() => setShowComments((prev) => !prev)}>
        {comments.length} comments
      </span>

      <div className="detail">
        <span> <b>{data.name}</b> </span>
        <span>{data.desc}</span>
      </div>

      {showComments && (
        <div className="commentsBox">
          {comments.map((comment) => (
            <div className="comment" key={comment._id || comment.createdAt}>
              <b>{comment.name}</b>
              <span>{comment.text}</span>
            </div>
          ))}

          <form className="commentForm" onSubmit={handleComment}>
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
            />
            <button className="button" type="submit">Post</button>
          </form>
        </div>
      )}

    </div>
  )
}

export default Post
