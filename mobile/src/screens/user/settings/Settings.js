import React from "react";
import { ScrollView, Text, View, Switch, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { useColorSchemeContext } from "../../../context/ColorSchemeContext";
import { useTranslation } from "react-i18next";

const Settings = () => {
    const { colorScheme, toggleColorSchemeMethod } = useColorSchemeContext();
    const { t, i18n } = useTranslation();

    return (
        <Animatable.View
            animation="fadeInRight"
            className={`flex-1 ${colorScheme === 'dark' ? 'bg-gray-900' : 'bg-[#3575EF]'} p-6`}
        >
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-lg font-medium text-black dark:text-white">
                        {t('screens.drawer.darkMode')}
                    </Text>
                    <Switch
                        value={colorScheme === 'dark'}
                        onValueChange={toggleColorSchemeMethod}
                    />
                </View>
                <View className="mt-3">
                    <Text className="text-lg font-medium text-black dark:text-white mb-4 text-center">
                        {t('screens.languageSwitcher.title')}
                    </Text>
                    <View className="flex-row justify-center space-x-4">
                        <TouchableOpacity
                            className="p-3 bg-gray-200 dark:bg-gray-600 rounded-md"
                            onPress={() => i18n.changeLanguage("en")}
                        >
                            <Text className="text-md font-medium text-black dark:text-white">
                                {t('screens.languageSwitcher.english')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="p-3 bg-gray-200 dark:bg-gray-600 rounded-md"
                            onPress={() => i18n.changeLanguage("pl")}
                        >
                            <Text className="text-md font-medium text-black dark:text-white">
                                {t('screens.languageSwitcher.polish')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </Animatable.View>
    );
};

export default Settings;
