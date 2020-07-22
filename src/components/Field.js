import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, View, TextInput, Platform } from 'react-native';
import { GAINSBORO, BLACK, CINNABAR } from '../constants/colors';

const FONT_SIZE = Platform.OS === 'ios' ? 20 : 14;
const Field = ({
  value,
  onChangeText,
  label,
  error,
  endAdornment,
  ...rest
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
        {endAdornment}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

Field.propTypes = {
  label: PropTypes.string,
  onChangeText: PropTypes.func,
  value: PropTypes.string,
  error: PropTypes.string,
  endAdornment: PropTypes.any,
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 24,
  },
  inputWrapper: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: GAINSBORO,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: BLACK,
    fontSize: 14,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE,
    padding: 2,
    paddingHorizontal: 8,
  },
  error: {
    marginTop: 2,
    fontSize: 13,
    color: CINNABAR,
  },
});

export default Field;
