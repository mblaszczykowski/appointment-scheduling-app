import React, {useContext, useState} from "react";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import AuthContext from "../../../context/AuthContext";
import {useTheme} from "@react-navigation/native";
import NewAppointmentModal from "../../NewAppointmentModal";

const Calendar = () => {
    const {colors} = useTheme();
    const {
        profileState: {profile, appointments},
    } = useContext(ProfileContext);
    const {
        state: {
            auth: {token},
        },
    } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    return (
        <View className={`flex-1`} style={{backgroundColor: colors.card}}>
            <ScrollView className="flex-1 rounded-tl-3xl rounded-tr-3xl bg-white">
                <Text className="p-5 mt-2.5 text-lg text-gray-700">
                    QR code to your calendar:
                </Text>
                <TouchableOpacity className="m-5 p-3 bg-blue-500 rounded-xl items-center"
                                  onPress={() => setOpenModal(true)}>
                    <Text className="text-white text-lg">
                        Preview your calendar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <NewAppointmentModal openModal={openModal} setOpenModal={setOpenModal} user={profile}/>
        </View>
    );
};

export default Calendar;
