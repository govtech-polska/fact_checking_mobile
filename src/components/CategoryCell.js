import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

import TouchableOpacityDebounce from './TouchableOpacityDebounce';
import { CINNABAR, BLACK } from '../constants/colors';

const CategoryCell = ({ item, isSelected, onCellTapped, textColor }) => {
  return (
    <TouchableOpacityDebounce
      style={{
        ...styles.container,
        backgroundColor: isSelected ? CINNABAR : 'transparent',
      }}
      onPress={() => onCellTapped()}
    >
      <Text
        style={{
          textTransform: 'capitalize',
          color: textColor || BLACK,
        }}
      >
        {item.name}
      </Text>
    </TouchableOpacityDebounce>
  );
};

CategoryCell.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  isSelected: PropTypes.bool,
  onCellTapped: PropTypes.func,
  textColor: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 2,
    marginVertical: 5,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    paddingHorizontal: 5,
  },
});

export default memo(CategoryCell);
