import React, {useState} from "react";
import {sendResetMail} from "../../api/api-auth";
import {MaterialIcons} from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import {ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View} from "react-native";


const PasswordReset = ({navigation}) => {
    const [formValues, setFormValues] = useState({
        email: ""
    });


    const handleSendMail = () => {
        sendResetMail({ email: formValues.email }).then(data => {
            if (data && data.error) {
                console.log(data.error);
            } else {
                navigation.navigate("Login");
            }
        });
    };


    return (
        <ResetDetails
            formValues={formValues}
            setFormValues={setFormValues}
            handleSendMail={handleSendMail}
        />
    )
};

const ResetDetails = ({formValues, setFormValues, handleSendMail}) => (
    <Animatable.View animation="fadeIn" duration={1500} className="flex-1 bg-[#3575EF]">
        <View className="flex-grow justify-end items-center">
            <Image className="w-[75px] h-[75px] rounded-full" source={require("../assets/logo.jpg")}/>
        </View>

        <View className="flex-grow justify-center items-center">
            <Text style={{fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 10}}>Need help with your password?</Text>
            <Text style={{color: '#fff'}}>To get started, enter your email address.</Text>
            <TextInput
                className="w-[300px] bg-[#ffffff4d] rounded-[25px] p-3 text-[16px] text-white m-3.5 font-light"
                placeholder="Email"
                autoCapitalize="none"
                placeholderTextColor="#fff"
                value={formValues.email}
                onChangeText={val => setFormValues({...formValues, email: val})}
            />
            <TouchableOpacity
                disabled={!formValues.email}
                className="bg-[#fff] w-[300px] rounded-[25px] m-3.5 p-2.5 flex-row items-center justify-center"
                onPress={handleSendMail}
            >
                <Text className="text-[16px] font-extrabold text-black text-center">Next</Text>
                <MaterialIcons name="navigate-next" size={24} color="black"/>
            </TouchableOpacity>
        </View>
        <View className="flex-grow items-end justify-center py-4 flex-row">
            <Text className="text-[#ffffffb3] text-[16px] font-light">Remembered your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-white text-[16px] font-semibold">Sign in</Text>
            </TouchableOpacity>
        </View>
    </Animatable.View>
);

export default PasswordReset;
