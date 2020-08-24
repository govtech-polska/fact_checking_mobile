import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Title, Container } from '../components';
import { WHITE } from '../constants/colors';
import { strings } from '../constants/strings';

const TEAM = Object.values(strings.infoTeam.team);

const InfoTeamScreen = () => {
  return (
    <ScrollView style={styles.bg}>
      <Container>
        <Title title={strings.infoTeam.title} />
        {TEAM.map(({ name, description }) => (
          <View key={name} style={styles.itemWrapper}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        ))}
      </Container>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
  itemWrapper: {
    marginBottom: 16,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
  },
  description: {
    fontSize: 15,
  },
});

export default InfoTeamScreen;
