import React, { createContext, useState } from 'react';
const usernameContext = createContext();

export const UsernameContext = props => {
    const [username, setUsername] = useState(null);
    const [token, setToken] = useState(null);
    const globalValue = {
        username,
        setUsername,
        token,
        setToken,
    }
    return <usernameContext.Provider value={globalValue} {...props} />;
}

export const useUsernameContext = () => React.useContext(usernameContext);
export default usernameContext;
