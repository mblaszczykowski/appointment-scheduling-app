import React, {useContext} from "react";
import {Image, Text, View} from "react-native";
import AuthContext from "../../../context/AuthContext";
import ProfileContext from "../../../context/ProfileContext";

const Profile = () => {
    const {state} = useContext(AuthContext);
    const {profileState} = useContext(ProfileContext);

    return (
        <View className="flex-1 bg-white">
            <View className="px-5 py-5 mb-6 rounded-b-3xl bg-[#0B3454]">
                <View className="flex-row">
                    <Image
                        className="w-16 h-16 rounded-lg"
                        source={require("../../assets/user.jpg")}
                    />
                    <View className="ml-5">
                        <Text className="text-lg font-semibold text-white">
                            {`Name `}
                        </Text>
                        <Text className="text-base font-medium text-white mt-2">
                            email {/*state.auth?.user.email*/}
                        </Text>
                        <Text className="text-base font-medium text-white mt-2">
                            {/*`${profileState.profile?.calendarUrl}`*/}
                        </Text>
                        <Text className="text-base font-medium text-white mt-2">
                            Zhejiang, China
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Profile;
