import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const MessageContext = createContext();

export function MessageProvider({ children }) {
    const [messageJoin, setMessageJoin] = useState({});
    
    return (
        <MessageContext.Provider value={{ messageJoin, setMessageJoin }}>
            {children}
        </MessageContext.Provider>
    );
}

MessageProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useMessage = () => useContext(MessageContext);
