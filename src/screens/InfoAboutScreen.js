import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Title } from '../components';
import { WHITE } from '../constants/colors';
import { strings } from '../constants/strings';

const InfoAboutScreen = () => {
  return (
    <View style={styles.container}>
      <Title title={strings.infoAbout.title} />
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
  text: {
    fontSize: 15,
    lineHeight: 22,
    padding: 16,
  },
});

export default InfoAboutScreen;
