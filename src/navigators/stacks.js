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

const VerifiedStack = createStackNavigator();

function LogoTitle() {
  return (
    <Image
      resizeMode='contain'
      style={{ width: 220 }}
      source={require('../resources/img/logoHeader.png')}
    />
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