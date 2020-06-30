import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';

import { WHITE_SMOKE } from '../constants/colors'

const VerifiedCell = ({ text, verificationStatus }) => {

  const verificationStatusImageUrl = () => {
    switch (verificationStatus) {
      case 'ok': return require('../resources/img/verifiedCell/verifiedOk.png')
      case 'bad': return require('../resources/img/verifiedCell/verifiedBad.png')
      case 'not': return require('../resources/img/verifiedCell/verifiedNot.png')
      default: return require('../resources/img/verifiedCell/verifiedOk.png')
    }
  }

  return (
    <>
    <View style={styles.container}>
      <Image
        resizeMode='contain'
        style={styles.image}
        defaultSource={require('../resources/img/verifiedCell/logoPlaceholder.png')}
      />
      <Text style={{ flex: 2 }}>{text}</Text>
      <Image
        resizeMode='contain'
        style={styles.verificationResult}
        source={verificationStatusImageUrl()}
      />
    </View>
    <View style={styles.separator} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    // backgroundColor: 'yellow',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '25%',
    aspectRatio: 2,
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
  }
});

export { VerifiedCell };
