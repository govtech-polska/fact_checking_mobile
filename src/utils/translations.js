import * as RNLocalize from 'react-native-localize';

export const translationGetters = {
  en: () => require('../constants/strings.en').strings,
  pl: () => require('../constants/strings.pl').strings,
};

export const getCurrentLanguageTag = () => {
  const findBestLanguage = (languageArray) => {
    const currentLocales = RNLocalize.getLocales();
    const currentLanguage = currentLocales[0].languageCode || 'en';
    return languageArray.indexOf(currentLanguage) !== -1
      ? currentLanguage
      : 'en';
  };

  return findBestLanguage(Object.keys(translationGetters));
};
