import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Title, Container, TouchableOpacityDebounce } from '../components';
import { WHITE, WHITE_SMOKE } from '../constants/colors';
import { strings } from '../constants/strings';
import { routes } from '../constants/routes';
import { openUrl } from '../utils/url';

const INFO_LINKS = [
  {
    label: strings.info.aboutProject,
    route: routes.infoAbout,
  },
  {
    label: strings.info.team,
    route: routes.infoTeam,
  },
  {
    label: strings.info.verificationRules,
    url: strings.info.urls.verificationRules,
  },
  {
    label: strings.info.verificationPolicy,
    url: strings.info.urls.verificationPolicy,
  },
  {
    label: strings.info.privacyPolicy,
    url: strings.info.urls.privacyPolicy,
  },
];

const InfoScreen = () => {
  const navigation = useNavigation();

  const handlePress = ({ route, url }) => () => {
    if (route) {
      navigation.push(route);
    } else if (url) {
      openUrl(url);
    }
  };

  return (
    <Container style={styles.container}>
      <Title title={strings.info.title} />
      {INFO_LINKS.map(({ label, route, url }) => (
        <TouchableOpacityDebounce
          key={label}
          underlayColor={WHITE_SMOKE}
          onPress={handlePress({ route, url })}
        >
          <Text style={styles.item}>{label}</Text>
        </TouchableOpacityDebounce>
      ))}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  item: {
    fontSize: 15,
    paddingVertical: 10,
  },
});

export default InfoScreen;
