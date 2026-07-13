import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './Chat.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from '../../Img/home.png';
import { getAllUser } from '../../api/UserRequest';
import { createConversation, createMessage, getConversations, getMessages, markMessagesRead } from '../../api/MessageRequest';
import { useSocket } from '../../context/SocketContext';
import publicFolder from '../../utils/publicFolder';

const Chat = () => {
    const { user } = useSelector((state) => state.authReducer.authData);
    const { socket, onlineUsers } = useSocket() || {};
    const [conversations, setConversations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const refreshConversations = useCallback(async () => {
        const { data } = await getConversations(user._id);
        setConversations(data);
    }, [user._id]);

    useEffect(() => {
        const fetchData = async () => {
            const [conversationRes, usersRes] = await Promise.all([
                getConversations(user._id),
                getAllUser()
            ]);

            setConversations(conversationRes.data);
            setAllUsers(usersRes.data.filter((person) => person._id !== user._id));
        };

        fetchData();
    }, [user._id]);

    useEffect(() => {
        if (!currentChat?._id) {
            return;
        }

        const fetchMessages = async () => {
            const { data } = await getMessages(currentChat._id);
            setMessages(data);
            markMessagesRead(currentChat._id, user._id);
        };

        fetchMessages();
    }, [currentChat?._id, user._id]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        const handleMessage = (message) => {
            if (message.conversationId === currentChat?._id) {
                setMessages((prev) => [...prev, message]);
                markMessagesRead(message.conversationId, user._id);
            }
            refreshConversations();
        };

        socket.on('receiveMessage', handleMessage);

        return () => socket.off('receiveMessage', handleMessage);
    }, [socket, currentChat?._id, user._id, refreshConversations]);

    const usersWithoutConversation = useMemo(() => {
        const conversationUserIds = conversations.map((conversation) => conversation.user?._id);
        return allUsers.filter((person) => !conversationUserIds.includes(person._id));
    }, [allUsers, conversations]);

    const handleStartConversation = async (receiverId) => {
        const { data } = await createConversation(user._id, receiverId);
        setCurrentChat(data);
        await refreshConversations();
    };

    const handleSend = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !currentChat?._id) {
            return;
        }

        const messageBody = {
            conversationId: currentChat._id,
            senderId: user._id,
            text: newMessage.trim()
        };

        const { data } = await createMessage(messageBody);
        setMessages((prev) => [...prev, data]);
        setNewMessage('');
        refreshConversations();
    };

    const renderUserImage = (person) => (
        <img
            src={person?.profilePicture ? publicFolder + person.profilePicture : publicFolder + 'defaultProfile.png'}
            alt=""
        />
    );

    return (
        <div className="ChatPage">
            <div className="ChatHeader">
                <Link to="/home" className="iconButton">
                    <img src={Home} alt="Home" />
                </Link>
                <h2>Messages</h2>
            </div>

            <div className="ChatShell">
                <div className="ConversationPanel">
                    <h3>Chats</h3>
                    {conversations.map((conversation) => (
                        <button
                            className={currentChat?._id === conversation._id ? 'Conversation active' : 'Conversation'}
                            key={conversation._id}
                            onClick={() => setCurrentChat(conversation)}
                        >
                            {renderUserImage(conversation.user)}
                            <span>
                                <b>{conversation.user?.firstname} {conversation.user?.lastname}</b>
                                <small>{conversation.lastMessage || 'Start chatting'}</small>
                            </span>
                            {onlineUsers?.includes(conversation.user?._id) && <i />}
                        </button>
                    ))}

                    <h3>New message</h3>
                    {usersWithoutConversation.map((person) => (
                        <button className="Conversation" key={person._id} onClick={() => handleStartConversation(person._id)}>
                            {renderUserImage(person)}
                            <span>
                                <b>{person.firstname} {person.lastname}</b>
                                <small>{onlineUsers?.includes(person._id) ? 'Online' : 'Offline'}</small>
                            </span>
                        </button>
                    ))}
                </div>

                <div className="MessagePanel">
                    {currentChat ? (
                        <>
                            <div className="MessageHeader">
                                {renderUserImage(currentChat.user)}
                                <div>
                                    <b>{currentChat.user?.firstname} {currentChat.user?.lastname}</b>
                                    <small>{onlineUsers?.includes(currentChat.user?._id) ? 'Online' : 'Offline'}</small>
                                </div>
                            </div>

                            <div className="MessageList">
                                {messages.map((message) => (
                                    <div className={message.senderId === user._id ? 'Message own' : 'Message'} key={message._id}>
                                        {message.text}
                                    </div>
                                ))}
                            </div>

                            <form className="MessageComposer" onSubmit={handleSend}>
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Message..."
                                />
                                <button className="button" type="submit">Send</button>
                            </form>
                        </>
                    ) : (
                        <div className="NoChat">Select a chat or start a new message.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
