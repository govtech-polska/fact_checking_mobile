/* eslint-disable react/prop-types */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';

import { ReportScreen } from '../screens';
import { VerifiedStackScreen, InfoStackScreen } from './stacks';
import { strings } from '../constants/strings';
import InfoTabIcon from '../resources/img/tabBar/infoTabIcon.svg';

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

export const infoStack = () => {
  return (
    <Tab.Screen
      name="Info"
      component={InfoStackScreen}
      options={{
        tabBarLabel: strings.info.title,
        tabBarIcon: ({ color, size }) => (
          <InfoTabIcon width={size} height={size} fill={color} />
        ),
      }}
    />
  );
};
