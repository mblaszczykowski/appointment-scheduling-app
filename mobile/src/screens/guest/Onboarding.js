import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const {width} = Dimensions.get('window');

const OnboardingScreen = ({navigation}) => {
    const slides = [
        {
            backgroundColor: "#3674EF",
            image: require('../assets/logo.jpg'),
            title: "The Intuitive\nAppointment Scheduling",
            subtitle: "Meetly is a platform designed to streamline\nmeeting and appointment scheduling effortlessly.",
        },
        {
            backgroundColor: "#508aff",
            image: require('../assets/logo.jpg'),
            title: "What do we offer",
            subtitle: "Simplify your scheduling\nwith easy calendar setup. Allow others to book your available slots\nin just a few clicks. Get automatic email reminders\nfor all appointments.",
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef(null);

    const renderItem = ({item}) => (
        <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
            <Image source={item.image} style={styles.image} resizeMode="contain"/>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
    );

    const updateIndex = ({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    };

    const skipToEnd = () => {
        navigation.replace("Login");
    };

    return (
        <View style={{flex: 1}}>
            <FlatList
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={updateIndex}
                keyExtractor={(item, index) => index.toString()}
                ref={ref}
            />
            <View style={styles.footerContainer}>
                <View style={styles.buttonWrapper}>
                    {currentIndex === 0 && (
                        <TouchableOpacity onPress={skipToEnd} style={styles.button}>
                            <Text style={styles.buttonText}>Skip</Text>
                        </TouchableOpacity>)}
                </View>

                <View style={styles.paginationContainer}>
                    {slides.map((_, index) => (
                        <View key={index} style={[styles.dot, currentIndex === index && styles.activeDot]}/>
                    ))}
                </View>
                <View style={styles.buttonWrapper}>
                    {currentIndex === slides.length - 1 ? (
                        <TouchableOpacity onPress={skipToEnd} style={styles.button}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => ref.current.scrollToEnd()} style={styles.button}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 60,
        backgroundColor: '#3068D7'
    },
    paginationContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 7,
        width: 7,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    slide: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        height: '100%',
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 50,
        borderRadius: 90,
    },
    title: {
        fontSize: 24,
        color: '#ffffff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#3068D7',
        borderRadius: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    }
});

export default OnboardingScreen;
