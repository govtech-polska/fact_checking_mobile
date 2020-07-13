import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BLACK, WHITE } from '../constants/colors';
import { strings } from '../constants/strings';

const InfoAboutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{strings.infoAbout.title}</Text>
      <Text style={styles.text}>{strings.infoAbout.projectDescription1}</Text>
      <Text style={styles.text}>{strings.infoAbout.projectDescription2}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  title: {
    color: BLACK,
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    padding: 16,
  },
});

export default InfoAboutScreen;
