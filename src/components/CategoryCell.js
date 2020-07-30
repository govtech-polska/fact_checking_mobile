import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

import TouchableOpacityDebounce from './TouchableOpacityDebounce';
import { CINNABAR, BLACK, WHITE } from '../constants/colors';

const CategoryCell = ({ item, isSelected, onCellTapped }) => {
  const containerStyles = [
    styles.container,
    isSelected && styles.containerSelected,
  ];
  const textStyles = [
    styles.text,
    isSelected && styles.textSelected,
    // TODO: tmp solution to be fixed in dev/Categories PR
    item.id === '1' && { color: CINNABAR },
  ];

  return (
    <TouchableOpacityDebounce style={containerStyles} onPress={onCellTapped}>
      <Text style={textStyles}>{item.name}</Text>
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
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    paddingHorizontal: 13,
    marginHorizontal: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerSelected: {
    backgroundColor: CINNABAR,
  },
  text: {
    textTransform: 'capitalize',
    color: BLACK,
  },
  textSelected: {
    color: WHITE,
  },
});

export default CategoryCell;
