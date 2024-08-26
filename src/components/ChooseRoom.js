import io from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Container, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useSocket } from '../context/socketContext';
import { useMessage } from "../context/messageContext";

function ChooseRoom() {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [userName, setUserName] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const { setSocketReplace } = useSocket();
    const { setMessageJoin } = useMessage();

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_API);
        setSocket(newSocket);
        setSocketReplace(newSocket);

    }, [setSocketReplace]);

    const joinRoom = (room) => {
        socket.emit('isUserInRoom', { idRoom: room, name: userName }, (res) => {
            if (!res) {
                socket.emit('joinRoom', { idRoom: room, name: userName }, (res) => {
                    const newData = { ...res, name: userName };

                    if (res) {
                        localStorage.setItem('you', JSON.stringify(newData));
                        localStorage.setItem('userNotFound', false);

                        navigate('/chat');
                    }
                });
            } else {
                setOpenDialog(true);
            }
        });

        socket.on('messageFromServer', (data) => {
            setMessageJoin(data[userName]);
        });

        return () => {
            socket.off('messageFromServer');
        };
    };

    const handleChange = (e) => {
        const name = e.target.value.trim();
        setUserName(name);
    };

    return (
        <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '30%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <TextField label="Tên" onChange={handleChange} />
            </Box>
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    gap: 2
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Button
                        fullWidth
                        sx={{ mr: 2 }}
                        variant="outlined"
                        disabled={!userName}
                        onClick={() => joinRoom('room1')}
                    >
                        Room1
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        disabled={!userName}
                        onClick={() => joinRoom('room2')}
                    >
                        Room2
                    </Button>
                </Box>
            </Box>

            <Dialog open={openDialog}>
                <DialogTitle>User already in room</DialogTitle>
                <DialogContent>
                    <DialogContentText>Let choose another name</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ChooseRoom;
