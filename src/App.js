import 'react-native-gesture-handler';
import * as React from 'react';
import { Provider } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import DropdownAlert from 'react-native-dropdownalert';

import store from './store/configureStore';
import {
  verifiedStack,
  reportStack,
} from './navigators/tabStacks';
import { CINNABAR } from './constants/colors';
import {
  DropDownAlert,
} from './components';

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
          { reportStack() }
        </Tab.Navigator>
      </NavigationContainer>
      <DropDownAlert />
    </Provider>
  );
}