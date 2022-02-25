import React from 'react';

export const globalStateContext = React.createContext({
    isLoggedIn: true,
    change: () => {}
});