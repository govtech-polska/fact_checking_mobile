import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
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
  BLACK,
  WHITE,
} from '../constants/colors';
import { DropDownAlert, TouchableOpacityDebounce } from '../components';
import CropSvg from '../resources/img/crop.svg';
import { routes } from '../constants/routes';

class ReportScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rawImagePath: null,
      imagePath: null,
    };
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
      <View style={styles.imageContainer}>
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

  render() {
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
          <TextInput style={styles.inputLabel} multiline={true} />

          <Text style={styles.label}>{strings.report.whatIsWrong}</Text>
          <TextInput style={styles.inputLabel} />

          {this.renderProperImageView()}

          <Text style={styles.label}>{strings.report.emailLabel}</Text>
          <TextInput style={styles.inputLabel} />

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
    textTransform: 'uppercase',
  },
  imageContainer: {
    marginTop: 24,
    width: '100%',
    backgroundColor: 'rgb(250, 250, 250)',
    borderWidth: 1,
    borderColor: GAINSBORO,
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
    top: 0,
    right: 0,
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9,
  },
});

export default ReportScreen;
