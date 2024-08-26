import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const SocketContext = createContext();

export function SocketProvider({ children }) {
    const [socketReplace, setSocketReplace] = useState(null);

    return (
        <SocketContext.Provider value={{ socketReplace, setSocketReplace }}>
            {children}
        </SocketContext.Provider>
    );
}

SocketProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useSocket = () => useContext(SocketContext);
