import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';

import { TouchableOpacityDebounce } from '.';
import {
  WHITE,
  CINNABAR,
  EMPRESS,
  WHITE_SMOKE,
  BLACK,
} from '../constants/colors';

const Button = ({
  onPress,
  disabled,
  loading,
  style,
  children,
  color = 'default',
}) => {
  const wrapperStyles = [
    styles.wrapper,
    colors[color].wrapper,
    disabled && styles.disabledWrapper,
    style,
  ];
  const labelStyles = [
    styles.label,
    colors[color].label,
    disabled && styles.disabledLabel,
  ];

  return (
    <TouchableOpacityDebounce
      style={wrapperStyles}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading && (
        <ActivityIndicator
          style={styles.loader}
          color={colors[color].label.color}
        />
      )}
      <Text style={labelStyles}>{children}</Text>
    </TouchableOpacityDebounce>
  );
};

Button.propTypes = {
  children: PropTypes.string,
  color: PropTypes.oneOf(['default', 'primary', 'secondary']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onPress: PropTypes.func,
  style: PropTypes.object,
};

const colors = {
  default: {
    wrapper: {
      backgroundColor: WHITE_SMOKE,
    },
    label: {
      color: BLACK,
    },
  },
  primary: {
    wrapper: {
      backgroundColor: CINNABAR,
    },
    label: {
      color: WHITE,
    },
  },
  secondary: {
    wrapper: {
      backgroundColor: EMPRESS,
    },
    label: {
      color: WHITE,
    },
  },
};

const styles = StyleSheet.create({
  wrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    textTransform: 'uppercase',
  },
  disabledWrapper: {
    backgroundColor: WHITE_SMOKE,
  },
  disabledLabel: {
    color: 'rgba(0,0,0,0.26)',
  },
  loader: {
    marginRight: 8,
  },
});

export default Button;
