import React, {useContext} from "react";
import {ScrollView, Text, View} from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import UserAppointmentCard from "../../components/UserAppointmentCard";

const Home = ({navigation}) => {
    const {
        profileState: {profile, appointments},
    } = useContext(ProfileContext);

    return (
        <View className="flex-1 bg-[#3476EF]">
            <ScrollView className="flex-1 bg-white rounded-t-[25px] pb-5">
                <View className="p-5 mt-2.5">
                    <Text className="text-2xl font-medium">
                        Hi, {`${profile?.lastName}`}
                    </Text>
                    <Text className="text-lg text-gray-700 mt-1.5">
                        Welcome Back
                    </Text>
                </View>

                <View className="flex-row justify-between items-center p-5">
                    <Text className="text-sm font-bold">
                        Your Next Appointment
                    </Text>
                </View>

                {
                    /*
                        {appointments.length !== 0 && (
                            <UserAppointmentCard appointment={appointments[0]}/>
                        )}

                        {appointments?.map((appointment) => (
                            <UserAppointmentCard
                                key={appointment._id}
                                noFooter
                                noHeader
                                appointment={appointment}
                            />
                        ))}
                     */
                }


            </ScrollView>
        </View>
    );
};

export default Home;
