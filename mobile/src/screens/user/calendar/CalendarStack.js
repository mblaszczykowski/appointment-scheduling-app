import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Calendar from "./Calendar";
import { useTranslation } from 'react-i18next';

const Stack = createStackNavigator();

const CalendarStack = () => {
    const { t } = useTranslation();

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
                    title: t('screens.calendarStack.title')
                }}
            />
        </Stack.Navigator>
    );
};

export default CalendarStack;
