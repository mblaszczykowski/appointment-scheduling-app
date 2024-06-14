import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Calendar from "./Calendar";

const Stack = createStackNavigator();

const CalendarStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    elevation: 0,
                },

            }}
        >
            <Stack.Screen
                name="Calendar"
                component={Calendar}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default CalendarStack;
