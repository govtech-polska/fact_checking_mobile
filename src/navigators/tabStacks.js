/* eslint-disable react/prop-types */
import * as React from 'react';
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

const Tab = createBottomTabNavigator();

const verifiedStack = () => {
  return (
    <Tab.Screen
      name="Verified"
      component={VerifiedModalStackScreen}
      options={{
        tabBarLabel: strings.verifiedTab,
        tabBarIcon: ({ color, size }) => (
          <VerifiedTabIcon width={size} height={size} fill={color} />
        ),
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
        tabBarIcon: ({ color, size }) => (
          <ReportTabIcon width={size} height={size} fill={color} />
        ),
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
        tabBarIcon: ({ color, size }) => (
          <DraftsTabIcon width={size} height={size} color={color} />
        ),
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
        tabBarIcon: ({ color, size }) => (
          <InfoTabIcon width={size} height={size} fill={color} />
        ),
      }}
    />
  );
};

export const tabStack = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: CINNABAR,
      }}
    >
      {verifiedStack()}
      {reportStack()}
      {draftsStack()}
      {infoStack()}
    </Tab.Navigator>
  );
};
