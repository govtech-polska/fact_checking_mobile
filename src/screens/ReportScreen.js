import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, SafeAreaView, View, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { useThrottle } from '@react-hook/throttle';

import {
  TouchableOpacityDebounce,
  Title,
  Container,
  Field,
  DropDownAlert,
  Button,
} from '../components';
import Mic from '../resources/img/mic.svg';
import Record from '../resources/img/recording.svg';
import CropSvg from '../resources/img/crop.svg';
import Close from '../resources/img/close.svg';

import { strings } from '../constants/strings';
import {
  GAINSBORO,
  CINNABAR,
  DARK_GRAY,
  BLACK,
  WHITE,
} from '../constants/colors';
import { routes } from '../constants/routes';
import { reportActions } from '../storages/report/actions';
import { useVoiceRecognition } from '../utils/useVoiceRecognition';
import { useDrafts } from '../utils/useDrafts';
import { validate } from '../utils/validation';
import { saveTmpImagesToDevice, removeImagesFromDevice } from '../utils/files';

const ReportScreen = ({ navigation, route: { params } }) => {
  const draft = params?.draft ?? {};
  const dispatch = useDispatch();
  const { error, isFetching } = useSelector(({ report }) => report.submission);
  const { addDraft, updateDraft, removeDraft, isSaving } = useDrafts();
  const [partialRecognition, setPartialRecognition] = useThrottle('');
  const [imagePath, setImagePath] = useState(null);
  const [rawImagePath, setRawImagePath] = useState(null);
  const [isModal, setIsModal] = useState(false);
  const {
    reset,
    setValue,
    getValues,
    control,
    handleSubmit,
    errors,
  } = useForm();
  const {
    isAvailable,
    isStarted,
    startRecognizing,
    stopRecognizing,
  } = useVoiceRecognition({
    onSpeechResult: (value) =>
      setValue('comment', getValues('comment') + value),
    onSpeechPartialResults: (value) => setPartialRecognition(value),
  });

  useEffect(() => {
    const url = params?.url;
    if (url && url !== getValues('url')) {
      setValue('url', url);
      setIsModal(true);
    }
  }, []);

  useEffect(() => {
    const nextImagePath = params?.imagePath;
    if (nextImagePath !== imagePath) {
      setImagePath(nextImagePath);
    }
  }, [params?.imagePath]);

  useEffect(() => {
    if (draft.id) {
      setRawImagePath(draft.rawImage);
      setImagePath(draft.image);
      reset(draft);
    }
  }, [draft.id]);

  useEffect(() => {
    error && DropDownAlert.showError();
    return () => {
      dispatch(reportActions.clearSubmitReport());
    };
  }, [error]);

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

  const resetForm = () => {
    setImagePath('');
    setRawImagePath('');
    reset({
      url: '',
      comment: '',
      email: '',
    });
  };

  const onSubmit = (values) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (imagePath) {
      formData.append('image', {
        uri: imagePath,
        type: 'image/jpeg',
        name: 'screenshot.jpg',
      });
    }
    const afterSubmitSuccess = () => {
      resetForm();
      DropDownAlert.showSuccess(
        strings.report.submissionSuccess,
        strings.report.submissionSuccessDescription
      );
      if (draft.id) {
        removeImagesFromDevice(draft.image, draft.rawImage);
        removeDraft(draft.id);
      }
    };

    dispatch(reportActions.submitReport(formData, afterSubmitSuccess));
  };

  const handleDraftSave = async () => {
    const newPaths = await saveTmpImagesToDevice(imagePath, rawImagePath);
    await addDraft({
      ...getValues(),
      image: newPaths[0],
      rawImage: newPaths[1],
    });
    resetForm();
    DropDownAlert.showSuccess(strings.report.draftSaveSuccess);
  };

  const handleDraftUpdate = async () => {
    const newPaths = await saveTmpImagesToDevice(imagePath, rawImagePath);
    removeImagesFromDevice(draft.image, draft.rawImage);
    await updateDraft(draft.id, {
      ...getValues(),
      image: newPaths[0],
      rawImage: newPaths[1],
    });
    resetForm();
    navigation.navigate(routes.drafts);
  };

  const renderProperImageView = () => {
    if (!imagePath) {
      return (
        <Button
          onPress={selectPhotoTapped}
          color="secondary"
          style={{ marginTop: 24 }}
        >
          {strings.report.imageButtonLabel}
        </Button>
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
        <TouchableOpacityDebounce
          style={styles.editBtn}
          onPress={() =>
            navigation.push(routes.reportImageEdit, {
              rawImagePath,
            })
          }
        >
          <CropSvg width={24} height={24} fill={WHITE} />
        </TouchableOpacityDebounce>
      </View>
    );
  };

  const renderVoiceRecognitionIcon = () =>
    isAvailable && (
      <TouchableOpacityDebounce onPress={toggleRecognizing}>
        {isStarted && <Record width={40} height={25} fill={CINNABAR} />}
        {!isStarted && <Mic width={40} height={25} fill={DARK_GRAY} />}
      </TouchableOpacityDebounce>
    );

  return (
    <SafeAreaView style={styles.bg}>
      <Container style={{ flexDirection: 'row' }}>
        {isModal && (
          <TouchableOpacityDebounce
            style={styles.closeButton}
            onPress={navigation.goBack}
          >
            <Close width={30} height={30} fill={BLACK} />
          </TouchableOpacityDebounce>
        )}

        <Title title={strings.report.title} />
      </Container>
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardShouldPersistTaps="never"
        keyboardDismissMode="interactive"
      >
        <Container>
          <Controller
            control={control}
            name="url"
            defaultValue=""
            rules={{
              validate: validate({
                presence: { allowEmpty: false },
                url: true,
              }),
            }}
            render={({ onChange, ...rest }) => (
              <Field
                {...rest}
                label={strings.report.addLinkLabel}
                autoCorrect={false}
                onChangeText={onChange}
                error={errors.url?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="comment"
            defaultValue=""
            rules={{
              validate: validate({
                presence: { allowEmpty: false },
              }),
            }}
            render={({ onChange, value, onBlur }) => (
              <Field
                label={strings.report.whatIsWrong}
                multiline={true}
                endAdornment={renderVoiceRecognitionIcon()}
                onBlur={onBlur}
                onChangeText={onChange}
                value={isStarted ? value + partialRecognition : value}
                error={errors.comment?.message}
              />
            )}
          />

          {renderProperImageView()}

          <Controller
            control={control}
            name="email"
            rules={{
              validate: validate({
                presence: { allowEmpty: false },
                email: true,
              }),
            }}
            render={({ onChange, ...rest }) => (
              <Field
                {...rest}
                label={strings.report.emailLabel}
                keyboardType="email-address"
                onChangeText={onChange}
                error={errors.email?.message}
              />
            )}
            defaultValue=""
          />

          <Button
            onPress={handleSubmit(onSubmit)}
            loading={isFetching}
            color="primary"
            style={{ marginTop: 24 }}
          >
            {strings.report.sendButton}
          </Button>
          <Button
            onPress={draft.id ? handleDraftUpdate : handleDraftSave}
            loading={isSaving}
            style={{ marginTop: 8 }}
          >
            {draft.id
              ? strings.report.updateDraftButton
              : strings.report.saveDraftButton}
          </Button>
        </Container>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

ReportScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func,
    navigate: PropTypes.func,
    push: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      url: PropTypes.string,
      imagePath: PropTypes.string,
      draft: PropTypes.object,
    }),
  }),
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
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
  closeButton: {
    marginTop: 16,
    marginBottom: 8,
    marginRight: 16,
    width: 24,
    height: 24,
  },
});

export default ReportScreen;
