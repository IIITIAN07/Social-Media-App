import React, { useEffect, useState } from 'react';
import './RightSide.css';
import Home from '../../Img/home.png';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Noti from '../../Img/noti.png';
import Comment from '../../Img/comment.png';
import TrendCard from '../TrendCard/TrendCard';
import ShareModal from '../ShareModal/ShareModal';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getNotifications } from '../../api/NotificationRequest';
import { useSocket } from '../../context/SocketContext';

const RightSide = () => {

    const [modalOpened, setModalOpened] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [messageCount, setMessageCount] = useState(0);
    const { user } = useSelector((state) => state.authReducer.authData);
    const { socket } = useSocket() || {};

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const { data } = await getNotifications(user._id);
            setUnreadCount(data.filter((notification) => !notification.isRead).length);
            setMessageCount(data.filter((notification) => !notification.isRead && notification.type === 'message').length);
        };

        fetchUnreadCount();
    }, [user._id]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNotification = (notification) => {
            setUnreadCount((prev) => prev + 1);
            if (notification.type === 'message') {
                setMessageCount((prev) => prev + 1);
            }
        };

        socket.on('newNotification', handleNotification);

        return () => socket.off('newNotification', handleNotification);
    }, [socket]);

    return (
        <div className='RightSide'>
            <div className="navIcons">

                <Link to='../home'>
                    <img src={Home} alt="" />
                </Link>

                <SettingsOutlinedIcon />
                <Link to="/notifications" className="navIconLink">
                    <img src={Noti} alt="Notifications" />
                    {unreadCount > 0 && <span>{unreadCount}</span>}
                </Link>
                <Link to="/chat" className="navIconLink">
                    <img src={Comment} alt="Messages" />
                    {messageCount > 0 && <span>{messageCount}</span>}
                </Link>
            </div>

            <TrendCard />

            <div className="button rg-button" onClick={() => setModalOpened(true)}>
                Share
            </div>
            <ShareModal modalOpened={modalOpened} setModalOpened={setModalOpened} />

        </div>
    )
}

export default RightSide
