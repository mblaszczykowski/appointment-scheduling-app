import React, { createContext, useContext } from 'react';

const ColorSchemeContext = createContext();

export const useColorSchemeContext = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({ children, colorScheme, toggleColorScheme }) => {
    return (
        <ColorSchemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
            {children}
        </ColorSchemeContext.Provider>
    );
};
