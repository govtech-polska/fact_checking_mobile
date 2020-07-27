import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text, Image } from 'react-native';
import moment from 'moment';

import { TouchableOpacityDebounce } from '../components';

import { WHITE, WHITE_SMOKE, EMPRESS } from '../constants/colors';
import { strings } from '../constants/strings';

const DraftsListItem = ({ item, onPress }) => {
  return (
    <View style={styles.row}>
      <TouchableOpacityDebounce onPress={onPress}>
        <View style={styles.wrapper}>
          <Image
            style={styles.image}
            defaultSource={require('../resources/img/verifiedCell/logoPlaceholder.png')}
            source={{ uri: item.image }}
          />
          <View style={styles.contentWrapper}>
            <Text style={styles.date}>
              {moment(item.savedAt).format('DD.MM.YYYY HH:mm')}
            </Text>
            <Text style={styles.comment}>
              {item.comment || strings.drafts.commentEmptyState}
            </Text>
            <Text style={styles.url}>
              {item.url || strings.drafts.urlEmptyState}
            </Text>
          </View>
        </View>
      </TouchableOpacityDebounce>
    </View>
  );
};

DraftsListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    comment: PropTypes.string,
    image: PropTypes.string,
    savedAt: PropTypes.string,
    url: PropTypes.string,
  }),
  onPress: PropTypes.func,
};

const styles = StyleSheet.create({
  row: {
    backgroundColor: WHITE,
  },
  wrapper: {
    width: '100%',
    flexDirection: 'row',
    padding: 8,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: WHITE_SMOKE,
  },
  image: {
    flex: 1,
    minHeight: 100,
    resizeMode: 'contain',
    backgroundColor: WHITE_SMOKE,
    marginRight: 16,
  },
  contentWrapper: {
    flex: 3,
  },
  date: {
    fontSize: 13,
    color: EMPRESS,
    marginBottom: 2,
  },
  url: {
    fontSize: 13,
    fontStyle: 'italic',
    color: EMPRESS,
  },
  comment: {
    flex: 1,
    marginBottom: 2,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: WHITE_SMOKE,
  },
});

export default DraftsListItem;
