import 'react-native-gesture-handler';
import * as React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }} />
    </NavigationContainer>
  );
}
