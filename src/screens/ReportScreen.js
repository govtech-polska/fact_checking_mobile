import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet, SafeAreaView, View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { useThrottle } from '@react-hook/throttle';

import {
  TouchableOpacityDebounce,
  Title,
  Container,
  Field,
} from '../components';
import Mic from '../resources/img/mic.svg';
import Record from '../resources/img/recording.svg';
import CropSvg from '../resources/img/crop.svg';

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
import { reportActions } from '../storages/report/actions';
import { useVoiceRecognition } from '../utils/useVoiceRecognition';
import { useField } from '../utils/useField';

const isTruth = (v) => !!v;
const ReportScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isFetching } = useSelector(({ report }) => report.submission);

  const [partialRecognition, setPartialRecognition] = useThrottle('');
  const {
    isAvailable,
    isStarted,
    startRecognizing,
    stopRecognizing,
  } = useVoiceRecognition({
    onSpeechResult: (value) => whatIsWrong.setValue((old) => old + value),
    onSpeechPartialResults: (value) => setPartialRecognition(value),
  });

  const [imagePath, setImagePath] = useState(null);
  const [rawImagePath, setRawImagePath] = useState(null);
  const sourceUrl = useField({
    initialValue: '',
    validator: {
      presence: { allowEmpty: false },
      url: true,
    },
  });
  const whatIsWrong = useField({
    initialValue: '',
    validator: {
      presence: { allowEmpty: false },
    },
  });
  const email = useField({
    initialValue: '',
    validator: {
      optional: {
        email: true,
      },
    },
  });

  useEffect(() => {
    const nextImagePath = route.params?.imagePath;
    if (nextImagePath !== imagePath) {
      setImagePath(nextImagePath);
    }
  }, [route.params?.imagePath]);

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
      setRawImagePath(image.path);
    });
  };

  const handleSubmit = () => {
    const allFieldsValid = [
      sourceUrl.isValid(),
      whatIsWrong.isValid(),
      email.isValid(),
    ].every(isTruth);

    if (allFieldsValid && !isFetching) {
      const payload = {
        image: {
          uri: imagePath,
          type: 'image/jpeg',
          name: 'screenshot.jpg',
        },
        comment: whatIsWrong.value,
        email: email.value,
        url: sourceUrl.value,
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) =>
        formData.append(key, value)
      );
      dispatch(reportActions.submitReport(formData));
    }
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
      <View style={styles.imageView}>
        <TouchableOpacityDebounce
          style={styles.imageWrapper}
          onPress={selectPhotoTapped}
        >
          <Image style={styles.image} source={{ uri: imagePath || '' }} />
        </TouchableOpacityDebounce>
        <View style={styles.editBtn}>
          <TouchableOpacityDebounce
            onPress={() =>
              navigation.push(routes.reportImageEdit, {
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

  return (
    <SafeAreaView style={styles.bg}>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="interactive"
      >
        <Container>
          <Title title={strings.report.title} />

          <Field
            label={strings.report.addLinkLabel}
            value={sourceUrl.value}
            onChangeText={sourceUrl.setValue}
            error={sourceUrl.errors[0]}
            autoCorrect={false}
          />

          <Field
            label={strings.report.whatIsWrong}
            value={
              isStarted
                ? whatIsWrong.value + partialRecognition
                : whatIsWrong.value
            }
            onChangeText={whatIsWrong.setValue}
            error={whatIsWrong.errors[0]}
            endAdornment={
              isAvailable && (
                <TouchableOpacityDebounce onPress={toggleRecognizing}>
                  {isStarted && (
                    <Record width={40} height={25} fill={CINNABAR} />
                  )}
                  {!isStarted && (
                    <Mic width={40} height={25} fill={DARK_GRAY} />
                  )}
                </TouchableOpacityDebounce>
              )
            }
          />

          {renderProperImageView()}

          <Field
            label={strings.report.emailLabel}
            value={email.value}
            onChangeText={email.setValue}
            error={email.errors[0]}
            keyboardType="email-address"
          />

          <TouchableOpacityDebounce
            style={{ ...styles.button, backgroundColor: CINNABAR }}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonLabel}>{strings.report.sendButton}</Text>
          </TouchableOpacityDebounce>
        </Container>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

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
  bg: {
    flex: 1,
    backgroundColor: WHITE,
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
