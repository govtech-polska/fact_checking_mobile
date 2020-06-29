import React, { Component } from 'react';
import {
  Text,
  View,
} from 'react-native';

class VerifiedScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

VerifiedScreen.navigationOptions = {
  title: 'Test',
  tabBarLabel: 'Tab2',
  tabBarIcon: ({ color, size }) => {
    return (
      <Image
        resizeMode='contain'
        style={{ width: size, height: size, backgroundColor: color }}
      />
    );
  },
  gesturesEnabled: false,
};

export default VerifiedScreen;
