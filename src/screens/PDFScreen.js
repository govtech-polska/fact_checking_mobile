import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
} from 'react-native';
import PropTypes from 'prop-types';
import PDFView from 'react-native-view-pdf';

import { WHITE } from '../constants/colors';

const PDFScreen = ({ route: { params } }) => {
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={styles.bg}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={params.url}
        resourceType={'url'}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </SafeAreaView>
  );
};

PDFScreen.propTypes = {
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
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    zIndex: 1,
  },
});

export default PDFScreen;
