/* eslint-disable react/prop-types */
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  VerifiedStackScreen,
  ReportStackScreen,
  InfoStackScreen,
  DraftsStackScreen,
} from './stacks';
import { strings } from '../constants/strings';
import VerifiedTabIcon from '../resources/img/tabBar/verifiedTabIcon.svg';
import ReportTabIcon from '../resources/img/tabBar/reportTabIcon.svg';
import InfoTabIcon from '../resources/img/tabBar/infoTabIcon.svg';
import DraftsTabIcon from '../resources/img/tabBar/draftsTabIcon.svg';

const Tab = createBottomTabNavigator();

export const verifiedStack = () => {
  return (
    <Tab.Screen
      name="Verified"
      component={VerifiedStackScreen}
      options={{
        tabBarLabel: strings.verifiedTab,
        tabBarIcon: ({ color, size }) => (
          <VerifiedTabIcon width={size} height={size} fill={color} />
        ),
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
        tabBarIcon: ({ color, size }) => (
          <ReportTabIcon width={size} height={size} fill={color} />
        ),
      }}
    />
  );
};

export const draftsStack = () => {
  return (
    <Tab.Screen
      name="Drafts"
      component={DraftsStackScreen}
      options={{
        tabBarLabel: strings.draftsTab,
        tabBarIcon: ({ color, size }) => (
          <DraftsTabIcon width={size} height={size} color={color} />
        ),
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
