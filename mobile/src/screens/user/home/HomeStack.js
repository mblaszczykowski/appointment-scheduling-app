import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import {useTheme} from "@react-navigation/native";
import Home from "./Home";
import NotificationsIcon from "../../components/NotificationsIcon";
import AccountIcon from "../../components/AccountIcon";

const Stack = createStackNavigator();

const HomeStack = () => {
    const {colors} = useTheme();
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{
                    title: "",
                    headerStyle: {
                        backgroundColor: colors.card,
                        shadowColor: colors.card, //iOS
                        elevation: 0, // Android
                    },
                    headerLeft: () => <AccountIcon/>,
                    headerRight: () => <NotificationsIcon/>,
                }}
            />
        </Stack.Navigator>
    );
};

export default HomeStack;
