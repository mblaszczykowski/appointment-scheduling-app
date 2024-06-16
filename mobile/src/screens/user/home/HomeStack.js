import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import Home from "./Home";
import {useColorSchemeContext} from "../../../context/ColorSchemeContext";

const Stack = createStackNavigator();

const HomeStack = () => {
    const {colors} = useTheme();
    const {colorScheme} = useColorSchemeContext();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                children={(props) => (
                    <Home {...props} />
                )}
                options={{
                    title: "",
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: colors.card,
                        shadowColor: colors.card, //iOS
                        elevation: 0, // Android
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
