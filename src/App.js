import 'react-native-gesture-handler';
import './base/configureValidatejs';
import * as React from 'react';
import { Provider } from 'react-redux';
import { AppState, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import RestartAndroid from 'react-native-restart-android';

import store from './base/redux/configureStore';
import { rootStack } from './navigators/rootStack';
import { DropDownAlert } from './components';
import { CINNABAR } from './constants/colors';
import { getCurrentLanguageTag } from './utils/translations';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: CINNABAR,
  },
};

export default function App() {
  const handleAppStateChange = () => {
    const languageTag = getCurrentLanguageTag();

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
