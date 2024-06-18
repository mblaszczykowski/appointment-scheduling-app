import React from "react";
import moment from "moment";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { EvilIcons, MaterialIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import { useColorSchemeContext } from "../../context/ColorSchemeContext";
import { cancelMeeting, setUser } from "../../api/api-user";
import { t } from "i18next";

const UserAppointmentCard = ({ appointment, token, navigation, refreshAppointments }) => {
    const date = moment(appointment.startTime).format("ddd MMM Do YYYY");
    const startTime = moment(appointment.startTime).format("HH:mm");
    const endTime = moment(appointment.endTime).format("HH:mm");
    const bookerName = appointment.bookerName;
    const meetingNote = appointment.meetingNote;
    const meetingId = appointment.id;

    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';

    return (
        <View className="p-4">
            <Animatable.View animation="zoomIn"
                             className="bg-white border border-gray-200 shadow-sm rounded-xl dark:bg-neutral-900 dark:border-neutral-700 dark:shadow-neutral-700/70">
                <View>
                    <View className="flex-row p-4 md:p-6">
                        <View className="relative ml-4 flex-1">
                            {!appointment.isActual && !moment(appointment.startTime).isBefore(moment().tz("Europe/Warsaw")) && (
                                <Text className="absolute top-0 right-0 text-xs text-gray-500">
                                    {t(`screens.home.canceled`)}
                                </Text>
                            )}
                            {appointment.isActual && moment(appointment.startTime).isAfter(moment().tz("Europe/Warsaw")) && (
                                <TouchableOpacity
                                    style={{ position: 'absolute', top: 1, right: 1, zIndex: 10 }}
                                    onPress={async () => {
                                        try {
                                            await cancelMeeting(meetingId, token);
                                            alert('Meeting canceled');
                                            refreshAppointments();  // Odświeżenie danych po anulowaniu spotkania
                                        } catch (error) {
                                            console.error("Failed to cancel meeting", error);
                                            alert('Failed to cancel meeting');
                                        }
                                    }}
                                >
                                    <Text className="text-xs text-red-500">
                                        {t(`screens.home.cancel`)}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <Text className="text-xl font-semibold text-gray-800 dark:text-neutral-300">
                                {bookerName}
                            </Text>
                            <Text className="text-sm font-medium text-blue-600 dark:text-blue-500">
                                {date}
                            </Text>
                            <View className="flex-row items-center mt-2">
                                <EvilIcons name="clock" size={16} color={isDarkMode ? "#888" : "#1c313a"} />
                                <Text className="text-sm font-extrabold ml-1 text-gray-800 dark:text-neutral-300">
                                    {startTime} - {endTime}
                                </Text>
                            </View>
                            <View className="flex-row items-center mt-2">
                                <EvilIcons name="comment" size={16} color={isDarkMode ? "#888" : "#1c313a"} />
                                <Text className="text-sm font-extrabold ml-1 text-gray-800 dark:text-neutral-300">
                                    {meetingNote}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </Animatable.View>
        </View>
    );
};

export default UserAppointmentCard;
