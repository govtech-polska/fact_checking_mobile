import 'react-native-gesture-handler';
import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import store from './base/redux/configureStore';
import { rootStack } from './navigators/rootStack';
import { DropDownAlert } from './components';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>{rootStack()}</NavigationContainer>
      <DropDownAlert />
    </Provider>
  );
}
