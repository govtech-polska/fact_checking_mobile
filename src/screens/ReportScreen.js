import React, { useState } from 'react';
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
import { useThrottle } from '@react-hook/throttle';

import Mic from '../resources/img/mic.svg';
import Record from '../resources/img/recording.svg';

import { strings } from '../constants/strings';
import {
  GAINSBORO,
  CINNABAR,
  EMPRESS,
  DARK_GRAY,
  BLACK,
  WHITE,
} from '../constants/colors';
import {
  DropDownAlert,
  TouchableOpacityDebounce,
  Title,
  Container,
} from '../components';
import { useVoiceRecognition } from '../utils/useVoiceRecognition';

const FONT_SIZE = Platform.OS === 'ios' ? 20 : 14;
const ReportScreen = () => {
  const [imagePath, setImagePath] = useState(null);

  const [partialRecognition, setPartialRecognition] = useThrottle('');
  const [whatIsWrong, setWhatIsWrong] = useState('');

  const {
    isAvailable,
    isStarted,
    startRecognizing,
    stopRecognizing,
  } = useVoiceRecognition({
    onSpeechResult: (value) => setWhatIsWrong((old) => old + value),
    onSpeechPartialResults: (value) => setPartialRecognition(value),
  });

  const toggleRecognizing = () => {
    if (!isStarted) {
      setPartialRecognition('');
      startRecognizing();
    } else {
      stopRecognizing();
    }
  };

  const selectPhotoTapped = () => {
    ImagePicker.openPicker({
      cropping: false,
    }).then((image) => {
      setImagePath(image.path);
    });
  };

  const renderProperImageView = () => {
    if (!imagePath) {
      return (
        <TouchableOpacityDebounce
          style={{ ...styles.button, backgroundColor: EMPRESS }}
          onPress={selectPhotoTapped}
        >
          <Text style={styles.buttonLabel}>
            {strings.report.imageButtonLabel}
          </Text>
        </TouchableOpacityDebounce>
      );
    }

    return (
      <TouchableOpacityDebounce
        onPress={selectPhotoTapped}
        style={styles.imageContainer}
      >
        <Image style={styles.image} source={{ uri: imagePath || '' }} />
      </TouchableOpacityDebounce>
    );
  };

  return (
    <SafeAreaView style={styles.bg}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="interactive"
      >
        <Container>
          <Title title={strings.report.title} />

          <Text style={styles.label}>{strings.report.addLinkLabel}</Text>
          <TextInput style={styles.input} autoCorrect={false} />

          <Text style={styles.label}>{strings.report.whatIsWrong}</Text>
          <View style={styles.inputWithButtonContainer}>
            <TextInput
              style={styles.inputWithButton}
              value={isStarted ? whatIsWrong + partialRecognition : whatIsWrong}
              multiline={true}
              onChangeText={(text) => !isStarted && setWhatIsWrong(text)}
            />
            {isAvailable && (
              <TouchableOpacityDebounce onPress={toggleRecognizing}>
                {isStarted && <Record width={40} height={25} fill={CINNABAR} />}
                {!isStarted && <Mic width={40} height={25} fill={DARK_GRAY} />}
              </TouchableOpacityDebounce>
            )}
          </View>

          {renderProperImageView()}

          <Text style={styles.label}>{strings.report.emailLabel}</Text>
          <TextInput style={styles.input} keyboardType="email-address" />

          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: CINNABAR }}
            onPress={() => DropDownAlert.showError()}
          >
            <Text style={styles.buttonLabel}>{strings.report.sendButton}</Text>
          </TouchableOpacityDebounce>
        </Container>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const inputContainerStyles = {
  minHeight: 40,
  borderWidth: 1,
  borderRadius: 5,
  borderColor: GAINSBORO,
  marginTop: 8,
  flexDirection: 'row',
  alignItems: 'center',
};

const inputStyles = {
  flex: 1,
  fontSize: FONT_SIZE,
  padding: 2,
  paddingHorizontal: 8,
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
  label: {
    color: BLACK,
    fontSize: 14,
    marginTop: 24,
  },
  input: {
    ...inputContainerStyles,
    ...inputStyles,
  },
  inputWithButtonContainer: {
    ...inputContainerStyles,
  },
  inputWithButton: {
    ...inputStyles,
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
