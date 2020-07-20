import React, { useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  PanResponder,
  Animated,
  Text,
} from 'react-native';
import ViewShot from 'react-native-view-shot';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacityDebounce } from '../components';
import { strings } from '../constants/strings';
import { CINNABAR_OPACITY } from '../constants/colors';
import { routes } from '../constants/routes';

const getStartValue = (start, move) => (start > move ? move : start);

const ReportImageEditScreen = ({ route }) => {
  const navigation = useNavigation();
  const screenshotView = useRef(null);
  const initialValues = useRef(new Animated.ValueXY()).current;
  const startValues = useRef(new Animated.ValueXY()).current;
  const sizeValues = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: ({ nativeEvent }) => {
        initialValues.setValue({
          x: nativeEvent.locationX,
          y: nativeEvent.locationY,
        });
        startValues.setValue({
          x: nativeEvent.locationX,
          y: nativeEvent.locationY,
        });
        sizeValues.setValue({
          x: 0,
          y: 0,
        });
      },
      onPanResponderMove: ({ nativeEvent }, { dx, dy }) => {
        startValues.setValue({
          x: getStartValue(initialValues.x._value, nativeEvent.locationX),
          y: getStartValue(initialValues.y._value, nativeEvent.locationY),
        });
        sizeValues.setValue({
          x: Math.abs(dx),
          y: Math.abs(dy),
        });
      },
    })
  ).current;

  const moveResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startValues.setOffset({
          x: startValues.x._value,
          y: startValues.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: startValues.x, dy: startValues.y }],
        {
          useNativeDriver: false,
        }
      ),
      onPanResponderRelease: () => {
        startValues.flattenOffset();
      },
    })
  ).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacityDebounce onPress={handleImageSave}>
          <Text style={styles.saveBtn}>
            {strings.reportImageEdit.saveButton}
          </Text>
        </TouchableOpacityDebounce>
      ),
    });
  }, [navigation]);

  const handleImageSave = async () => {
    const uri = await screenshotView.current.capture();
    navigation.navigate(routes.report, { imagePath: uri });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ViewShot ref={screenshotView}>
        <Image
          style={styles.image}
          source={{ uri: route.params.rawImagePath }}
          {...panResponder.panHandlers}
        />
        <Animated.View
          style={{
            ...styles.box,
            width: sizeValues.x,
            height: sizeValues.y,
            transform: [
              { translateX: startValues.x },
              { translateY: startValues.y },
            ],
          }}
          {...moveResponder.panHandlers}
        />
      </ViewShot>
    </SafeAreaView>
  );
};

ReportImageEditScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      rawImagePath: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  box: {
    backgroundColor: CINNABAR_OPACITY,
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
  },
  saveBtn: {
    marginRight: 16,
    textTransform: 'uppercase',
  },
});

export default ReportImageEditScreen;
