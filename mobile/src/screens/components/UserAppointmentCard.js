import React from "react";
import moment from "moment";
import {Image, Text, TouchableOpacity, View} from "react-native";
import {EvilIcons, MaterialIcons} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const UserAppointmentCard = ({appointment, navigation}) => {
    const date = moment(appointment?.date).format("ddd MMM Do YYYY");
    const user = appointment?.user;

    return (
        <View className="p-4 pb-0">
            <Animatable.View animation="zoomIn"
                             className="p-4 bg-white rounded-lg shadow-sm border border-gray-300 border-l-8 border-l-green-700">
                <TouchableOpacity>
                    <View className="flex-row">
                        <Image
                            className="h-20 w-20 bg-gray-500 rounded-lg"
                            source={require("../assets/user.jpg")}
                        />
                        <View className="px-2 flex-1">
                            <Text className="text-gray-900 text-base font-semibold">
                                {`${user?.firstName} ${user?.lastName}`}
                            </Text>
                            <View className="flex-row items-center mt-1">
                                <EvilIcons name="calendar" size={15} color="#1c313a"/>
                                <Text className="text-purple-700 text-xs font-extrabold ml-1">{date}</Text>
                            </View>
                            <View className="flex-row items-center mt-1">
                                <EvilIcons name="clock" size={15} color="#1c313a"/>
                                <Text className="text-purple-700 text-xs font-extrabold ml-1">
                                    {appointment?.start_time}
                                </Text>
                            </View>
                            <View className="absolute bottom-0 right-0">
                                <MaterialIcons name="read-more" size={24} color="#1c313a"/>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
};

export default UserAppointmentCard;
