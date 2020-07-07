import React, { memo } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import {
  CINNABAR,
  WHITE_SMOKE,
} from '../constants/colors';

const LoadingOverlay = ({ visible }) => {
  if (visible) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' color={CINNABAR} />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: WHITE_SMOKE,
  }
});

export default memo(LoadingOverlay);