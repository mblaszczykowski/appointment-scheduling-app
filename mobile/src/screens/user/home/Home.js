import React, { useContext, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import UserAppointmentCard from "../../components/UserAppointmentCard";
import moment from "moment";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { useTranslation } from "react-i18next";
import AuthContext from "../../../context/AuthContext";

const Home = ({ navigation }) => {
    const {
        profileState: { profile, appointments },
    } = useContext(ProfileContext);
    const { state } = useContext(AuthContext);

    const { appointments: appointmentList } = appointments || {};
    const { t } = useTranslation();

    const [filter, setFilter] = useState("Upcoming");
    const [searchQuery, setSearchQuery] = useState("");

    const actualAppointments = appointmentList?.filter(appointment => appointment.isActual
        && moment(appointment.startTime).isAfter(moment().tz("Europe/Warsaw"))) || [];
    const canceledAppointments = appointmentList?.filter(appointment => !appointment.isActual) || [];
    const pastAppointments = appointmentList?.filter(appointment => appointment.isActual
        && moment(appointment.startTime).isBefore(moment().tz("Europe/Warsaw"))
    ) || [];

    const categorizeAndSortAppointments = (appointments) => {
        const categories = {
            today: [],
            thisWeek: [],
            thisMonth: [],
            nextMonth: [],
            later: []
        };

        const now = moment().tz("Europe/Warsaw");

        appointments.forEach(appointment => {
            const startTime = moment(appointment.startTime).tz("Europe/Warsaw");

            if (startTime.isSame(now, 'day')) {
                categories.today.push(appointment);
            } else if (startTime.isSame(now, 'week')) {
                categories.thisWeek.push(appointment);
            } else if (startTime.isSame(now, 'month')) {
                categories.thisMonth.push(appointment);
            } else if (startTime.isSame(now.clone().add(1, 'month'), 'month')) {
                categories.nextMonth.push(appointment);
            } else {
                categories.later.push(appointment);
            }
        });

        Object.keys(categories).forEach(key => {
            categories[key].sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));
        });

        return categories;
    };

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

        const filteredAndSortedAppointments = filteredAppointments.filter(appointment =>
            appointment.bookerName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const categorizedAppointments = categorizeAndSortAppointments(filteredAndSortedAppointments);

        return (
            <>
                {renderCategory(categorizedAppointments.today, t('screens.home.today'))}
                {renderCategory(categorizedAppointments.thisWeek, t('screens.home.thisWeek'))}
                {renderCategory(categorizedAppointments.thisMonth, t('screens.home.thisMonth'))}
                {renderCategory(categorizedAppointments.nextMonth, t('screens.home.nextMonth'))}
                {renderCategory(categorizedAppointments.later, t('screens.home.later'))}
            </>
        );
    };

    const renderCategory = (appointments, label) => {
        if (appointments.length === 0) return null;

        return (
            <View key={label}>
                <Text className="text-lg font-semibold text-gray-800 dark:text-neutral-300 ml-5 mt-2">
                    {label}
                </Text>
                {appointments.map((appointment, index) => (
                    <UserAppointmentCard
                        key={index}
                        appointment={appointment}
                        token={state.auth}
                        navigation={navigation}
                    />
                ))}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-[#3476EF]">
            <ScrollView className="flex-1 bg-white dark:bg-gray-800 rounded-t-[25px] pb-5">
                <View className="px-5 mt-6 mb-3.5 ml-2">
                    <Text className="text-2xl font-medium text-black dark:text-white">
                        {t('screens.home.hi')}, {`${profile?.firstname}`}
                    </Text>
                </View>
                <View className="px-5 mb-3">
                    <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                        <EvilIcons name="search" size={30} color="#1c313a" />
                        <TextInput
                            placeholder={t('screens.home.searchPlaceholder')}
                            placeholderTextColor="gray"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 ml-2 text-black dark:text-white"
                        />
                    </View>
                </View>
                <View className="flex-row justify-center items-center mt-1 mb-3">
                    {["Upcoming", "Past", "Canceled"].map((type) => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setFilter(type)}
                            className={`px-4 py-2 mx-2 rounded-full ${
                                filter === type
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                            }`}
                        >
                            <Text className={filter === type ? "text-white dark:text-black" : "text-gray-700 dark:text-gray-300"}>
                                {t(`screens.home.${type.toLowerCase()}`)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View className="px-2.5">
                    {renderAppointments()}
                </View>
            </ScrollView>
        </View>
    );
};

export default Home;
