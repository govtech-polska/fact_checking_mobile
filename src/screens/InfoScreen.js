import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Title, Container, TouchableOpacityDebounce } from '../components';
import { WHITE, WHITE_SMOKE } from '../constants/colors';
import { strings } from '../constants/strings';
import { routes } from '../constants/routes';
import { urls } from '../constants/urls';
import { openUrl, resolveUrl } from '../utils/url';

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
    fileName: strings.info.fileNames.verificationRules,
  },
  {
    label: strings.info.verificationPolicy,
    fileName: strings.info.fileNames.verificationPolicy,
  },
  {
    label: strings.info.privacyPolicy,
    fileName: strings.info.fileNames.privacyPolicy,
  },
];

const InfoScreen = () => {
  const navigation = useNavigation();

  const handlePress = ({ route, fileName, label }) => () => {
    if (route) {
      navigation.push(route);
    } else if (fileName) {
      navigation.navigate(routes.webView, {
        title: label,
        url: resolveUrl(urls.INFO_ATTACHMENTS, { fileName }),
      });
    }
  };

  return (
    <Container style={styles.container}>
      <Title title={strings.info.title} />
      {INFO_LINKS.map(({ label, route, fileName }) => (
        <TouchableOpacityDebounce
          key={label}
          underlayColor={WHITE_SMOKE}
          onPress={handlePress({ route, fileName, label })}
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
