import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Profile from "./Profile";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useColorSchemeContext} from "../../../context/ColorSchemeContext";

const Stack = createStackNavigator();

const ProfileStack = () => {
    const navigation = useNavigation();
    const [isEditing, setIsEditing] = useState(false);

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

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
                            color="white"
                            style={{ marginHorizontal: 20 }}
                            onPress={() => navigation.goBack()}
                        />
                    ),
                    headerRight: () => (
                        <MaterialCommunityIcons
                            name={isEditing ? "account-cancel" : "account-edit"}
                            size={30}
                            color="white"
                            style={{ marginHorizontal: 20 }}
                            onPress={toggleEditing}
                        />
                    ),
                }}
            >
                {props => <Profile {...props} isEditing={isEditing} toggleEditing={toggleEditing} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
};

export default ProfileStack;
