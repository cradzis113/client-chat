import { useState, useEffect } from 'react';
import { Box, Button, IconButton, TextField } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import PropTypes from 'prop-types';

const ChatInput = ({ newMessage, handleMessageChange, handleSendMessage, handleSendLike }) => {
    const [haveText, setHaveText] = useState(newMessage.trim() !== '');

    useEffect(() => {
        setHaveText(newMessage.trim() !== '');
    }, [newMessage]);

    const handleChange = (event) => {
        const value = event.target.value;

        if (value.trim()) {
            setHaveText(true);
        } else {
            setHaveText(false);
        }

        handleMessageChange(event);
    };

    const handleSend = () => {
        handleSendMessage();
        setHaveText(false);
    };

    return (
        <Box display="flex" p={2} borderTop="1px solid #e0e0e0">
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message"
                value={newMessage}
                onChange={handleChange}
                autoComplete='off'
            />
            {haveText ? (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSend}
                    sx={{ ml: 2 }}
                >
                    Send
                </Button>
            ) : (
                <IconButton sx={{ ml: 1.5 }} onClick={handleSendLike}>
                    <ThumbUpIcon fontSize='large' />
                </IconButton>
            )}
        </Box>
    );
};

ChatInput.propTypes = {
    newMessage: PropTypes.string.isRequired,
    handleMessageChange: PropTypes.func.isRequired,
    handleSendMessage: PropTypes.func.isRequired,
    handleSendLike: PropTypes.func.isRequired,
};

export default ChatInput;
