import React, { useRef, useState } from 'react';
import './PostShare.css';
import PhotoOutlinedIcon from '@mui/icons-material/PhotoOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage, uploadPost } from '../../actions/UploadAction';
import publicFolder from '../../utils/publicFolder';

const PostShare = () => {
    const loading = useSelector((state) => state.postReducer.uploading);
    const [media, setMedia] = useState(null);
    const [mediaType, setMediaType] = useState('image');
    const fileRef = useRef();
    const desc = useRef();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.authReducer.authData);

    const onMediaChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setMedia(event.target.files[0]);
        }
    };

    const openFilePicker = (type) => {
        setMediaType(type);
        if (fileRef.current) {
            fileRef.current.accept = type === 'video' ? 'video/*' : 'image/*';
            fileRef.current.click();
        }
    };

    const addLocation = () => {
        const location = window.prompt('Enter location');
        if (location) {
            desc.current.value = `${desc.current.value} Location: ${location}`.trim();
        }
    };

    const addSchedule = () => {
        const schedule = window.prompt('Enter schedule/date');
        if (schedule) {
            desc.current.value = `${desc.current.value} Schedule: ${schedule}`.trim();
        }
    };

    const reset = () => {
        setMedia(null);
        setMediaType('image');
        desc.current.value = '';
        if (fileRef.current) {
            fileRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!desc.current.value.trim() && !media) {
            window.alert('Please write a caption or select a photo/video.');
            return;
        }

        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        };

        if (media) {
            const data = new FormData();
            const filename = Date.now() + media.name;
            data.append('name', filename);
            data.append('file', media);

            newPost.image = filename;
            newPost.mediaType = mediaType;

            try {
                await dispatch(uploadImage(data));
            } catch (error) {
                console.log(error);
                return;
            }
        }

        await dispatch(uploadPost(newPost));
        reset();
    };

    return (
        <div className="PostShare">
            <img src={user.profilePicture ? publicFolder + user.profilePicture : publicFolder + 'defaultProfile.png'} alt="" />

            <div>
                <input type="text" placeholder="Write a caption..." ref={desc} />

                <div className="postOptions">
                    <div className="option" style={{ color: 'var(--photo)' }} onClick={() => openFilePicker('image')}>
                        <PhotoOutlinedIcon />
                        Photo
                    </div>

                    <div className="option" style={{ color: 'var(--video)' }} onClick={() => openFilePicker('video')}>
                        <PlayCircleOutlineIcon />
                        Video
                    </div>

                    <div className="option" style={{ color: 'var(--location)' }} onClick={addLocation}>
                        <LocationOnOutlinedIcon />
                        Location
                    </div>

                    <div className="option" style={{ color: 'var(--shedule)' }} onClick={addSchedule}>
                        <CalendarMonthOutlinedIcon />
                        Shedule
                    </div>

                    <button className="button ps-button" type="button" onClick={handleSubmit} disabled={loading}>
                        {loading ? 'uploading...' : 'Share'}
                    </button>

                    <div style={{ display: 'none' }}>
                        <input type="file" name="myImage" accept="image/*" ref={fileRef} onChange={onMediaChange} />
                    </div>
                </div>

                {media && (
                    <div className="previewImage">
                        <CloseOutlinedIcon onClick={() => setMedia(null)} />
                        {mediaType === 'video'
                            ? <video src={URL.createObjectURL(media)} controls />
                            : <img src={URL.createObjectURL(media)} alt="" />}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostShare;
