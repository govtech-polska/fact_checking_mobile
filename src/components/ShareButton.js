import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet } from 'react-native';

import TouchableOpacityDebounce from './TouchableOpacityDebounce';
import AndroidShareImg from '../resources/img/share-android.svg';
import IOSShareImg from '../resources/img/share-ios.svg';
import { BLACK, CINNABAR } from '../constants/colors';

const isAndroid = Platform.OS === 'android';
const ShareButton = ({ onShare }) => (
  <TouchableOpacityDebounce style={styles.shareButton} onPress={onShare}>
    {isAndroid && <AndroidShareImg fill={BLACK} />}
    {!isAndroid && <IOSShareImg fill={CINNABAR} />}
  </TouchableOpacityDebounce>
);

ShareButton.propTypes = {
  onShare: PropTypes.func,
};

const styles = StyleSheet.create({
  shareButton: {
    width: 24,
    height: 24,
    marginRight: isAndroid ? 16 : 8,
  },
});

export default ShareButton;
