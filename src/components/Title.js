import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text } from 'react-native';
import { BLACK } from '../constants/colors';

const Title = ({ title }) => <Text style={styles.title}>{title}</Text>;

Title.propTypes = {
  title: PropTypes.string,
};

const styles = StyleSheet.create({
  title: {
    color: BLACK,
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
  },
});

export default Title;
