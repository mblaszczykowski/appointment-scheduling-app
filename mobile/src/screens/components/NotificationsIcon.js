import React from "react";
import {TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {useColorSchemeContext} from "../../context/ColorSchemeContext";

const NotificationsIcon = () => {
    const {colorScheme} = useColorSchemeContext();

    return (
        <View style={{marginHorizontal: 20}}>
            <TouchableOpacity>
                <Ionicons name="notifications-circle" size={37} color={colorScheme === 'light' ? "#fff" : "#000000"}/>
            </TouchableOpacity>
        </View>
    );
};

export default NotificationsIcon;
