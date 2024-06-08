import React from "react";
import {Image, Text, TextInput, TouchableOpacity, View} from "react-native";
import {MaterialIcons} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

const LoginDetails = (props) => {
    const {
        formValues,
        setFormValues,
        nextStep,
        navigation,
    } = props;

    return (
        <Animatable.View
            animation="fadeIn"
            duration={1500}
            className="flex-1 bg-[#3575EF]"
        >
            <View className="flex-grow justify-end items-center">
                <Image
                    className="w-[75px] h-[75px] rounded-full"
                    source={require("../assets/logo.jpg")}
                />
            </View>
            <View className="flex-grow justify-center items-center">
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Email"
                    autoCapitalize="none"
                    placeholderTextColor="#fff"
                    value={formValues.email}
                    onChangeText={(val) => setFormValues({...formValues, email: val})}
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Password"
                    secureTextEntry={true}
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    value={formValues.password}
                    onChangeText={(val) => setFormValues({...formValues, password: val})}
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="First Name"
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    value={formValues.firstName}
                    onChangeText={(val) => setFormValues({...formValues, firstName: val})}
                />
                <TextInput
                    className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                    underlineColorAndroid="rgba(0,0,0,0)"
                    placeholder="Last Name"
                    placeholderTextColor="#fff"
                    autoCapitalize="none"
                    value={formValues.lastName}
                    onChangeText={(val) => setFormValues({...formValues, lastName: val})}
                />
                <TouchableOpacity
                    disabled={!formValues.email || !formValues.password}
                    onPress={nextStep}
                    className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center"
                >
                    <Text className="text-[16px] font-extrabold text-black text-center">Next</Text>
                    <MaterialIcons name="navigate-next" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View className="flex-grow items-end justify-center py-4 flex-row">
                <Text className="text-[#ffffffb3] text-[16px] font-light">Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text className="text-white text-[16px] font-semibold">Signin</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
    );
};

export default LoginDetails;
