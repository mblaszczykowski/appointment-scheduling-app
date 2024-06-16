import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useColorSchemeContext } from '../../context/ColorSchemeContext';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
    const { colorScheme } = useColorSchemeContext();
    const isDarkMode = colorScheme === 'dark';
    const { t } = useTranslation();

    const slides = t("screens.onboarding.slides", { returnObjects: true }).map(slide => ({
        ...slide,
        backgroundColor: isDarkMode ? slide.darkBackgroundColor || "#1F2937" : slide.lightBackgroundColor || "#3674EF",
        image: require('../assets/logo.jpg'), // Adjust image path accordingly
    }));

    const [currentIndex, setCurrentIndex] = useState(0);
    const ref = useRef(null);

    const renderItem = ({ item }) => (
        <View style={{ backgroundColor: item.backgroundColor, width, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Image source={item.image} style={{ width: 96, height: 96, marginBottom: 48, borderRadius: 50 }} resizeMode="contain" />
            <Text style={{ fontSize: 24, textAlign: 'center', color: isDarkMode ? '#ccc' : '#fff' }}>{item.title}</Text>
            <Text style={{ fontSize: 18, textAlign: 'center', paddingHorizontal: 20, marginTop: 8, color: isDarkMode ? '#999' : '#fff' }}>{item.subtitle}</Text>
        </View>
    );

    const updateIndex = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    };

    const skipToEnd = () => {
        navigation.replace("Login");
    };

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            ref.current.scrollToIndex({ index: currentIndex + 1 });
        } else {
            skipToEnd();
        }
    };

    if (!slides.length) {
        return null; // Render nothing if slides data is not available
    }

    return (
        <View style={{ flex: 1, backgroundColor: isDarkMode ? '#1a1a1a' : '#fff' }}>
            <FlatList
                data={slides}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={updateIndex}
                keyExtractor={(item, index) => index.toString()}
                ref={ref}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                getItemLayout={(data, index) => ({ length: width, offset: width * index, index })}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 20, paddingTop: 10, backgroundColor: isDarkMode ? '#333' : '#007aff' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    {currentIndex === 0 && (
                        <TouchableOpacity onPress={skipToEnd} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{t("screens.onboarding.skip")}</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {slides.map((_, index) => (
                        <View key={index} style={{ height: 8, width: 8, borderRadius: 4, marginHorizontal: 2, backgroundColor: currentIndex === index ? '#fff' : 'rgba(255, 255, 255, 0.5)' }} />
                    ))}
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    {currentIndex === slides.length - 1 ? (
                        <TouchableOpacity onPress={skipToEnd} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{t("screens.onboarding.start")}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={handleNext} style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontSize: 18 }}>{t("screens.onboarding.next")}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
};

export default OnboardingScreen;
