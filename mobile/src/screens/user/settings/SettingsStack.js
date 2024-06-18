import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./Settings";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useColorSchemeContext} from "../../../context/ColorSchemeContext";

const Stack = createStackNavigator();

const SettingsStack = () => {
    const navigation = useNavigation();

    const {colorScheme} = useColorSchemeContext();

    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileStack"
                children={(props) => <Profile {...props} />}
                options={{
                    title: "",
                    headerLeft: () => (
                        <Ionicons
                            name="chevron-back-circle"
                            size={30}
                            color={colorScheme === 'light' ? "#fff" : "#000000"}
                            style={{ marginHorizontal: 20 }}
                            onPress={() => navigation.goBack()}
                        />
                    )
                }}
            >
                {props => <Profile {...props} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default SettingsStack;
