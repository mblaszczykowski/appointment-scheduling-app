import React from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View, Text } from 'react-native';

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    return (
        <View className="mt-8 items-center space-x-2">
            <Text className="text-md font-medium text-black dark:text-white mb-4 space-x-4">{t('screens.languageSwitcher.title')}</Text>
            <View className="flex-row justify-center items-center space-x-4">
                <TouchableOpacity
                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-md flex-row justify-center items-center"
                    onPress={() => i18n.changeLanguage("en")}
                >
                    <Text className="text-md font-medium text-black dark:text-white">{t('screens.languageSwitcher.english')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="p-2 bg-gray-200 dark:bg-gray-600 rounded-md flex-row justify-center items-center"
                    onPress={() => i18n.changeLanguage("pl")}
                >
                    <Text className="text-md font-medium text-black dark:text-white">{t('screens.languageSwitcher.polish')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
