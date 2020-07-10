/* eslint-disable react/prop-types */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import {
  VerifiedStackScreen,
  ReportStackScreen,
} from './stacks';
import { strings } from '../constants/strings';
import VerifiedTabIcon from '../resources/img/tabBar/verifiedTabIcon.svg'
import ReportTabIcon from '../resources/img/tabBar/reportTabIcon.svg'

const Tab = createBottomTabNavigator();

export const verifiedStack = () => {
  return (
    <Tab.Screen
      name="Verified"
      component={VerifiedStackScreen}
      options={{
        tabBarLabel: strings.verifiedTab,
        tabBarIcon: ({ color, size }) => <VerifiedTabIcon width={size} height={size} fill={color} />
      }}
    />
  );
};

export const reportStack = () => {
  return (
    <Tab.Screen
      name="Report"
      component={ReportStackScreen}
      options={{
        tabBarLabel: strings.reportTab,
        tabBarIcon: ({ color, size }) => <ReportTabIcon width={size} height={size} fill={color} />
      }}
    />
  );
};
