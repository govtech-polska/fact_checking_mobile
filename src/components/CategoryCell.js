import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

import TouchableOpacityDebounce from './TouchableOpacityDebounce';
import { CINNABAR, BLACK, WHITE } from '../constants/colors';

const CategoryCell = ({ item, isSelected, onCellTapped, textColor }) => {
  const containerStyles = [
    styles.container,
    isSelected && styles.containerSelected,
  ];
  const textStyles = [
    styles.text,
    isSelected && styles.textSelected,
    textColor && { color: textColor },
  ];

  return (
    <TouchableOpacityDebounce style={containerStyles} onPress={onCellTapped}>
      <Text style={textStyles}>{item.name}</Text>
    </TouchableOpacityDebounce>
  );
};

CategoryCell.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
  }),
  isSelected: PropTypes.bool,
  onCellTapped: PropTypes.func,
  textColor: PropTypes.string,
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
