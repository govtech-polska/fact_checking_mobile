import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import Moment from 'moment';

import {
  WHITE_SMOKE,
  DARK_GRAY,
} from '../constants/colors'

const VerifiedCell = ({ item }) => {
  const verificationStatusImageUrl = () => {
    switch (item.verdict) {
      case 'true': return require('../resources/img/verifiedCell/verifiedOk.png')
      case 'false': return require('../resources/img/verifiedCell/verifiedBad.png')
      case 'unidentified': return require('../resources/img/verifiedCell/verifiedNot.png')
      default: return require('../resources/img/verifiedCell/verifiedNot.png')
    }
  }
  const date = Moment(item.reported_at).format('DD.MM.YYYY')

  return (
    <>
      <View style={styles.container}>
        <Image
          resizeMode='contain'
          style={styles.image}
          defaultSource={require('../resources/img/verifiedCell/logoPlaceholder.png')}
          source={{ uri: item.screenshot_url || '' }}
        />
        <View style={{ flex: 2 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
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
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
  date: {
    color: DARK_GRAY,
    fontSize: 12,
    marginTop: 4,
  }
});

export default memo(VerifiedCell);
