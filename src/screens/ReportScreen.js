import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  View,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Voice from '@react-native-community/voice';
import Mic from '../resources/img/mic.svg';
import Record from '../resources/img/recording.svg';

import { strings } from '../constants/strings';
import { GAINSBORO, CINNABAR, EMPRESS, DARK_GRAY } from '../constants/colors';
import { DropDownAlert, TouchableOpacityDebounce } from '../components';

const FONT_SIZE = Platform.OS === 'ios' ? 20 : 14;

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePath: null,
      speechRecognitionAvailable: false,
      whatIsWrong: '',
      error: false,
      end: false,
      started: false,
      recognitionResult: '',
    };
    Voice.onSpeechStart = this.onSpeechStart;
    Voice.onSpeechEnd = this.onSpeechEnd;
    Voice.onSpeechError = this.onSpeechError;
    Voice.onSpeechResults = this.onSpeechResults;
  }

  componentDidMount() {
    this.checkVoiceAvailability();
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  selectPhotoTapped = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      this.setState({ imagePath: image.path });
    });
  };

  async checkVoiceAvailability() {
    const voice = await Voice.isAvailable();
    this.setState({ speechRecognitionAvailable: !!voice });
  }

  onSpeechStart = () => {
    this.setState({ started: true });
  };

  onSpeechEnd = () => {
    const newState = {
      started: false,
      end: true,
    };
    if (Platform.OS === 'ios') {
      const { whatIsWrong, recognitionResult } = this.state;
      newState.whatIsWrong = whatIsWrong + recognitionResult;
    }
    this.setState(newState);
  };

  onSpeechError = () => {
    this.setState({ error: true, end: true, started: false });
  };

  onSpeechResults = (e) => {
    if (e.value.length > 0) {
      if (Platform.OS == 'ios') {
        this.setState({ recognitionResult: e.value[0] });
      } else {
        this.setState(({ whatIsWrong }) => ({
          whatIsWrong: whatIsWrong + e.value[0],
        }));
      }
    }
  };

  _startRecognizing = async () => {
    this.setState({
      error: false,
      started: false,
      recognitionResult: '',
      end: false,
    });

    try {
      await Voice.start('pl-PL');
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error(e);
    }
  };

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  };

  toggleRecognizing = () => {
    const { started, end } = this.state;
    if ((end && !started) || (!end && !started)) {
      this._startRecognizing();
    } else {
      this._stopRecognizing();
    }
  };

  renderProperImageView = () => {
    const { imagePath } = this.state;
    if (!imagePath) {
      return (
        <TouchableOpacityDebounce
          style={{ ...styles.button, backgroundColor: EMPRESS }}
          onPress={() => this.selectPhotoTapped()}
        >
          <Text style={styles.buttonLabel}>
            {strings.report.imageButtonLabel}
          </Text>
        </TouchableOpacityDebounce>
      );
    }

    return (
      <TouchableOpacityDebounce
        onPress={() => this.selectPhotoTapped()}
        style={styles.imageContainer}
      >
        <Image style={styles.image} source={{ uri: imagePath || '' }} />
      </TouchableOpacityDebounce>
    );
  };

  renderSpeechRecognitionButtonIfNeeded = () => {
    const { speechRecognitionAvailable, started } = this.state;

    const image = () => {
      if (started) {
        return <Record width={40} height={25} fill={CINNABAR} />;
      }
      return <Mic width={40} height={25} fill={DARK_GRAY} />;
    };

    if (speechRecognitionAvailable) {
      return (
        <View
          style={{
            width: 40,
            justifyContent: 'center',
          }}
        >
          <TouchableOpacityDebounce onPress={this.toggleRecognizing}>
            {image()}
          </TouchableOpacityDebounce>
        </View>
      );
    }
  };

  render() {
    const { end, recognitionResult, whatIsWrong } = this.state;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="never"
          keyboardDismissMode={'interactive'}
          style={{ paddingHorizontal: 16 }}
        >
          <Text style={styles.title}>{strings.report.title}</Text>

          <Text style={styles.label}>{strings.report.addLinkLabel}</Text>
          <TextInput
            style={styles.inputLabel}
            multiline={true}
            autoCorrect={false}
          />

          <Text style={styles.label}>{strings.report.whatIsWrong}</Text>
          <View style={styles.labelWithButtonContainer}>
            <TextInput
              style={styles.inputLabelWithButton}
              value={end ? whatIsWrong : whatIsWrong + recognitionResult}
              multiline={true}
              onChangeText={(text) => this.setState({ whatIsWrong: text })}
            />
            {this.renderSpeechRecognitionButtonIfNeeded()}
          </View>

          {this.renderProperImageView()}

          <Text style={styles.label}>{strings.report.emailLabel}</Text>
          <TextInput style={styles.inputLabel} keyboardType={'email-address'} />

          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: CINNABAR }}
            onPress={() => DropDownAlert.showError()}
          >
            <Text style={styles.buttonLabel}>{strings.report.sendButton}</Text>
          </TouchableOpacityDebounce>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    color: 'black',
    fontSize: Platform.OS === 'ios' ? 30 : 24,
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
    padding: 2,
    flexDirection: 'row',
    fontSize: FONT_SIZE,
  },
  labelWithButtonContainer: {
    flexDirection: 'row',
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: GAINSBORO,
    alignItems: 'center',
    minHeight: 40,
  },
  inputLabelWithButton: {
    flex: 1,
    marginLeft: 2,
    paddingHorizontal: 5,
    paddingVertical: 10,
    textAlignVertical: 'center',
    fontSize: FONT_SIZE,
  },
  button: {
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CINNABAR,
    marginTop: 24,
  },
  buttonLabel: {
    color: 'white',
    fontSize: 14,
    textTransform: 'uppercase',
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
  },
});

export default ReportScreen;
