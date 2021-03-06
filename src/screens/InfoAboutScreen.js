import React from 'react';
import { StyleSheet, Text, ScrollView } from 'react-native';
import { Title, Container } from '../components';
import { WHITE } from '../constants/colors';
import { strings } from '../constants/strings';

const InfoAboutScreen = () => {
  return (
    <ScrollView style={styles.bg}>
      <Container>
        <Title title={strings.infoAbout.title} />
        <Text style={styles.text}>{strings.infoAbout.projectDescription1}</Text>
        <Text style={styles.text}>{strings.infoAbout.projectDescription2}</Text>
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    paddingVertical: 8,
  },
});

export default InfoAboutScreen;
