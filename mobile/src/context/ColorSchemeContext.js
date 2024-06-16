import React, {createContext, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useColorScheme} from 'nativewind';

const ColorSchemeContext = createContext();

export const useColorSchemeContext = () => useContext(ColorSchemeContext);

export const ColorSchemeProvider = ({children}) => {
    const {colorScheme, toggleColorScheme, setColorScheme} = useColorScheme();

    useEffect(() => {
        const loadStoredTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('theme');
            setColorScheme(storedTheme === "light" ? "dark" : "light");
        };
        loadStoredTheme();
    }, []);

    const toggleColorSchemeMethod = async () => {
        toggleColorScheme();
        await AsyncStorage.setItem('theme', colorScheme);
    };

    return (
        <ColorSchemeContext.Provider value={{colorScheme, toggleColorSchemeMethod}}>
            {children}
        </ColorSchemeContext.Provider>
    );
};
