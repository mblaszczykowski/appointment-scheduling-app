import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import Onboarding from "./Onboarding";
import QrScaner from "../components/QrScaner";
import NewAppointmentModal from "../NewAppointmentModal";
import PasswordReset from "./PasswordReset";

const Stack = createStackNavigator();

const WelcomeStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Signup" component={Register}/>
            <Stack.Screen name="QrScaner" component={QrScaner}/>
            <Stack.Screen name="PasswordReset" component={PasswordReset}/>
            <Stack.Screen name="NewAppointmentModal" component={NewAppointmentModal}/>
        </Stack.Navigator>
    );
};

export default WelcomeStack;
