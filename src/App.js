import 'react-native-gesture-handler';
import './base/configureValidatejs';
import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

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
  return (
    <Provider store={store}>
      <NavigationContainer theme={theme}>{rootStack()}</NavigationContainer>
      <DropDownAlert />
    </Provider>
  );
}
