import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import AuthContext from "../../../context/AuthContext";
import { useTheme } from "@react-navigation/native";
import NewAppointmentModal from "../../NewAppointmentModal";
import QRCode from "react-native-qrcode-svg";

const Calendar = () => {
    const [calendarUrl, setCalendarUrl] = useState("");
    useEffect(() => {
        setCalendarUrl(profile.calendarUrl);
    }, []);
    const { colors } = useTheme();
    const {
        profileState: { profile, appointments },
    } = useContext(ProfileContext);
    const {
        state: {
            auth: { token },
        },
    } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    return (
        <View className="flex-1 bg-[#3476EF]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }} className="bg-white dark:bg-gray-800 rounded-t-[25px] pt-5">
                <Text className="text-xl text-gray-600 dark:text-white my-2 text-center px-5">
                    QR code to your calendar:
                </Text>
                <View className="my-5">
                    <QRCode
                        value={"meetly://calendar/" + calendarUrl}
                        size={300}
                        color="black"
                        backgroundColor="white"
                    />
                </View>
                <TouchableOpacity
                    className="m-4 p-2 bg-blue-500 rounded-lg items-center"
                    onPress={() => setOpenModal(true)}
                >
                    <Text className="text-white text-lg dark:text-black">
                        Preview your calendar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <NewAppointmentModal openModal={openModal} setOpenModal={setOpenModal} user={profile} />
        </View>
    );
};

export default Calendar;
