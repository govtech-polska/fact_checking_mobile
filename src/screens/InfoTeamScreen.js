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
        {TEAM.map((person) => (
          <View key={person.name} style={styles.person}>
            <Text style={styles.personName}>{person.name}</Text>
            <Text style={styles.personDescription}>{person.description}</Text>
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
  person: {
    marginBottom: 16,
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
  },
  personDescription: {
    fontSize: 15,
  },
});

export default InfoTeamScreen;
