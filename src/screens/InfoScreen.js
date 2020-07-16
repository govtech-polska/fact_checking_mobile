import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Title, Container } from '../components';
import { WHITE_SMOKE } from '../constants/colors';
import { strings } from '../constants/strings';
import { routes } from '../constants/routes';

const INFO_LINKS = [
  {
    label: strings.info.links.aboutProject,
    route: routes.infoAbout,
  },
  {
    label: strings.info.links.team,
    route: '#',
  },
  {
    label: strings.info.links.verificationRules,
    route: '#',
  },
  {
    label: strings.info.links.verificationPolicy,
    route: '#',
  },
  {
    label: strings.info.links.privacyPolicy,
    route: '#',
  },
];

const InfoScreen = () => {
  const navigation = useNavigation();

  return (
    <Container style={styles.container}>
      <Title title={strings.info.title} />
      {INFO_LINKS.map(({ label, route }) => (
        <TouchableHighlight
          key={label}
          underlayColor={WHITE_SMOKE}
          onPress={() => navigation.push(route)}
        >
          <Text style={styles.item}>{label}</Text>
        </TouchableHighlight>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    fontSize: 15,
    paddingVertical: 10,
  },
});

export default InfoScreen;
