import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import translationEN from "./EN/EN.json";
import translationPL from "./PL/PL.json";

i18n.use(LanguageDetector).use(initReactI18next)
    .init(
        {
            debug: true,
            lng: "EN",
            fallbackLng: "EN",
            keySeparator: false,

            interpolation: {
                escapeValue: false
            },

            resources: {
                EN: {
                    translations: translationEN
                },
                PL: {
                    translations: translationPL
                }
            },
            ns: ["translations"],
            defaultNS: "translations"
        }
    );
export default i18n;