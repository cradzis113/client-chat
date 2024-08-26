import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSocket } from '../context/socketContext';
import PropTypes from 'prop-types';

const HistoryListener = ({ children }) => {
    const location = useLocation();
    const local = localStorage.getItem('you');
    const { socketReplace } = useSocket();

    useEffect(() => {
        const pathName = location.pathname;
        const pathSplit = pathName.split('/');

        if (pathName) {
            if (pathSplit[0] === '' && pathSplit[1] === '') {
                if (local && socketReplace) {
                    socketReplace.emit('leaveRoom', JSON.parse(local), (res) => {
                        if (res) {
                            localStorage.removeItem('you');
                            localStorage.removeItem('userNotFound');
                        } else {
                            localStorage.removeItem('you');
                            localStorage.removeItem('userNotFound');
                        }
                    });
                }
            }
        }

    }, [location, local, socketReplace]);

    return <>{children}</>;
};

HistoryListener.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HistoryListener;
