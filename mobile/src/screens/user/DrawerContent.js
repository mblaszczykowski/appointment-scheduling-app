import React, { useContext } from "react";
import { Switch, Text, View } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Avatar, Caption, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AuthContext from "../../context/AuthContext";
import ProfileContext from "../../context/ProfileContext";
import { AUTH_ACTIONS } from "../../context/reducers/authReducer";
import { logout } from "../../api/api-auth";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import { useTranslation } from 'react-i18next';

export function DrawerContent({ navigation }) {
    const { state, dispatch } = useContext(AuthContext);
    const {
        profileState: { profile },
    } = useContext(ProfileContext);
    const { colorScheme, toggleColorSchemeMethod } = useColorSchemeContext();
    const { t } = useTranslation();

    const handleSignOut = async () => {
        try {
            await logout();
            dispatch({ type: AUTH_ACTIONS.SIGN_OUT });
        } catch (err) {
            console.log("failed to sign out");
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-800">
            <View className="pl-5 mt-8">
                <View className="flex-row mt-8">
                    <Avatar.Image
                        source={{ uri: profile?.profilePicture }}
                        size={50}
                        className="mt-1"
                    />
                    <View className="ml-4 flex-column">
                        <Title className="text-xl mt-1 font-semibold text-black dark:text-white">
                            {profile?.firstname}
                        </Title>
                        <Caption className="text-base leading-4 text-black dark:text-white">
                            {profile?.lastname}
                        </Caption>
                    </View>
                </View>
            </View>
            <DrawerContentScrollView>
                <View>
                    <View className="mt-4">
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="account-outline" color={colorScheme === "dark" ? "#FFFFFF" : "#000000"} size={size} />
                            )}
                            label={t('screens.drawer.profile')}
                            labelStyle={{ color: colorScheme === "dark" ? "#FFFFFF" : "#000000" }}
                            onPress={() => navigation.navigate("Profile")}
                        />

                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="cog-outline" color={colorScheme === "dark" ? "#FFFFFF" : "#000000"} size={size} />
                            )}
                            label={t('screens.drawer.settings')}
                            labelStyle={{ color: colorScheme === "dark" ? "#FFFFFF" : "#000000" }}
                            onPress={() => navigation.navigate("Settings")}
                        />
                    </View>

                </View>
            </DrawerContentScrollView>
            <View className="mb-4">
                <DrawerItem
                    icon={({ color, size }) => (
                        <Icon name="exit-to-app" color="#ED2939" size={size} />
                    )}
                    label={t('screens.drawer.signOut')}
                    labelStyle={{ fontWeight: "bold", color: "#ED2939" }}
                    onPress={handleSignOut}
                />
            </View>
        </View>
    );
}
