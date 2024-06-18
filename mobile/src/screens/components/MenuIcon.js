import React from "react";
import {TouchableOpacity, View} from "react-native";
import {FontAwesome, Ionicons} from "@expo/vector-icons";
import {useColorSchemeContext} from "../../context/ColorSchemeContext";
import {useNavigation} from "@react-navigation/native";

const MenuIcon = ({ navigation }) => {
    const {colorScheme} = useColorSchemeContext();

    return (
        <View style={{marginHorizontal: 20}}>
            <TouchableOpacity>
                <Ionicons name="menu-outline" size={31} color={colorScheme === 'light' ? "#fff" : "#000000"} onPress={() => navigation.toggleDrawer()} />
            </TouchableOpacity>
        </View>
    );
};

export default MenuIcon;
