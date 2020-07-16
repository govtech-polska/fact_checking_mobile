import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import Voice from '@react-native-community/voice';

import { strings } from '../constants/strings';
import {
  GAINSBORO,
  CINNABAR,
  EMPRESS,
  DARK_GRAY,
  BLACK,
  WHITE,
} from '../constants/colors';
import { routes } from '../constants/routes';

import {
  DropDownAlert,
  TouchableOpacityDebounce,
  Title,
  Container,
} from '../components';
import Mic from '../resources/img/mic.svg';
import Record from '../resources/img/recording.svg';
import CropSvg from '../resources/img/crop.svg';

const FONT_SIZE = Platform.OS === 'ios' ? 20 : 14;

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawImagePath: null,
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

  componentDidUpdate(prevProps, prevState) {
    const { rawImagePath } = this.state;
    const { route } = this.props;

    if (prevState.rawImagePath !== rawImagePath) {
      this.setState({ imagePath: rawImagePath });
    }

    const nextImagePath = route.params?.imagePath;
    if (prevProps.route.params?.imagePath !== nextImagePath) {
      this.setState({ imagePath: nextImagePath });
    }
  }

  selectPhotoTapped = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      this.setState({ rawImagePath: image.path, imagePath: null });
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
    if (Platform.OS === 'ios') {
      this.setState(({ whatIsWrong, recognitionResult }) => ({
        started: false,
        end: true,
        whatIsWrong: whatIsWrong + recognitionResult,
      }));
    } else {
      this.setState({
        started: false,
        end: true,
      });
    }
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

  startRecognizing = async () => {
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

  stopRecognizing = async () => {
    try {
      await Voice.stop();
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
    const { rawImagePath, imagePath } = this.state;
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
      <View style={styles.imageView}>
        <TouchableOpacityDebounce
          style={styles.imageWrapper}
          onPress={() => this.selectPhotoTapped()}
        >
          <Image style={styles.image} source={{ uri: imagePath || '' }} />
        </TouchableOpacityDebounce>
        <View style={styles.editBtn}>
          <TouchableOpacityDebounce
            onPress={() =>
              this.props.navigation.push(routes.reportImageEdit, {
                rawImagePath,
              })
            }
          >
            <CropSvg width={24} height={24} fill={WHITE} />
          </TouchableOpacityDebounce>
        </View>
      </View>
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
      <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps="never"
          keyboardDismissMode={'interactive'}
        >
          <Container>
            <Title title={strings.report.title} />

            <Text style={styles.label}>{strings.report.addLinkLabel}</Text>
            <TextInput style={styles.inputLabel} autoCorrect={false} />

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
            <TextInput
              style={styles.inputLabel}
              keyboardType={'email-address'}
            />

            <TouchableOpacityDebounce
              style={{ ...styles.button, backgroundColor: CINNABAR }}
              onPress={() => DropDownAlert.showError()}
            >
              <Text style={styles.buttonLabel}>
                {strings.report.sendButton}
              </Text>
            </TouchableOpacityDebounce>
          </Container>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

ReportScreen.propTypes = {
  navigation: PropTypes.shape({
    push: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      imagePath: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  title: {
    color: BLACK,
    fontSize: Platform.OS === 'ios' ? 30 : 24,
  },
  label: {
    color: BLACK,
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
    padding: 2,
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
    color: WHITE,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  imageView: {
    marginTop: 24,
    width: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
    borderWidth: 1,
    borderColor: GAINSBORO,
    borderRadius: 4,
  },
  imageWrapper: {
    aspectRatio: 1.3,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  editBtn: {
    backgroundColor: BLACK,
    position: 'absolute',
    top: 3,
    right: 4,
    width: 46,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    zIndex: 9,
  },
});

export default ReportScreen;
