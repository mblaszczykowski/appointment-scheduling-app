import React, { useContext, useState } from "react";
import { ActivityIndicator, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";
import AuthContext from "../context/AuthContext";
import ProfileContext from "../context/ProfileContext";
import { useColorSchemeContext } from "../context/ColorSchemeContext";
import { useTranslation } from 'react-i18next';

const WORK_HOURS = {
    start: "07:30",
    end: "17:30",
};
const BLOCKED_HOURS = ["09:00", "12:30"];
const TIME_SLOTS = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = String(Math.floor(i / 2)).padStart(2, '0');
    const minute = i % 2 === 0 ? '00' : '30';
    return { time: `${hour}:${minute}` };
});

const getFilteredTimes = (timeSlots, start, end) => {
    const startIndex = timeSlots.findIndex(slot => slot.time === start);
    const endIndex = timeSlots.findIndex(slot => slot.time === end);
    return timeSlots.slice(startIndex, endIndex).filter(slot => !BLOCKED_HOURS.includes(slot.time));
};

const NewAppointmentModal = ({ openModal, setOpenModal, user, navigation }) => {
    const { state } = useContext(AuthContext);
    const { profileState, profileDispatch } = useContext(ProfileContext);
    const { colorScheme } = useColorSchemeContext();
    const { t } = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [workingHours, setWorkingHours] = useState(getFilteredTimes(TIME_SLOTS, WORK_HOURS.start, WORK_HOURS.end));
    const [selectedTime, setSelectedTime] = useState("");
    const [currentScreen, setCurrentScreen] = useState('dateTime');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [meetingNote, setMeetingNote] = useState('');

    const selectDay = (day) => setDate(day.dateString);

    const handleCreateAppointment = async () => {
        setLoading(true);
        const appointment = {
            user: profileState.profile?._id,
            date,
            start_time: selectedTime,
            name,
            email,
            meetingNote
        };
        // Assume createAppointment function is defined
        /*
        createAppointment({ token: state.auth?.token }, appointment)
            .then((data) => {
                setLoading(false);
                if (data && data.error) {
                    console.log(data.error);
                } else {
                    profileDispatch({ type: PROFILE_ACTIONS.ADD_APPOINTMENT, appointment: { ...data, doctor: doctor } });
                    setOpenModal(!openModal);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
        */
    };

    const renderTimeSlot = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedTime(item.time)}
            className={`m-1 w-20 p-2.5 rounded-lg items-center border ${selectedTime === item.time ? "bg-[#00adf5] border-[#00adf5]" : "bg-white dark:bg-gray-800 border-[#00adf5]"}`}
        >
            <Text
                className={`font-normal ${selectedTime === item.time ? "text-white" : "text-[#00adf5] dark:text-white"}`}>{item.time}</Text>
        </TouchableOpacity>
    );

    const renderDateTimeSelection = () => (
        <>
            <View className="flex-row mx-5 mt-3 mb-2">
                <Image className="w-16 h-16 rounded-lg" source={require("./assets/user.jpg")} />
                <View className="ml-5">
                    <Text
                        className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>imie</Text>
                    <Text
                        className={`text-base ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>opis</Text>
                </View>
            </View>
            <View
                className={`mx-5 p-1 mb-2 border ${colorScheme === 'dark' ? 'border-gray-600' : 'border-blue-400'} rounded-2xl`}>
                <Calendar
                    minDate={today}
                    onDayPress={selectDay}
                    markedDates={{
                        [date]: {
                            selected: true,
                            color: "#00B0BF",
                            textColor: "#fff",
                        },
                    }}
                    theme={{
                        backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
                        calendarBackground: colorScheme === 'dark' ? '#333333' : '#ffffff',
                        textSectionTitleColor: colorScheme === 'dark' ? '#b6c1cd' : '#b6c1cd',
                        selectedDayBackgroundColor: '#00adf5',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#00adf5',
                        dayTextColor: colorScheme === 'dark' ? '#d9e1e8' : '#2d4150',
                        textDisabledColor: colorScheme === 'dark' ? '#d9e1e8' : '#d9e1e8',
                        dotColor: '#00adf5',
                        selectedDotColor: '#ffffff',
                        arrowColor: colorScheme === 'dark' ? 'white' : 'orange',
                        monthTextColor: colorScheme === 'dark' ? 'white' : 'blue',
                        indicatorColor: colorScheme === 'dark' ? 'white' : 'blue',
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                    }}
                />
            </View>
            <Text
                className={`text-md font-medium ml-6 mt-2 mb-1 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{t("screens.newAppointmentModal.text.availableHours")}</Text>
            <FlatList
                data={workingHours}
                numColumns={4}
                renderItem={renderTimeSlot}
                keyExtractor={(item) => item.time}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
            />
        </>
    );

    const renderDetailsInput = () => (
        <View className="mx-5 mt-3">
            <Text className={`text-md font-medium mb-2 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{t("screens.newAppointmentModal.text.selectedDate")}: {date}</Text>
            <Text className={`text-md font-medium mb-2 ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{t("screens.newAppointmentModal.text.selectedTime")}: {selectedTime}</Text>
            <TextInput
                className={`border ${colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-2 mb-3 text-${colorScheme === 'dark' ? 'white' : 'black'}`}
                placeholder={t("screens.newAppointmentModal.text.namePlaceholder")}
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'gray'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className={`border ${colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-2 mb-3 text-${colorScheme === 'dark' ? 'white' : 'black'}`}
                placeholder={t("screens.newAppointmentModal.text.emailPlaceholder")}
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'gray'}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className={`border ${colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-300'} rounded-lg p-2 mb-3 text-${colorScheme === 'dark' ? 'white' : 'black'}`}
                placeholder={t("screens.newAppointmentModal.text.meetingNotePlaceholder")}
                placeholderTextColor={colorScheme === 'dark' ? 'gray' : 'gray'}
                value={meetingNote}
                onChangeText={setMeetingNote}
            />
            <TouchableOpacity onPress={() => setCurrentScreen('dateTime')}>
                <Text className="text-[#01478F] dark:text-[#4EA1D3] text-lg font-medium">{t("screens.newAppointmentModal.text.back")}</Text>
            </TouchableOpacity>
        </View>
    );

    const handleCancel = () => {
        if (profileState.profile === null) {
            navigation.navigate("Login");
        } else {
            setOpenModal(!openModal);
        }
    }

    return (
        <Modal
            onRequestClose={() => setOpenModal(!openModal)}
            animationType="slide"
            transparent
            visible={openModal}
        >
            <View className={`flex-1 bg-${colorScheme === 'dark' ? 'gray-900' : 'white'} mt-16 rounded-t-2xl`}>
                <View className="flex-row justify-between mt-5 px-5 rounded-t-2xl">
                    <TouchableOpacity onPress={() => handleCancel()}>
                        <Text className="text-[#01478F] dark:text-[#4EA1D3] text-lg font-medium">{t("screens.newAppointmentModal.text.cancel")}</Text>
                    </TouchableOpacity>
                    {currentScreen === 'dateTime' ? (
                        <TouchableOpacity onPress={() => setCurrentScreen('details')} disabled={!selectedTime || !date}>
                            <Text className="text-[#01478F] dark:text-[#4EA1D3] text-lg font-medium">{t("screens.newAppointmentModal.text.next")}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleCreateAppointment} disabled={!name || !email || !meetingNote}>
                            {loading ? (
                                <ActivityIndicator className="mx-3" size="small" color="#01478F" />
                            ) : (
                                <Text className="text-[#01478F] dark:text-[#4EA1D3] text-lg font-medium">{t("screens.newAppointmentModal.text.confirm")}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                </View>
                {currentScreen === 'dateTime' ? renderDateTimeSelection() : renderDetailsInput()}
            </View>
        </Modal>
    );
};

export default NewAppointmentModal;
