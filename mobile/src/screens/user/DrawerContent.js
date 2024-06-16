import React, {useContext} from "react";
import {Switch, Text, View} from "react-native";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Avatar, Caption, Title} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AuthContext from "../../context/AuthContext";
import ProfileContext from "../../context/ProfileContext";
import {AUTH_ACTIONS} from "../../context/reducers/authReducer";
import {logout} from "../../api/api-auth";
import {useColorSchemeContext} from "../../context/ColorSchemeContext";

export function DrawerContent({navigation}) {
    const {state, dispatch} = useContext(AuthContext);
    const {
        profileState: {profile},
    } = useContext(ProfileContext);
    const {colorScheme, toggleColorSchemeMethod} = useColorSchemeContext();

    const handleSignOut = async () => {
        try {
            await logout();
            dispatch({type: AUTH_ACTIONS.SIGN_OUT});
        } catch (err) {
            console.log("failed to sign out");
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-800">
            <View className="pl-5 mt-8">
                <View className="flex-row mt-8">
                    <Avatar.Image
                        source={require("../assets/user.jpg")}
                        size={50}
                        className="mt-1"
                    />
                    <View className="ml-4 flex-column">
                        <Title className="text-xl mt-1 font-semibold text-black dark:text-white">
                            Name
                        </Title>
                        <Caption className="text-base leading-4 text-black dark:text-white">
                            Lastname
                        </Caption>
                    </View>
                </View>
            </View>
            <DrawerContentScrollView>
                <View>
                    <View className="mt-4">
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="account-outline" color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
                                      size={size}/>
                            )}
                            label="Profile"
                            labelStyle={{color: colorScheme === "dark" ? "#FFFFFF" : "#000000"}}
                            onPress={() => navigation.navigate("Profile")}
                        />

                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="cog-outline" color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
                                      size={size}/>
                            )}
                            label="Settings"
                            labelStyle={{color: colorScheme === "dark" ? "#FFFFFF" : "#000000"}}
                        />
                    </View>
                    <View className="flex-1 flex justify-center mt-6">
                        <View className="flex-row justify-center items-center space-x-2">
                            <Text className="text-md font-medium text-black dark:text-white">Dark Mode</Text>
                            <Switch value={colorScheme === 'dark'} onValueChange={toggleColorSchemeMethod}/>
                        </View>
                    </View>
                </View>
            </DrawerContentScrollView>
            <View className="mb-4">
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon name="exit-to-app" color="#ED2939" size={size}/>
                    )}
                    label="Sign out"
                    labelStyle={{fontWeight: "bold", color: "#ED2939"}}
                    onPress={handleSignOut}
                />
            </View>
        </View>
    );
}
