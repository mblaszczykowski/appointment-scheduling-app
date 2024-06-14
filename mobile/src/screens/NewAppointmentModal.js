import React, {useContext, useState} from "react";
import {ActivityIndicator, FlatList, Image, Modal, Text, TextInput, TouchableOpacity, View} from "react-native";
import {Calendar} from "react-native-calendars";
import AuthContext from "../context/AuthContext";
import ProfileContext from "../context/ProfileContext";

// Constants for testing
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
    const today = new Date().toISOString().split('T')[0];
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [workingHours, setWorkingHours] = useState(getFilteredTimes(TIME_SLOTS, WORK_HOURS.start, WORK_HOURS.end));
    const [selectedTime, setSelectedTime] = useState("");
    const [currentScreen, setCurrentScreen] = useState('dateTime'); // New state to manage screen transitions
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
            className={`m-1 w-20 p-2.5 rounded-lg items-center border ${selectedTime === item.time ? "bg-[#00adf5] border-[#00adf5]" : "bg-white border-[#00adf5]"}`}
        >
            <Text className={`font-normal ${selectedTime === item.time ? "text-white" : "text-[#00adf5]"}`}>{item.time}</Text>
        </TouchableOpacity>
    );

    const renderDateTimeSelection = () => (
        <>
            <View className="flex-row mx-5 mt-3 mb-2">
                <Image className="w-16 h-16 rounded-lg" source={require("./assets/user.jpg")} />
                <View className="ml-5">
                    <Text className="text-lg font-semibold">imie</Text>
                    <Text className="text-base text-gray-500">opis</Text>
                </View>
            </View>
            <View className="mx-5 p-1 mb-2 border border-blue-400 rounded-2xl">
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
                />
            </View>
            <Text className="text-md font-medium ml-6 mt-2 mb-1">Available hours:</Text>
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
            <Text className="text-md font-medium mb-2">Selected Date: {date}</Text>
            <Text className="text-md font-medium mb-2">Selected Time: {selectedTime}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-3"
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-3"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                className="border border-gray-300 rounded-lg p-2 mb-3"
                placeholder="Meeting Note"
                value={meetingNote}
                onChangeText={setMeetingNote}
            />
            <TouchableOpacity onPress={() => setCurrentScreen('dateTime')}>
                <Text className="text-[#01478F] text-lg font-medium">Back</Text>
            </TouchableOpacity>
        </View>
    );
    const handleCancel = () => {
        if (profileState.profile === null) {
            navigation.navigate("Login");
        }
        else {
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
            <View className="flex-1 bg-white mt-16 rounded-t-2xl">
                <View className="flex-row justify-between mt-5 px-5 rounded-t-2xl">
                    <TouchableOpacity onPress={() => handleCancel()}>
                        <Text className="text-[#01478F] text-lg font-medium">Cancel</Text>
                    </TouchableOpacity>
                    {currentScreen === 'dateTime' ? (
                        <TouchableOpacity onPress={() => setCurrentScreen('details')} disabled={!selectedTime || !date}>
                            <Text className="text-[#01478F] text-lg font-medium">Next</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleCreateAppointment} disabled={!name || !email || !meetingNote}>
                            {loading ? (
                                <ActivityIndicator className="mx-3" size="small" color="#01478F" />
                            ) : (
                                <Text className="text-[#01478F] text-lg font-medium">Confirm</Text>
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
