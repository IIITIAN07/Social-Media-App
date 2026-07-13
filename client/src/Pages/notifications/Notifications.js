import React, { useEffect, useState } from 'react';
import './Notifications.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../../Img/home.png';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/NotificationRequest';
import { useSocket } from '../../context/SocketContext';
import publicFolder from '../../utils/publicFolder';

const Notifications = () => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const { socket } = useSocket() || {};
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await getNotifications(user._id);
            setNotifications(data);
        };

        fetchNotifications();
    }, [user._id]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleNotification = (notification) => {
            setNotifications((prev) => [notification, ...prev]);
        };

        socket.on('newNotification', handleNotification);

        return () => socket.off('newNotification', handleNotification);
    }, [socket]);

    const handleReadAll = async () => {
        await markAllNotificationsRead(user._id);
        setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    };

    const handleReadOne = async (notificationId) => {
        await markNotificationRead(notificationId);
        setNotifications((prev) => prev.map((notification) => (
            notification._id === notificationId ? { ...notification, isRead: true } : notification
        )));
    };

    return (
        <div className="NotificationsPage">
            <div className="NotificationsHeader">
                <Link to="/home" className="iconButton">
                    <img src={Home} alt="Home" />
                </Link>
                <h2>Notifications</h2>
                <button className="button readButton" onClick={handleReadAll}>Mark all read</button>
            </div>

            <div className="NotificationsList">
                {notifications.length === 0 && <span className="emptyState">No notifications yet.</span>}

                {notifications.map((notification) => (
                    <div
                        className={notification.isRead ? 'NotificationItem' : 'NotificationItem unread'}
                        key={notification._id}
                        onClick={() => handleReadOne(notification._id)}
                    >
                        <img
                            src={notification.sender?.profilePicture ? publicFolder + notification.sender.profilePicture : publicFolder + 'defaultProfile.png'}
                            alt=""
                        />
                        <div>
                            <span>
                                <b>{notification.sender?.firstname} {notification.sender?.lastname}</b> {notification.text}
                            </span>
                            <small>{new Date(notification.createdAt).toLocaleString()}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notifications;
