import React, {useContext, useEffect, useState} from "react";
import {ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import ProfileContext from "../../../context/ProfileContext";
import AuthContext from "../../../context/AuthContext";
import {useTheme} from "@react-navigation/native";
import NewAppointmentModal from "../../NewAppointmentModal";
import QRCode from "react-native-qrcode-svg";

const Calendar = () => {
    const [calendarUrl, setCalendarUrl] = useState("");
    useEffect(() => {
        setCalendarUrl(profile.calendarUrl);
    }, []);
    const {colors} = useTheme();
    const {
        profileState: {profile, appointments},
    } = useContext(ProfileContext);
    const {
        state: {
            auth: {token},
        },
    } = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    return (
        <View style={[styles.container, { backgroundColor: colors.card }]}>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <Text style={styles.headerText}>
                    QR code to your calendar:
                </Text>
                <QRCode
                    value={"meetly://calendar/" + calendarUrl}
                    size={300}
                    color="black"
                    backgroundColor="white"
                />
                <TouchableOpacity style={styles.button}
                                  onPress={() => setOpenModal(true)}>
                    <Text style={styles.buttonText}>
                        Preview your calendar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <NewAppointmentModal openModal={openModal} setOpenModal={setOpenModal} user={profile}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        paddingTop: 20
    },
    headerText: {
        fontSize: 24,
        color: 'gray',
        marginVertical: 10,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    qrContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    button: {
        margin: 20,
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
});
export default Calendar;
