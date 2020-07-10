import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  View,
} from 'react-native';

import {
  VerifiedScreen,
  VerifiedDetailsScreen,
  ReportScreen,
} from '../screens';
import { strings } from '../constants/strings';
import { CINNABAR } from '../constants/colors';
import LogoHeader from '../resources/img/logo_fh.svg'

const VerifiedStack = createStackNavigator();
const ReportStack = createStackNavigator();

function LogoTitle() {
  return (
    <View style={{ alignItems: 'center' }}>
      <LogoHeader width={240} height={40} />
    </View>
  );
}

export const VerifiedStackScreen = () => {
  return (
    <VerifiedStack.Navigator>
      <VerifiedStack.Screen
        name={strings.verifiedTab}
        component={VerifiedScreen}
        options={{
          title: ' ',
          headerStyle: {
            backgroundColor: CINNABAR,
          },
          headerTitle: props => <LogoTitle {...props} />
        }}
      />
      <VerifiedStack.Screen
        name='VerifiedDetailsScreen'
        component={VerifiedDetailsScreen}
        options={{ title: '' }}
      />
    </VerifiedStack.Navigator>
  );
}

export const ReportStackScreen = () => {
  return (
    <ReportStack.Navigator>
      <ReportStack.Screen
        name={strings.reportTab}
        component={ReportScreen}
        options={{
          title: ' ',
          headerStyle: {
            backgroundColor: CINNABAR,
          },
          headerTitle: props => <LogoTitle {...props} />
        }}
      />
    </ReportStack.Navigator>
  );
}
