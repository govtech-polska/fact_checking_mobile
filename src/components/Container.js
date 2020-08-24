import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

const Container = (props) => (
  <View style={{ ...styles.container, ...props.style }}>{props.children}</View>
);

Container.propTypes = {
  children: PropTypes.any,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
});

export default Container;
