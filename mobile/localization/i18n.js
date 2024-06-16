import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en, pl } from "./translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORE_LANGUAGE_KEY = "settings.lang";

const languageDetectorPlugin = {
    type: "languageDetector",
    async: true,
    init: () => {},
    detect: async function (callback) {
        try {
            // get stored language from Async storage
            // put your own language detection logic here
            const language = await AsyncStorage.getItem(STORE_LANGUAGE_KEY);
            if (language) {
                // if language was stored before, use this language in the app
                callback(language);
            } else {
                // if language was not stored yet, use english
                callback("en");
            }
        } catch (error) {
            console.log("Error reading language", error);
        }
    },
    cacheUserLanguage: async function (language) {
        try {
            // save a user's language choice in Async storage
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
        } catch (error) {
            console.log("Error saving language", error);
        }
    },
};

const resources = {
    en: {
        translation: en,
    },
    pl: {
        translation: pl,
    },
};

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
