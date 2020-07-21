import * as React from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import { tabStack } from './tabStacks';
import { ReportScreen } from '../screens';

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
      <RootStack.Screen name="ReportModal" component={ReportScreen} />
    </RootStack.Navigator>
  );
};
