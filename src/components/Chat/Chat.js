import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../../context/socketContext';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../context/messageContext';
import { useEffect, useMemo, useState, useRef } from 'react';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, Divider, useMediaQuery } from '@mui/material';

import io from 'socket.io-client';
import ChatHeader from './ChatHeader';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const Chat = () => {
    const typingTimeoutRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');

    const [messageList, setMessageList] = useState([]);
    const [countChatting, setCountChatting] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);

    const storedSocket = useMemo(() => localStorage.getItem('you'), []);
    const [nameLocal, setNameLocal] = useState(JSON.parse(localStorage.getItem('you')));
    const [openDialog, setOpenDialog] = useState(JSON.parse(localStorage.getItem('userNotFound')));
    const socketData = useMemo(() => (storedSocket ? JSON.parse(storedSocket) : {}), [storedSocket]);

    const navigate = useNavigate();
    const { messageJoin } = useMessage()
    const { socketReplace, setSocketReplace } = useSocket();

    const tablet = useMediaQuery('(min-width:768px)');
    const { id: socketId, idRoom: room, name } = socketData;

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;

        const newMsg = {
            id: uuidv4(),
            user: name,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'text'
        };

        socketReplace.emit('getRoom', (res) => {
            socketReplace.emit('isUserInRoom', { idRoom: res, name: nameLocal.name }, (res2) => {
                if (!res2) {
                    localStorage.setItem('userNotFound', true);
                    setOpenDialog(true);
                } else {
                    socketReplace.emit('messageFromClient', { room: res, message: newMsg, name, messageHistory, chatting: true });
                }
            });
        });

        setNewMessage('');
        socketReplace.emit('stopTyping', { room, user: name });
    };

    const handleSendLike = () => {
        const newMsg = {
            id: uuidv4(),
            user: name,
            text: '👍',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: 'like'
        };

        socketReplace.emit('getRoom', (res) => {
            socketReplace.emit('isUserInRoom', { idRoom: res, name: nameLocal.name }, (res2) => {
                if (!res2) {
                    localStorage.setItem('userNotFound', true);
                    setOpenDialog(true);
                } else {
                    socketReplace.emit('messageFromClient', { room: res, message: newMsg, name, messageHistory, chatting: true });
                }
            });
        });

        socketReplace.emit('stopTyping', { room, user: name });
    };

    const handleDialogClose = () => {
        localStorage.removeItem('you');
        localStorage.removeItem('userNotFound');

        navigate('/');
        setOpenDialog(false);
    };

    const handleMessageChange = (e) => {
        setNewMessage(e.target.value);

        socketReplace.emit('startTyping', { room, user: name });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketReplace.emit('stopTyping', { room, user: name });
        }, 300);
    };

    useEffect(() => {
        if (!storedSocket) {
            return navigate('/');
        }

        if (storedSocket && socketReplace) {
            return setSocketReplace(socketReplace);
        }

        if (socketId) {
            const newSocket = io(process.env.REACT_APP_API, {
                query: { name: name }
            });

            newSocket.emit('isUserInRoom', socketData, (res) => {
                if (!res) {
                    localStorage.setItem('userNotFound', true);
                    setOpenDialog(true);
                    return;
                }
            });

            newSocket.on('connect', () => {
                localStorage.setItem('you', JSON.stringify({ id: newSocket.id, idRoom: room, name }));
            });

            newSocket.emit('getHistoryChat', room, (res) => {
                setMessageHistory([res]);
            });

            newSocket.emit('reconnectToRoom', room);

            setSocketReplace(newSocket);
        }
    }, [socketReplace, setSocketReplace, name, socketId, room, socketData, storedSocket, navigate]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "you") {
                setNameLocal(JSON.parse(event.newValue).name);
                socketReplace.emit('leaveRoom', JSON.parse(event.oldValue));
                socketReplace.emit('isUserInRoom', JSON.parse(event.newValue), (res) => {
                    if (!res) {
                        setOpenDialog(true)
                    }
                })
            }
        };

        const disconnectUser = () => {
            socketReplace.emit('userLosesConnection', room, name)
        }

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('beforeunload', disconnectUser);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('beforeunload', disconnectUser);
        };
    }, [socketReplace, name, room]);

    useEffect(() => {
        if (!socketReplace) return;

        const messageHandler = (data) => {
            if (data.name !== name) {
                socketReplace.emit('setMessageRead', { room: data.idRoom, message: data.message, name });
            }

            if (data.message) {
                return setMessageList((prevList) => [...prevList, data.message]);
            }

            if (data[name] && Array.isArray(data[name].message)) {
                return setMessageList(() => {
                    setMessageHistory([]);
                    return data[name].message;
                });
            }
        };

        const typingHandler = (data) => {
            setCountChatting(data);
        };

        socketReplace.on('messageFromServer', messageHandler);
        socketReplace.on('updateTypingStatus', typingHandler);

        return () => {
            socketReplace.off('messageFromServer', messageHandler);
            socketReplace.off('updateTypingStatus', typingHandler);
        };
    }, [socketReplace, name]);

    useEffect(() => {
        if (messageJoin && messageJoin.message) {
            setMessageList((prevList) => {
                const newMessages = messageJoin.message.filter((msg) => {
                    return !prevList.some((msg2) => msg2.id === msg.id);
                });

                return [...prevList, ...newMessages];
            });
        }
    }, [messageJoin]);

    return (
        <Box display="flex" height="100vh">
            {tablet && (
                <Box flex={2}>
                    <Typography>
                        sidebar
                    </Typography>
                </Box>
            )}
            <Divider orientation='vertical' />
            <Box display="flex" flexDirection="column" flex={8}>
                <ChatHeader room={room} statusTyping={countChatting} currentUser={name} />
                <Box flexGrow={1} py={3} overflow="auto">
                    {messageHistory && messageHistory.map((msg, index) => (
                        <ChatMessage key={index} messageHistory={msg} name={name} />
                    ))}
                    {messageList && messageList.map((msg, index) => (
                        <ChatMessage key={index} message={msg} name={name} />
                    ))}
                </Box>
                <ChatInput
                    newMessage={newMessage}
                    handleMessageChange={handleMessageChange}
                    handleSendMessage={handleSendMessage}
                    handleSendLike={handleSendLike}
                />
            </Box>

            <Dialog open={openDialog || false}>
                <DialogTitle>User Not Found</DialogTitle>
                <DialogContent>
                    <Typography>User not found on the server.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Chat;


