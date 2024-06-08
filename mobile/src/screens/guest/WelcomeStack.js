import React from "react";
import {createStackNavigator} from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import Onboarding from "./Onboarding";

const Stack = createStackNavigator();

const WelcomeStack = () => {
    return (
        <Stack.Navigator headerMode="none">
            <Stack.Screen name="Onboarding" component={Onboarding}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Signup" component={Register}/>
        </Stack.Navigator>
    );
};

export default WelcomeStack;
