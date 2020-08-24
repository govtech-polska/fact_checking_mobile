import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import { WHITE } from '../constants/colors';

const WebViewScreen = ({ route: { params } }) => {
  return (
    <SafeAreaView style={styles.bg}>
      <WebView style={styles.bg} source={{ url: params.url }} />
    </SafeAreaView>
  );
};

WebViewScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      url: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
});

export default WebViewScreen;
