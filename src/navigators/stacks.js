import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import {
  VerifiedScreen,
  VerifiedDetailsScreen,
  ReportScreen,
  ReportImageEditScreen,
  InfoScreen,
  InfoAboutScreen,
  InfoTeamScreen,
} from '../screens';
import { CINNABAR } from '../constants/colors';
import LogoHeader from '../resources/img/logo_fh.svg';
import { routes } from '../constants/routes';

const VerifiedStack = createStackNavigator();
const ReportStack = createStackNavigator();
const InfoStack = createStackNavigator();

function LogoTitle() {
  return (
    <View style={{ alignItems: 'center' }}>
      <LogoHeader width={240} height={40} />
    </View>
  );
}

const mainScreenOptions = {
  title: ' ',
  headerStyle: {
    backgroundColor: CINNABAR,
  },
  headerTitle: LogoTitle,
};

export const VerifiedStackScreen = () => {
  return (
    <VerifiedStack.Navigator>
      <VerifiedStack.Screen
        name={routes.verified}
        component={VerifiedScreen}
        options={mainScreenOptions}
      />
      <VerifiedStack.Screen
        name={routes.verifiedDetails}
        component={VerifiedDetailsScreen}
        options={{ title: '' }}
      />
    </VerifiedStack.Navigator>
  );
};

export const ReportStackScreen = () => {
  return (
    <ReportStack.Navigator>
      <ReportStack.Screen
        name={routes.report}
        component={ReportScreen}
        options={mainScreenOptions}
      />
      <ReportStack.Screen
        name={routes.reportImageEdit}
        component={ReportImageEditScreen}
        options={{ title: '' }}
      />
    </ReportStack.Navigator>
  );
};

export const InfoStackScreen = () => {
  return (
    <InfoStack.Navigator>
      <InfoStack.Screen
        name={routes.info}
        component={InfoScreen}
        options={mainScreenOptions}
      />
      <InfoStack.Screen
        name={routes.infoAbout}
        component={InfoAboutScreen}
        options={{ title: '' }}
      />
      <InfoStack.Screen
        name={routes.infoTeam}
        component={InfoTeamScreen}
        options={{ title: '' }}
      />
    </InfoStack.Navigator>
  );
};
