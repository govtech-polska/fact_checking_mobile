/* eslint-disable react/prop-types */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  VerifiedModalStackScreen,
  ReportStackScreen,
  InfoStackScreen,
  DraftsStackScreen,
} from './stacks';
import { strings } from '../constants/strings';
import { CINNABAR } from '../constants/colors';
import VerifiedTabIcon from '../resources/img/tabBar/verifiedTabIcon.svg';
import ReportTabIcon from '../resources/img/tabBar/reportTabIcon.svg';
import InfoTabIcon from '../resources/img/tabBar/infoTabIcon.svg';
import DraftsTabIcon from '../resources/img/tabBar/draftsTabIcon.svg';
import { Platform } from 'react-native';

const Tab = createBottomTabNavigator();

const createTabBarIcon = (Component) => ({ color, size }) => (
  <Component width={size} height={size} fill={color} color={color} />
);

const verifiedStack = () => {
  return (
    <Tab.Screen
      name="Verified"
      component={VerifiedModalStackScreen}
      options={{
        tabBarLabel: strings.verifiedTab,
        tabBarIcon: createTabBarIcon(VerifiedTabIcon),
      }}
    />
  );
};

const reportStack = () => {
  return (
    <Tab.Screen
      name="Report"
      component={ReportStackScreen}
      options={{
        tabBarLabel: strings.reportTab,
        tabBarIcon: createTabBarIcon(ReportTabIcon),
      }}
    />
  );
};

const draftsStack = () => {
  return (
    <Tab.Screen
      name="Drafts"
      component={DraftsStackScreen}
      options={{
        tabBarLabel: strings.draftsTab,
        tabBarIcon: createTabBarIcon(DraftsTabIcon),
      }}
    />
  );
};

const infoStack = () => {
  return (
    <Tab.Screen
      name="Info"
      component={InfoStackScreen}
      options={{
        tabBarLabel: strings.info.title,
        tabBarIcon: createTabBarIcon(InfoTabIcon),
      }}
    />
  );
};

export const tabStack = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: CINNABAR,
        style: {
          ...Platform.select({
            android: {
              paddingBottom: 4,
            },
          }),
        },
      }}
    >
      {verifiedStack()}
      {reportStack()}
      {draftsStack()}
      {infoStack()}
    </Tab.Navigator>
  );
};
