import PropTypes from 'prop-types';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { Avatar, Box, Tooltip, Typography, useMediaQuery } from '@mui/material';

const ChatMessage = ({ message, messageHistory, name }) => {
    const isTablet = useMediaQuery('(min-width:768px)');

    const renderMessage = (value, isUser, index) => {
        const isLikeMessage = value.type === 'like';
        const isJoinMessage = value.type === 'join';
        const isLeftMessage = value.type === 'left';

        const avatarBgColor = isUser ? deepOrange[500] : deepPurple[500];
        const tooltipPlacement = isUser ? 'left' : 'right';
        const flexDirection = isUser ? 'row-reverse' : 'row';

        if (isJoinMessage) {
            return (
                <Box key={index} display="flex" justifyContent="center">
                    <Typography>{value.user} {value.text}</Typography>
                </Box>
            );
        }

        if (isLeftMessage) {
            return (
                <Box key={index} display="flex" justifyContent="center">
                    <Typography>{value.user} {value.text}</Typography>
                </Box>
            );
        }

        if (isLikeMessage) {
            return (
                <Box key={index} display="flex" alignItems="flex-start" flexDirection={flexDirection} mb={2}>
                    {name !== value.user && (
                        <Tooltip title={value.user} placement="left">
                            <Avatar sx={{ bgcolor: avatarBgColor, mx: isTablet ? 2 : 1.5 }}>
                                {value.user.charAt(0)}
                            </Avatar>
                        </Tooltip>
                    )}
                    <Tooltip title={value.time} placement={tooltipPlacement}>
                        <ThumbUpIcon fontSize="large" sx={{ mx: isUser ? 2 : 0 }} />
                    </Tooltip>
                </Box>
            );
        }

        return (
            <Box key={index} display="flex" alignItems="flex-start" flexDirection={flexDirection} mb={2}>
                {name !== value.user && (
                    <Tooltip title={value.user} placement="left">
                        <Avatar sx={{ bgcolor: avatarBgColor, mx: isTablet ? 2 : 1.5 }}>
                            {value.user.charAt(0)}
                        </Avatar>
                    </Tooltip>
                )}
                <Box
                    sx={{
                        backgroundColor: isUser ? '#e1f5fe' : '#f0f0f0',
                        borderRadius: isUser ? '15px 15px 3px 15px' : '15px 15px 15px 3px',
                        p: 1,
                        maxWidth: '60%',
                        mx: isUser ? 2.5 : 0,
                    }}
                >
                    <Tooltip title={value.time} placement={tooltipPlacement}>
                        <Typography variant="body1" align={isUser ? 'right' : 'left'} sx={{ wordBreak: 'break-all' }}>
                            {value.text}
                        </Typography>
                    </Tooltip>
                </Box>
            </Box>
        );
    };

    const renderChatHistory = () => {
        if (!messageHistory) return null;
        const keys = Object.keys(messageHistory);

        return keys.flatMap((key) => {
            const isUser = key === name;
            const messageData = messageHistory[key];

            if (messageData.messageRead.length > 0 && isUser && messageData.message.length === 0) {
                return messageData.messageRead.map((value, index) => renderMessage(value, value.user !== name, index));
            }

            if (isUser && messageData.message.length > 0) {
                return messageData.message.map((value, index) => renderMessage(value, value.user === name, index));
            }

            return [];
        });
    };

    const renderCurrentMessage = () => {
        if (!message) return null;
        
        const isUser = message.user === name;
        return renderMessage(message, isUser, message.id);
    };

    return <Box>{messageHistory ? renderChatHistory() : renderCurrentMessage()}</Box>;
};

ChatMessage.propTypes = {
    message: PropTypes.oneOfType([
        PropTypes.shape({
            user: PropTypes.string.isRequired,
            time: PropTypes.string.isRequired,
            text: PropTypes.string,
            type: PropTypes.string.isRequired,
        }),
        PropTypes.arrayOf(
            PropTypes.shape({
                user: PropTypes.string.isRequired,
                time: PropTypes.string.isRequired,
                text: PropTypes.string,
                type: PropTypes.string.isRequired,
            })
        )
    ]),
    messageHistory: PropTypes.objectOf(
        PropTypes.shape({
            message: PropTypes.arrayOf(
                PropTypes.shape({
                    user: PropTypes.string.isRequired,
                    time: PropTypes.string.isRequired,
                    text: PropTypes.string,
                    type: PropTypes.string.isRequired,
                })
            ),
            messageRead: PropTypes.arrayOf(
                PropTypes.shape({
                    user: PropTypes.string.isRequired,
                    time: PropTypes.string.isRequired,
                    text: PropTypes.string,
                    type: PropTypes.string.isRequired,
                })
            ),
        })
    ),
    name: PropTypes.string.isRequired,
};

export default ChatMessage;
