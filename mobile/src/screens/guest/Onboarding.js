import React from "react";
import {Image, StyleSheet} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const OnboardingScreen = ({navigation}) => {
    let img = (
        <Image
            source={require('../assets/logo.jpg')}
            className="w-24 rounded-full"
            style={{height: undefined, aspectRatio: 1}}
            resizeMode="contain"
        />
    );

    return (
        <Onboarding
            onSkip={() => navigation.replace("Login")}
            onDone={() => navigation.replace("Login")}
            pages={[
                {
                    backgroundColor: "#3674EF",
                    image: img,
                    title: "The Intuitive\nAppointment Scheduling",
                    subtitle: "Meetly is a platform designed to streamline\nmeeting and appointment scheduling effortlessly.\n\n\n\n\n",
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                },
                {
                    backgroundColor: "#508aff",
                    image: img,
                    title: "What do we offer",
                    subtitle: "Simplify your scheduling\nwith easy calendar setup\n\nAllow others to book your available slots\nin just a few clicks\n\nGet automatic email reminders\nfor all appointments\n\n\n",
                    titleStyles: styles.title,
                    subTitleStyles: styles.subtitle,
                }
            ]}
        />
    );
};

const styles = StyleSheet.create({
    title: {
        marginTop: 10,
        textAlign: 'center',
    },
    subtitle: {
        marginTop: 5,
        textAlign: 'center',
    },
});

export default OnboardingScreen;
