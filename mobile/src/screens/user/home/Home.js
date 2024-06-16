import React, {useContext, useState} from "react";
import {ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import UserAppointmentCard from "../../components/UserAppointmentCard";
import moment from "moment";
import EvilIcons from "react-native-vector-icons/EvilIcons";

const Home = ({navigation}) => {
    const {
        profileState: {profile, appointments},
    } = useContext(ProfileContext);

    const {appointments: appointmentList} = appointments || {};

    const [filter, setFilter] = useState("Upcoming");
    const [searchQuery, setSearchQuery] = useState("");

    const actualAppointments = appointmentList?.filter(appointment => appointment.isActual) || [];
    const canceledAppointments = appointmentList?.filter(appointment => !appointment.isActual) || [];
    const pastAppointments = appointmentList?.filter(appointment =>
        moment(appointment.startTime).isBefore(moment())
    ) || [];

    const renderAppointments = () => {
        let filteredAppointments;
        switch (filter) {
            case "Upcoming":
                filteredAppointments = actualAppointments;
                break;
            case "Canceled":
                filteredAppointments = canceledAppointments;
                break;
            case "Past":
                filteredAppointments = pastAppointments;
                break;
            default:
                filteredAppointments = [];
                break;
        }

        return filteredAppointments.filter(appointment =>
            appointment.bookerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    return (
        <View className="flex-1 bg-[#3476EF]">
            <ScrollView className="flex-1 bg-white dark:bg-gray-800 rounded-t-[25px] pb-5">
                <View className="p-5 mt-2.5">
                    <Text className="text-2xl font-medium text-black dark:text-white">
                        Hi, {`${profile?.firstname}`}
                    </Text>
                </View>
                <View className="p-5">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                        <EvilIcons name="search" size={30} color="#1c313a"/>
                        <TextInput
                            placeholder="Search by booker name"
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-2 text-black dark:text-white"
                        />
                    </View>
                </View>
                <View className="flex-row justify-center items-center p-5">
                    <TouchableOpacity
                        onPress={() => setFilter("Upcoming")}
                        className={`px-3 py-1 mx-1 rounded-full ${filter === "Upcoming" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"}`}
                    >
                        <Text>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter("Past")}
                        className={`px-3 py-1 mx-1 rounded-full ${filter === "Past" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"}`}
                    >
                        <Text>Past</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setFilter("Canceled")}
                        className={`px-3 py-1 mx-1 rounded-full ${filter === "Canceled" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"}`}
                    >
                        <Text>Canceled</Text>
                    </TouchableOpacity>
                </View>

                <View className="p-5">
                    {renderAppointments().length > 0 ? (
                        renderAppointments().map((appointment, index) => (
                            <UserAppointmentCard
                                key={index}
                                appointment={appointment}
                                navigation={navigation}
                            />
                        ))
                    ) : (
                        <Text className="text-gray-500 dark:text-gray-300">No {filter.toLowerCase()} appointments</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
