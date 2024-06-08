import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Calendar from "./Calendar";
import NotificationsIcon from "../../components/NotificationsIcon";
import AccountIcon from "../../components/AccountIcon";

const Stack = createStackNavigator();

const CalendarStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    elevation: 0, // Android
                },

            }}
        >
            <Stack.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    title: "My calendar",
                    headerLeft: () => <AccountIcon/>,
                    headerRight: () => <NotificationsIcon/>,
                }}
            />
        </Stack.Navigator>
    );
};

export default CalendarStack;
