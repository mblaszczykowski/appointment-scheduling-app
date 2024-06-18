import React, {useContext, useEffect, useState} from "react";
import {ActivityIndicator, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Calendar} from "react-native-calendars";
import AuthContext from "../context/AuthContext";
import ProfileContext from "../context/ProfileContext";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import moment from "moment-timezone";
import {useColorSchemeContext} from "../context/ColorSchemeContext";
import {Avatar} from "react-native-paper";

axios.defaults.baseURL = `${process.env.BASE_URL}`
moment.tz.setDefault("Europe/Warsaw");

const NewAppointmentModal = ({navigation, openModal, setOpenModal, route}) => {
    const {state} = useContext(AuthContext);
    const {profileState, profileDispatch} = useContext(ProfileContext);
    const {colorScheme} = useColorSchemeContext();
    const { t } = useTranslation();
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [workingHours, setWorkingHours] = useState([]);
    const [selectedTime, setSelectedTime] = useState("");
    const [currentScreen, setCurrentScreen] = useState('dateTime');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [meetingNote, setMeetingNote] = useState('');
    const [userData, setUserData] = useState(null);
    const [calendarUrl, setCalendarUrl] = useState('');
    const [selectedDate, setSelectedDate] = useState(moment().tz("Europe/Warsaw").format("YYYY-MM-DD"));

    const fetchUserData = async () => {
        try {
            if (profileState.profile === null) {
                const calendarUrl = route.params.calendarUrl
                setCalendarUrl(calendarUrl)
                const response = await axios.get(`${process.env.BASE_URL}/api/calendar/${calendarUrl}`);
                setUserData(response.data);
            } else {
                setUserData(profileState.profile);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            //Tu bedzie przekierowanie na ekran z errorem
            // navigation.navigate('error');
        }

    };

    useEffect(() => {
        setCurrentScreen('dateTime');
        const fetchData = async () => {
            await fetchUserData()
            if(userData?.id !== undefined)
            {
                const appointmentsData = await fetchAppointments(userData?.id, selectedDate);
                const slots = generateTimeSlots(userData.availableFromHour, userData.availableToHour, userData.meetingDuration);
                const availableSlots = filterBookedSlots(slots, appointmentsData.appointments);
                setWorkingHours(availableSlots);
            }
        };
        fetchData().then(r => console.log("fetchData: ", r));
    }, [selectedDate, openModal]);

    const selectDay = (day) => {
        setSelectedDate(day.dateString)
        setDate(day.dateString)
    };

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleCreateAppointment = async () => {
        if (!name.trim() || !email.trim()) {
            alert(t('screens.newAppointmentModal.text.provideNameEmail'));
            return;
        }
        if (!validateEmail(email)) {
            alert(t('screens.newAppointmentModal.text.invalidEmail'));
            return;
        }

        setLoading(true);
        const appointment = {
            calendarUrl: userData.calendarUrl,
            startTime: date + 'T' + moment(selectedTime, 'HH:mm').format('HH:mm:ss'),
            endTime: date + 'T' + moment(selectedTime, 'HH:mm').add(userData.meetingDuration, 'minutes').format('HH:mm:ss'),
            bookerName: name,
            bookerEmail: email,
            meetingNote: meetingNote,
            isActual: true
        };
        try {
            await axios.post('/api/appointments', appointment);
            handleCancel();
        } catch (error) {
            console.error("handleCreateAppointment error: ", error);
        }
        setLoading(false);
    };

    const generateTimeSlots = (fromHour, toHour, duration) => {
        let slots = [];
        let startTime = new Date();
        startTime.setHours(fromHour, 0, 0, 0);

        let endTime = new Date(startTime.getTime() + duration * 60000); // set end time by adding duration in minutes

        while (endTime.getHours() <= toHour) {
            slots.push({
                start: `${startTime.getHours()}:${startTime.getMinutes() === 0 ? '00' : startTime.getMinutes()}`,
                end: `${endTime.getHours()}:${endTime.getMinutes() === 0 ? '00' : endTime.getMinutes()}`
            });
            startTime = new Date(endTime.getTime());
            endTime = new Date(startTime.getTime() + duration * 60000);
        }

        return slots;
    };
    const timeToMinutes = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };
    const filterBookedSlots = (slots, appointments) => {
        const now = moment().add(2,'hours')
        const today = now.day()
        return slots.filter(slot => {
            const slotStart = timeToMinutes(slot.start);
            const slotEnd = timeToMinutes(slot.end);
            return !appointments.some(appointment => {
                if(moment(appointment.startTime).isBefore(now) && moment(appointment.endTime).day() === today) return true
                const appointmentStart = timeToMinutes(appointment.startTime.split('T')[1].substring(0, 5));
                const appointmentEnd = timeToMinutes(appointment.endTime.split('T')[1].substring(0, 5));
                return (slotStart < appointmentEnd && slotEnd > appointmentStart);
            });
        });
    };

    const fetchAppointments = async (userId, selectedDate) => {
        try {
            if(selectedDate.length > 10 || selectedDate.length === undefined) {
                selectedDate = selectedDate.format("YYYY-MM-DD")
            }

            const response = await axios.get(`/api/appointments/user/${userId}?date=${selectedDate}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching appointments:', error);
            return [];
        }
    };
    const renderTimeSlot = ({ item }) => (
        <TouchableOpacity
            onPress={() => setSelectedTime(item.start)}
            className={`m-1 w-20 p-2.5 rounded-lg items-center border ${selectedTime === item.start ? "bg-[#3476EF] border-[#3476EF]" : "bg-white dark:bg-gray-800 border-[#3476EF]"}`}
        >
            <Text
                className={`font-normal ${selectedTime === item.start ? "text-white" : "text-[#00adf5] dark:text-white"}`}>{item.start}</Text>
        </TouchableOpacity>
    );

    const renderDateTimeSelection = () => (
        <>
            <View className="flex-row mx-5 mt-4 mb-4">
                <Avatar.Image
                    source={{ uri: userData?.profilePicture }}
                    size={65}
                    className=""
                />
                <View className="ml-5 mt-1">
                    <Text
                        className={`text-lg font-semibold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}>{userData?.firstname} {userData?.lastname}</Text>
                    <Text
                        className={`text-sm ${colorScheme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Available meetings
                        duration: {userData?.meetingDuration} min</Text>
                </View>
            </View>
            <View
                className={`mx-5 p-1 mb-2 border ${colorScheme === 'dark' ? 'border-gray-600' : 'border-blue-400'} rounded-2xl`}>
                <Calendar
                    minDate={today}
                    onDayPress={selectDay}
                    markedDates={{
                        [selectedDate]: {
                            selected: true,
                            color: "#3476EF",
                            textColor: "#fff",
                        },
                    }}
                    theme={{
                        backgroundColor: colorScheme === 'dark' ? '#111727' : '#ffffff',
                        calendarBackground: colorScheme === 'dark' ? '#111727' : '#ffffff',
                        textSectionTitleColor: colorScheme === 'dark' ? '#b6c1cd' : '#b6c1cd',
                        selectedDayBackgroundColor: '#3476EF',
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: '#3476EF',
                        dayTextColor: colorScheme === 'dark' ? '#d9e1e8' : '#2d4150',
                        textDisabledColor: colorScheme === 'dark' ? '#d9e1e8' : '#d9e1e8',
                        dotColor: '#3476EF',
                        selectedDotColor: '#ffffff',
                        arrowColor: "#3476EF",
                        monthTextColor: "#3476EF",
                        indicatorColor: '#3476EF',
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
                keyExtractor={(item) => item.start}
                contentContainerStyle={{ alignItems: "center", paddingBottom: 32 }}
            />
        </>
    );

    const isDarkMode = colorScheme === 'dark';
    const renderDetailsInput = () => (
        <View className="mx-5 mt-3">
            <Text className={`text-lg font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {t("screens.newAppointmentModal.text.selectedTime")}: {selectedTime}
            </Text>
            <Text className={`text-md font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                {t("screens.newAppointmentModal.text.selectedDate")}: {date}
            </Text>

            <TextInput
                className={`rounded-[25px] p-3 text-[16px] my-3 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                placeholder={t("screens.newAppointmentModal.text.namePlaceholder")}
                placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className={`rounded-[25px] p-3 text-[16px] mt-1 mb-4 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                placeholder={t("screens.newAppointmentModal.text.emailPlaceholder")}
                placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className={`rounded-[25px] p-3 text-[16px] mb-3 font-light ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
                placeholder={t("screens.newAppointmentModal.text.meetingNotePlaceholder")}
                placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
                value={meetingNote}
                onChangeText={setMeetingNote}
            />
            <TouchableOpacity onPress={() => setCurrentScreen('dateTime')}>
                <Text className="text-[#3476EF] mt-2 ml-1 text-lg font-medium">{t("screens.newAppointmentModal.text.back")}</Text>
            </TouchableOpacity>
        </View>
    );

    const handleCancel = () => {
        if (profileState.profile === null) {
            setCurrentScreen('dateTime');
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
            <View className={`flex-1 bg-${colorScheme === 'dark' ? 'gray-900' : 'white'} mt-14 rounded-t-2xl`}>
                <View className="flex-row justify-between mt-5 px-5 rounded-t-2xl">
                    <TouchableOpacity onPress={() => handleCancel()}>
                        <Text className="text-[#3476EF] text-lg font-medium">{t("screens.newAppointmentModal.text.cancel")}</Text>
                    </TouchableOpacity>
                    {currentScreen === 'dateTime' ? (
                        <TouchableOpacity onPress={() => setCurrentScreen('details')} disabled={!selectedTime || !date}>
                            <Text className="text-[#3476EF] text-lg font-medium">{t("screens.newAppointmentModal.text.next")}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleCreateAppointment}>
                            {loading ? (
                                <ActivityIndicator className="mx-3" size="small" color="#01478F" />
                            ) : (
                                <Text className="text-[#3476EF] text-lg font-medium">{t("screens.newAppointmentModal.text.confirm")}</Text>
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