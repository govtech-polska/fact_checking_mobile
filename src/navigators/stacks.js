import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';

import {
  VerifiedScreen,
  VerifiedDetailsScreen,
  ReportScreen,
  InfoScreen,
  InfoAboutScreen,
} from '../screens';
import { strings } from '../constants/strings';
import { CINNABAR } from '../constants/colors';
import LogoHeader from '../resources/img/logo_fh.svg';
import { routes } from '../constants/routes';
import ReportImageEditScreen from '../screens/ReportImageEditScreen';

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
        name={strings.verifiedTab}
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
        name={strings.reportTab}
        component={ReportScreen}
        options={mainScreenOptions}
      />
      <InfoStack.Screen
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
        name={strings.verifiedTab}
        component={InfoScreen}
        options={mainScreenOptions}
      />
      <InfoStack.Screen
        name={routes.infoAbout}
        component={InfoAboutScreen}
        options={{ title: '' }}
      />
    </InfoStack.Navigator>
  );
};
