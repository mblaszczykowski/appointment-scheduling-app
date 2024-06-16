import React, {useRef, useState} from 'react';
import {Dimensions, FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {useColorSchemeContext} from '../../context/ColorSchemeContext';

const {width, height} = Dimensions.get('window');

const OnboardingScreen = ({navigation}) => {
    const {colorScheme} = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';

    const slides = [
        {
            backgroundColor: isDarkMode ? "#1F2937" : "#3674EF",
            image: require('../assets/logo.jpg'),
            title: "The Intuitive\nAppointment Scheduling",
            subtitle: "Meetly is a platform designed to streamline\nmeeting and appointment scheduling effortlessly.",
        },
        {
            backgroundColor: isDarkMode ? "#374151" : "#508aff",
            image: require('../assets/logo.jpg'),
            title: "What do we offer",
            subtitle: "Simplify your scheduling\nwith easy calendar setup. Allow others to book your available slots\nin just a few clicks. Get automatic email reminders\nfor all appointments.",
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef(null);

    const renderItem = ({item}) => (
        <View className="flex-1 items-center justify-center p-5" style={{backgroundColor: item.backgroundColor, width}}>
            <Image source={item.image} className="w-24 h-24 mb-12 rounded-full" resizeMode="contain"/>
            <Text className="text-2xl text-center dark:text-gray-200 text-white">{item.title}</Text>
            <Text className="text-lg text-center px-5 mt-2 dark:text-gray-400 text-white">{item.subtitle}</Text>
        </View>
    );

    const updateIndex = ({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    };

    const skipToEnd = () => {
        navigation.replace("Login");
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            ref.current.scrollToIndex({index: currentIndex + 1});
        } else {
            skipToEnd();
        }
    };

    return (
        <View className="flex-1 bg-white dark:bg-gray-900">
            <FlatList
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={updateIndex}
                keyExtractor={(item, index) => index.toString()}
                ref={ref}
                viewabilityConfig={{
                    viewAreaCoveragePercentThreshold: 50,
                }}
                getItemLayout={(data, index) => (
                    {length: width, offset: width * index, index}
                )}
            />
            <View className="flex-row justify-between items-center pb-5 pt-2 bg-blue-700 dark:bg-gray-800">
                <View className="flex-1 justify-center items-center">
                    {currentIndex === 0 && (
                        <TouchableOpacity onPress={skipToEnd} className="py-2 px-4 rounded">
                            <Text className="text-white text-lg">Skip</Text>
                        </TouchableOpacity>)}
                </View>

                <View className="flex-row flex-1 justify-center items-center">
                    {slides.map((_, index) => (
                        <View key={index}
                              className={`h-2 w-2 rounded-full mx-1 ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}/>
                    ))}
                </View>
                <View className="flex-1 justify-center items-center">
                    {currentIndex === slides.length - 1 ? (
                        <TouchableOpacity onPress={skipToEnd} className="py-2 px-4 rounded">
                            <Text className="text-white text-lg">Start</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleNext} className="py-2 px-4 rounded">
                            <Text className="text-white text-lg">Next</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default OnboardingScreen;
