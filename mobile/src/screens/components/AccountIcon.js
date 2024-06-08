import React, {useContext} from "react";
import {TouchableOpacity, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import AuthContext from "../../context/AuthContext";
import {MaterialCommunityIcons} from "@expo/vector-icons";

const AccountIcon = () => {
    const navigation = useNavigation();
    const {state} = useContext(AuthContext);

    return (
        <View style={{marginHorizontal: 20}}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                {/*<Avatar.Image source={profileImage} size={35} />*/}
                <MaterialCommunityIcons name="account-circle" size={37} color="#fff"/>

            </TouchableOpacity>
        </View>
    );
};

export default AccountIcon;
