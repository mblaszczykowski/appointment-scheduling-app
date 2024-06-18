import React, { useContext, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import AuthContext from "../../../context/AuthContext";
import {useNavigation, useTheme} from "@react-navigation/native";
import NewAppointmentModal from "../../NewAppointmentModal";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from 'react-i18next';

const Calendar = () => {
    const [calendarUrl, setCalendarUrl] = useState(" ");
    const navigation = useNavigation();
    const {colors} = useTheme();
    const {
        profileState: { profile, appointments },
    } = useContext(ProfileContext);
    const {
        state: {
            auth: { token },
        },
    } = useContext(AuthContext);
    useEffect(() => {
        setCalendarUrl(profile.calendarUrl);
    }, []);
    const [openModal, setOpenModal] = useState(false);
    const { t } = useTranslation();

    return (
        <View className="flex-1 bg-[#3476EF]">
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                        className="bg-white dark:bg-gray-800 rounded-t-[25px]">
                <Text className="text-xl font-semibold text-gray-600 dark:text-white my-2 text-center px-5">
                    {t('screens.calendar.text.qrCodeToYourCalendar')}
                </Text>
                <View className="my-5">
                    <QRCode
                        value={calendarUrl}
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
                        {t('screens.calendar.text.previewYourCalendar')}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <NewAppointmentModal navigation={navigation} openModal={openModal} setOpenModal={setOpenModal} user={profile} />
        </View>
    );
};

export default Calendar;
