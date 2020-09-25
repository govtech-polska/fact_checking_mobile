import 'react-native-gesture-handler';
import './base/configureValidatejs';
import * as React from 'react';
import { Provider } from 'react-redux';
import { AppState, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import * as RNLocalize from 'react-native-localize';
import RestartAndroid from 'react-native-restart-android';

import store from './base/redux/configureStore';
import { rootStack } from './navigators/rootStack';
import { DropDownAlert } from './components';
import { CINNABAR } from './constants/colors';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: CINNABAR,
  },
};

export default function App() {
  const handleAppStateChange = () => {
    const translationGetters = {
      en: () => require('./constants/strings.en').strings,
      pl: () => require('./constants/strings.pl').strings,
    };

    const findBestLanguage = (languageArray) => {
      const currentLocales = RNLocalize.getLocales();
      const currentLanguage = currentLocales[0].languageCode || 'pl';
      return languageArray.indexOf(currentLanguage) !== -1
        ? currentLanguage
        : 'pl';
    };

    const languageTag = findBestLanguage(Object.keys(translationGetters));

    if (
      languageTag !== store.getState().settings.language &&
      Platform.OS === 'android'
    ) {
      RestartAndroid.restart();
    }
  };

  AppState.addEventListener('change', handleAppStateChange);

  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>{rootStack()}</NavigationContainer>
      <DropDownAlert />
    </Provider>
  );
}
