import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {FontAwesome, Fontisto} from "@expo/vector-icons";
import HomeStack from "./home/HomeStack";
import CalendarStack from "./calendar/CalendarStack";
import AccountIcon from "../components/AccountIcon";
import NotificationsIcon from "../components/NotificationsIcon";

const Tabs = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tabs.Navigator initialRouteName="Home">
            <Tabs.Screen
                name="Appointments"
                component={HomeStack}
                options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({color, size}) => (
                        <FontAwesome name="home" size={size} color={color}/>
                    ),
                    headerLeft: () => <AccountIcon/>,
                    headerRight: () => <NotificationsIcon/>,
                }}
            />
            <Tabs.Screen
                name="Calendar link"
                component={CalendarStack}
                options={{
                    tabBarLabel: "My calendar",
                    tabBarIcon: ({color, size}) => (
                        <Fontisto name="date" size={size} color={color}/>
                    ),
                    headerLeft: () => <AccountIcon/>,
                    headerRight: () => <NotificationsIcon/>,
                }}
            />
        </Tabs.Navigator>
    );
};

export default MainTabs;
