import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { BLACK } from '../constants/colors';

export const TITLE_HEIGHT = 56;

const Title = ({ title }) => <Text style={styles.title}>{title}</Text>;

Title.propTypes = {
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  title: {
    color: BLACK,
    fontSize: 24,
    height: TITLE_HEIGHT,
    paddingTop: 16,
  },
});

export default Title;
