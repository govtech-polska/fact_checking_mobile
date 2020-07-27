import * as React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { tabStack } from './tabStacks';
import { ReportScreen } from '../screens';
import { routes } from '../constants/routes';

const RootStack = createStackNavigator();

export const rootStack = () => {
  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={() => {
        return {
          headerShown: false,
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        };
      }}
    >
      <RootStack.Screen
        name="Main"
        component={tabStack}
        options={{ headerShown: false }}
      />
      <RootStack.Screen name={routes.reportModal} component={ReportScreen} />
    </RootStack.Navigator>
  );
};
