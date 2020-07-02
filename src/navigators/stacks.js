import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  Image,
} from 'react-native';

import {
  VerifiedScreen,
  ReportScreen,
} from '../screens';
import { strings } from '../constants/strings';
import { CINNABAR } from '../constants/colors';
import LogoHeader from '../resources/img/logo_fh.svg'

const VerifiedStack = createStackNavigator();

function LogoTitle() {
  return (
    <LogoHeader width={240} height={40} />
  );
}

export const VerifiedStackScreen = () => {
  return (
    <VerifiedStack.Navigator>
      <VerifiedStack.Screen
        name={strings.verifiedTab}
        component={VerifiedScreen}
        options={{
          headerStyle: {
            backgroundColor: CINNABAR,
          },
          headerTitle: props => <LogoTitle {...props} />
        }}
      />
    </VerifiedStack.Navigator>
  );
}