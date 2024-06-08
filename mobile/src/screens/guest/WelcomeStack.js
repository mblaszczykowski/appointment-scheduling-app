import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import Signup from "./Signup";
import Onboarding from "./Onboarding";

const Stack = createStackNavigator();

const WelcomeStack = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Signup" component={Signup}/>
        </Stack.Navigator>
    );
};

export default WelcomeStack;
