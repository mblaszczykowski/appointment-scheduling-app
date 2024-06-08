
import React, { useState } from "react";
import { signup } from "../../api/api-auth";
import LoginDetails from "./LoginDetails";
import PersonalDetails from "./PersonalDetails";

const Signup = ({ navigation }) => {
    const [formValues, setFormValues] = useState({
        step: 1,
        firstName: "",
        lastName: "",
        email: "",
        calendarUrl: "",
        password: "",
        meetingLink: "",
        availableFromHour: "",
        availableToHour: "",
        availableDays: [],
        meetingDuration: "",
        loading: false,
        error: "",
    });

    const nextStep = () => {
        setFormValues({ ...formValues, step: formValues.step + 1 });
    };

    const previousStep = () => {
        setFormValues({ ...formValues, step: formValues.step - 1 });
    };

    const handleSignup = () => {
        setFormValues({ ...formValues, loading: true, error: "" });

        const user = {
            firstname: formValues.firstName || undefined,
            lastname: formValues.lastName || undefined,
            email: formValues.email || undefined,
            calendarUrl: formValues.calendarUrl || undefined,
            password: formValues.password || undefined,
            meetingLink: formValues.meetingLink || undefined,
            availableFromHour: formValues.availableFromHour || undefined,
            availableToHour: formValues.availableToHour || undefined,
            availableDays: formValues.availableDays.join(',') || undefined,
            meetingDuration: formValues.meetingDuration || undefined
        };

        signup(user).then((data) => {
            setFormValues({ ...formValues, loading: false, error: "" });
            if (data && data.error) {
                console.log(data.error);
                setFormValues({ ...formValues, error: data.error });
            } else {
                navigation.navigate("Login");
            }
        });
    };

    switch (formValues.step) {
        case 1:
            return (
                <LoginDetails
                    formValues={formValues}
                    setFormValues={setFormValues}
                    nextStep={nextStep}
                    navigation={navigation}
                />
            );

        case 2:
            return (
                <PersonalDetails
                    formValues={formValues}
                    setFormValues={setFormValues}
                    handleSignup={handleSignup}
                    previousStep={previousStep}
                />
            );
    }
};

export default Signup;
