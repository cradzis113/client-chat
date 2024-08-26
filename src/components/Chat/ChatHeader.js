import { blue } from '@mui/material/colors';
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
// import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';  
// import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';  
import PropTypes from 'prop-types';

const ChatHeader = ({ room, statusTyping, currentUser }) => {
    const handleTypingDisplay = (users) => {
        const otherUsers = users.filter(username => username !== currentUser);
        if (otherUsers.length > 3) {
            const userLimit = otherUsers.slice(0, 3).join(', ');
            return (
                <Typography variant='subtitle2'>{userLimit}, and others are typing</Typography>
            );
        } else if (otherUsers.length === 1) {
            return (
                <Typography variant='subtitle2'>{otherUsers[0]} is typing</Typography>
            );
        } else if (otherUsers.length === 2) {
            return (
                <Typography variant='subtitle2'>{otherUsers[0]} and {otherUsers[1]} are typing</Typography>
            );
        } else if (otherUsers.length > 0) {
            const userList = otherUsers.join(', ').replace(/, ([^,]*)$/, ' and $1');
            return (
                <Typography variant='subtitle2'>{userList} are typing</Typography>
            );
        }
        return null;
    };

    return (
        <AppBar position="static" sx={{ flexShrink: 0, bgcolor: 'transparent' }} elevation={1}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box display={'flex'} alignItems={'center'} ml={2} color={'black'}>
                    <Avatar sx={{ bgcolor: blue[500] }}>P</Avatar>
                    <Box ml={2}>
                        <Typography variant='body1' sx={{ fontWeight: '600' }}>{room}</Typography>
                        {statusTyping.length > 0 && (
                            <Box>
                                {handleTypingDisplay(statusTyping)}
                            </Box>
                        )}
                    </Box>
                </Box>
                <Box>
                    <IconButton>
                        <PhoneOutlinedIcon />
                    </IconButton>
                    {/* <IconButton>
                        <VideocamOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <MoreHorizOutlinedIcon />
                    </IconButton> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

ChatHeader.propTypes = {
    room: PropTypes.string.isRequired,
    currentUser: PropTypes.string.isRequired,
    statusTyping: PropTypes.array.isRequired,
}

export default ChatHeader;
