import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import LogoSvg from '../resources/img/logo_fh.svg';

const LogoTitle = () => {
  return (
    <View style={styles.wrapper}>
      {Platform.OS === 'ios' ? (
        <LogoSvg width="80%" height="80%" />
      ) : (
        <LogoSvg width="100%" height="100%" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    ...Platform.select({
      android: {
        paddingVertical: 12,
      },
      ios: {
        paddingBottom: 8,
      },
    }),
  },
});

export default LogoTitle;
