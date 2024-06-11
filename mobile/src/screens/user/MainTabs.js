import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {FontAwesome, Fontisto} from "@expo/vector-icons";
import HomeStack from "./home/HomeStack";
import CalendarStack from "./calendar/CalendarStack";

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
                }}
            />
        </Tabs.Navigator>
    );
};

export default MainTabs;
