import * as RNLocalize from 'react-native-localize';
import store from '../base/redux/configureStore';

const translationGetters = {
  en: () => require('./strings.en').strings,
  pl: () => require('./strings.pl').strings,
};

const findBestLanguage = (languageArray) => {
  const currentLocales = RNLocalize.getLocales();
  const currentLanguage = currentLocales[0].languageCode || 'pl';
  return languageArray.indexOf(currentLanguage) !== -1 ? currentLanguage : 'pl';
};

const languageTag = findBestLanguage(Object.keys(translationGetters));

const strings = translationGetters[languageTag]();

store.dispatch({
  type: 'SET_LANGUAGE',
  payload: languageTag,
});

export { strings };
