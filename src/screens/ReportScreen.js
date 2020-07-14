import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';

import { strings } from '../constants/strings';
import {
  GAINSBORO,
  CINNABAR,
  EMPRESS,
} from '../constants/colors';
import {
  DropDownAlert,
  TouchableOpacityDebounce,
} from '../components';

class ReportScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      imagePath: null,
    };
  }

  selectPhotoTapped = () => {
    ImagePicker.openPicker({
      cropping: false
    }).then(image => {
      this.setState({ imagePath: image.path });
    });
  }

  renderProperImageView = () => {
    const { imagePath } = this.state;
    if (!imagePath) {
      return (
        <TouchableOpacityDebounce
          style={{ ...styles.button, backgroundColor: EMPRESS }}
          onPress={() => this.selectPhotoTapped()}
        >
          <Text style={styles.buttonLabel}>
            {strings.imageButtonLabel}
          </Text>
        </TouchableOpacityDebounce>

      );
    }


    return (
      <TouchableOpacityDebounce
        onPress={() => this.selectPhotoTapped()}
        style={styles.imageContainer}
      >
        <Image
          style={styles.image}
          source={{ uri: imagePath || '' }}
        />
      </TouchableOpacityDebounce>
    );
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="never"
          keyboardDismissMode={'interactive'}
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

          {this.renderProperImageView()}

          <Text style={styles.label}>
            {strings.emailLabel}
          </Text>
          <TextInput style={styles.inputLabel} />

          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: CINNABAR }}
            onPress={() => DropDownAlert.showError()}
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
  imageContainer: {
    marginTop: 24,
    width: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
    aspectRatio: 1.3,
    borderWidth: 1,
    borderColor: GAINSBORO,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  }
});

export default ReportScreen;
