import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import HomeStack from "./home/HomeStack";
import CalendarStack from "./calendar/CalendarStack";
import AccountIcon from "../components/AccountIcon";
import NotificationsIcon from "../components/NotificationsIcon";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import { useTranslation } from 'react-i18next';

const Tabs = createBottomTabNavigator();

const MainTabs = () => {
    const { colorScheme } = useColorSchemeContext();
    const { t } = useTranslation();

    return (
        <Tabs.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: colorScheme !== 'dark' ? '#ffffff' : '#000000',
                tabBarInactiveTintColor: colorScheme !== 'dark' ? '#99BBF7' : '#32486e',
                headerTitleStyle: {
                    color: colorScheme !== 'dark' ? '#ffffff' : '#000000',
                },
                headerLeft: () => <AccountIcon />,
                headerRight: () => <NotificationsIcon />,
            }}
        >
            <Tabs.Screen
                name="Appointments"
                component={HomeStack}
                options={{
                    tabBarLabel: t('screens.tabs.labels.home'),
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Calendar link"
                component={CalendarStack}
                options={{
                    tabBarLabel: t('screens.tabs.labels.calendar'),
                    headerShown: false,
                    tabBarIcon: ({ color, size }) => (
                        <Fontisto name="date" size={size} color={color} />
                    ),
                }}
            />
        </Tabs.Navigator>
    );
};

export default MainTabs;
