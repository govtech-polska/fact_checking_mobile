import React, { memo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Moment from 'moment';

import { TouchableOpacityDebounce } from './TouchableOpacityDebounce';
import { WHITE_SMOKE, DARK_GRAY } from '../constants/colors';
import VerifiedNot from '../resources/img/verifiedCell/verifiedNot.svg';
import VerifiedOk from '../resources/img/verifiedCell/verifiedOk.svg';
import VerifiedBad from '../resources/img/verifiedCell/verifiedBad.svg';

const VerifiedCell = ({ item, onCellTapped }) => {
  const verificationStatusImage = () => {
    switch (item.verdict) {
      case 'true':
        return <VerifiedOk width={25} height={25} style={{ marginLeft: 8 }} />;
      case 'false':
        return <VerifiedBad width={25} height={25} style={{ marginLeft: 8 }} />;
      default:
        return <VerifiedNot width={25} height={25} style={{ marginLeft: 8 }} />;
    }
  };
  const date = Moment(item.reported_at).format('DD.MM.YYYY');

  return (
    <>
      <TouchableOpacityDebounce
        style={styles.container}
        onPress={() => onCellTapped()}
      >
        <Image
          resizeMode="contain"
          style={styles.image}
          defaultSource={require('../resources/img/verifiedCell/logoPlaceholder.png')}
          source={{ uri: item.screenshot_url || '' }}
        />
        <View style={{ flex: 2 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {verificationStatusImage()}
      </TouchableOpacityDebounce>
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
    alignItems: 'center'
  },
  image: {
    flex: 1,
    width: '25%',
    aspectRatio: 2,
    backgroundColor: WHITE_SMOKE,
    marginRight: 12
  },
  verificationResult: {
    width: 25,
    marginLeft: 8
  },
  separator: {
    height: 1,
    backgroundColor: WHITE_SMOKE,
    marginHorizontal: 16
  },
  title: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold'
  },
  date: {
    color: DARK_GRAY,
    fontSize: 12,
    marginTop: 4
  }
});

export default memo(VerifiedCell);
