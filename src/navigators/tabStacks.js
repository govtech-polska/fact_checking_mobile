/* eslint-disable react/prop-types */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import { ReportScreen } from '../screens';
import { VerifiedStackScreen } from './stacks';
import { strings } from '../constants/strings';

const Tab = createBottomTabNavigator();

export const verifiedStack = () => {
  return (
    <Tab.Screen
      name="Verified"
      component={VerifiedStackScreen}
      options={{
        tabBarLabel: strings.verifiedTab,
        tabBarIcon: ({ color, size }) => {
          return (
            <Image
              resizeMode="contain"
              style={{ width: size, height: size, tintColor: color }}
              source={require('../resources/img/tabBar/verifiedTabIcon.png')}
            />
          );
        },
      }}
    />
  );
};

export const reportStack = () => {
  return (
    <Tab.Screen
      name="Report"
      component={ReportScreen}
      options={{
        tabBarLabel: 'Report',
        tabBarIcon: ({ color, size }) => {
          return (
            <Image
              resizeMode="contain"
              style={{ width: size, height: size, backgroundColor: color }}
            />
          );
        },
      }}
    />
  );
};
