import React from "react";
import {TouchableOpacity, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";

const NotificationsIcon = () => {
    return (
        <View style={{marginHorizontal: 20}}>
            <TouchableOpacity>
                <Ionicons name="notifications-circle" size={37} color="#fff"/>
            </TouchableOpacity>
        </View>
    );
};

export default NotificationsIcon;
