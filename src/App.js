import 'react-native-gesture-handler';
import './base/configureValidatejs';
import * as React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import store from './base/redux/configureStore';
import { verifiedStack, reportStack, infoStack } from './navigators/tabStacks';
import { CINNABAR } from './constants/colors';
import { DropDownAlert } from './components';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: CINNABAR,
          }}
        >
          {verifiedStack()}
          {reportStack()}
          {infoStack()}
        </Tab.Navigator>
      </NavigationContainer>
      <DropDownAlert />
    </Provider>
  );
}
