import React, {useContext} from "react";
import {View} from "react-native";
import {DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import {Avatar, Caption, Drawer, Title} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AuthContext from "../../context/AuthContext";
import ProfileContext from "../../context/ProfileContext";
import {AUTH_ACTIONS} from "../../context/reducers/authReducer";
import {logout} from "../../api/api-auth";

export function DrawerContent(props) {
    const {state, dispatch} = useContext(AuthContext);
    const {
        profileState: {profile, appointments},
    } = useContext(ProfileContext);

    const handleSignOut = async () => {
        try {
            await logout();
            dispatch({type: AUTH_ACTIONS.SIGN_OUT});
        } catch (err) {
            console.log("failed to signout");
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="pl-5 pb-2 mt-8">
                <View className="flex-row mt-6">
                    <Avatar.Image
                        source={require("../assets/user.jpg")}
                        size={50}
                        className="mt-2"
                    />
                    <View className="ml-4 flex-column">
                        <Title className="text-xl mt-1 font-semibold text-black">
                            Name {/*profile?.lastName*/}
                        </Title>
                        <Caption className="text-base leading-4 text-black">
                            aaa{/*state.auth?.user.email*/}
                        </Caption>
                    </View>
                </View>
            </View>
            <DrawerContentScrollView {...props}>
                <View>
                    <Drawer.Section className="mt-4">
                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="account-outline" color={"#000"} size={size}/>
                            )}
                            label="Profile"
                            labelStyle={{color: "#000000"}}
                            onPress={() => props.navigation.navigate("ProfileStack")}
                        />

                        <DrawerItem
                            icon={({color, size}) => (
                                <Icon name="cog-outline" color={"#000"} size={size}/>
                            )}
                            label="Settings"
                            labelStyle={{color: "#000000"}}
                        />
                    </Drawer.Section>
                </View>
            </DrawerContentScrollView>
            <Drawer.Section className="mb-4">
                <DrawerItem
                    icon={({color, size}) => (
                        <Icon name="exit-to-app" color="#ED2939" size={size}/>
                    )}
                    label="Sign Out"
                    labelStyle={{fontWeight: "bold", color: "#ED2939"}}
                    onPress={handleSignOut}
                />
            </Drawer.Section>
        </View>
    );
}
