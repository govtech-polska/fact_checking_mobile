import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  SafeAreaView,
  Image,
  PanResponder,
  Animated,
} from 'react-native';

const getStartValue = (start, move) => (start > move ? move : start);

const ReportImageEditScreen = ({ route }) => {
  const startValues = useRef(new Animated.ValueXY()).current;
  const sizeValues = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        startValues.setValue({
          x: gestureState.x0,
          y: gestureState.y0,
        });
        sizeValues.setValue({
          x: 0,
          y: 0,
        });
      },
      onPanResponderMove: Animated.event([null, null], {
        useNativeDriver: false,
        listener: (_, { moveX, moveY, x0, y0, dx, dy }) => {
          startValues.setValue({
            x: getStartValue(x0, moveX),
            y: getStartValue(y0, moveY),
          });
          sizeValues.setValue({
            x: Math.abs(dx),
            y: Math.abs(dy),
          });
        },
      }),
      onPanResponderRelease: () => {
        console.log('onPanResponderRelease');
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Image
        style={styles.image}
        source={{ uri: route.params.imagePath }}
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
    </SafeAreaView>
  );
};

ReportImageEditScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      imagePath: PropTypes.string,
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
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    borderRadius: 3,
    position: 'absolute',
    top: 0,
    left: 0,
    width: 50,
    height: 50,
  },
});

export default ReportImageEditScreen;
