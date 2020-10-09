import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
import Moment from 'moment';

import TouchableOpacityDebounce from './TouchableOpacityDebounce';
import {
  WHITE_SMOKE,
  DARK_GRAY,
  VERDICT_TRUE,
  VERDICT_FALSE,
  VERDICT_UNIDENTIFIED,
  BLACK,
} from '../constants/colors';
import VerifiedNot from '../resources/img/verifiedCell/verifiedNot.svg';
import VerifiedOk from '../resources/img/verifiedCell/verifiedOk.svg';
import VerifiedBad from '../resources/img/verifiedCell/verifiedBad.svg';
const LOGO_PLACEHOLDER = require('../resources/img/verifiedCell/logoPlaceholder.png');

const VERIFICATION_STATUS_IMAGE = {
  true: (
    <VerifiedOk
      width={25}
      height={25}
      style={{ marginLeft: 8, color: VERDICT_TRUE }}
    />
  ),
  false: (
    <VerifiedBad
      width={25}
      height={25}
      style={{ marginLeft: 8, color: VERDICT_FALSE }}
    />
  ),
  unidentified: (
    <VerifiedNot
      width={25}
      height={25}
      style={{ marginLeft: 8, color: VERDICT_UNIDENTIFIED }}
    />
  ),
};

const VerifiedCell = ({ item, onCellTapped }) => {
  const date = Moment(item.reported_at).format('DD.MM.YYYY');
  const imageSource = item.screenshot_url
    ? { uri: item.screenshot_url }
    : LOGO_PLACEHOLDER;
  return (
    <>
      <TouchableOpacityDebounce style={styles.container} onPress={onCellTapped}>
        <Image
          resizeMode={item.screenshot_url ? 'cover' : 'contain'}
          style={styles.image}
          defaultSource={LOGO_PLACEHOLDER}
          source={imageSource}
        />
        <View style={{ flex: 2 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {VERIFICATION_STATUS_IMAGE[item.verdict]}
      </TouchableOpacityDebounce>
      <View style={styles.separator} />
    </>
  );
};

VerifiedCell.propTypes = {
  item: PropTypes.shape({
    reported_at: PropTypes.string,
    screenshot_url: PropTypes.string,
    title: PropTypes.string,
    verdict: PropTypes.string,
  }),
  onCellTapped: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '25%',
    minHeight: 60,
    maxHeight: 160,
    height: '100%',
    backgroundColor: WHITE_SMOKE,
    marginRight: 12,
  },
  verificationResult: {
    width: 25,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: WHITE_SMOKE,
    marginHorizontal: 16,
  },
  title: {
    color: BLACK,
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    color: DARK_GRAY,
    fontSize: 12,
    marginTop: 4,
  },
});

export default VerifiedCell;
