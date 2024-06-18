import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import ProfileContext from "../../context/ProfileContext";
import { getAppointments, getUser } from "../../api/api-user";
import { PROFILE_ACTIONS } from "../../context/reducers/profileReducer";
import { createDrawerNavigator } from "@react-navigation/drawer";
import MainTabs from "./MainTabs";
import { DrawerContent } from "./DrawerContent";
import ProfileStack from "./profile/ProfileStack";
import { Buffer } from 'buffer';
import LoadingScreen from "./LoadingScreen";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import NotificationsIcon from "../components/NotificationsIcon";
import { FontAwesome } from "@expo/vector-icons";
import MenuIcon from "../components/MenuIcon";
import SettingsStack from "./settings/SettingsStack";

const Drawer = createDrawerNavigator();

const UserHome = () => {
    const { state } = useContext(AuthContext);
    const { profileDispatch } = useContext(ProfileContext);
    const [loading, setLoading] = useState(true);
    const { colorScheme, toggleColorSchemeMethod } = useColorSchemeContext();

    useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = () => {
        const decodeJWT = (token) => {
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
                return JSON.parse(jsonPayload);
            } catch (error) {
                console.error("Failed to decode token", error);
                return null;
            }
        };

        const getUserIdFromToken = (token) => {
            const decoded = decodeJWT(token);
            return decoded ? decoded.sub : null;
        };

        getUser(
            {
                accountId: getUserIdFromToken(state.auth),
            },
            { token: state.auth }
        )
            .then((user) => {
                if (user && user.error) {
                    console.log("Failed to fetch profile " + user.error);
                } else {
                    profileDispatch({
                        type: PROFILE_ACTIONS.SET_PROFILE,
                        profile: user,
                    });
                    getAppointments(
                        { accountId: getUserIdFromToken(state.auth) },
                        { token: state.auth }
                    ).then((appointments) => {
                        setLoading(false);
                        if (appointments && appointments.error) {
                            console.log(
                                "Failed to fetch profile " + appointments.error
                            );
                        } else {
                            profileDispatch({
                                type: PROFILE_ACTIONS.SET_APPOINTMENTS,
                                appointments: appointments,
                            });
                        }
                    }).catch((err) => console.log(err));
                }
            })
            .catch((err) => console.log(err));
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
        >
            <Drawer.Screen
                name=" "
                component={MainTabs}
                options={({ navigation }) => ({
                    headerRight: () => <NotificationsIcon />,
                    headerLeft: () => <MenuIcon navigation={navigation} />
                })}
            />
            <Drawer.Screen
                name="Profile"
                component={ProfileStack}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsStack}
            />
        </Drawer.Navigator>
    );
};

export default UserHome;
