import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { strings } from '../constants/strings';
import {
  GAINSBORO,
  CINNABAR,
  EMPRESS,
} from '../constants/colors';
import {
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
} from '../components';

class ReportScreen extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="never"
          keyboardDismissMode={'interactive'}
          // extraScrollHeight={100}
          style={{ padding: 16 }}
        >
          <Text style={styles.title}>
            {strings.reportTitle}
          </Text>

          <Text style={styles.label}>
            {strings.addLinkLabel}
          </Text>
          <TextInput
            style={styles.inputLabel}
            multiline={true}
          />

          <Text style={styles.label}>
            {strings.whatIsWrong}
          </Text>
          <TextInput style={styles.inputLabel} />
          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: EMPRESS }}
            onPress={() => console.log('ADD PHOTO')}
          >
            <Text style={styles.buttonLabel}>
              {strings.imageButtonLabel}
            </Text>
          </TouchableOpacityDebounce>

          <Text style={styles.label}>
            {strings.emailLabel}
          </Text>
          <TextInput style={styles.inputLabel} />

          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: CINNABAR }}
            onPress={() => console.log('SEND')}
          >
            <Text style={styles.buttonLabel}>
              {strings.sendButton}
            </Text>
          </TouchableOpacityDebounce>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: 24,
  },
  label: {
    color: 'black',
    fontSize: 14,
    marginTop: 24,
  },
  inputLabel: {
    minHeight: 40,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: GAINSBORO,
    marginTop: 8,
    padding: 8,
  },
  button: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    marginTop: 24,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
  },
});

export default ReportScreen;
