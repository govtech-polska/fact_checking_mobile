import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { WHITE, BLACK, WHITE_SMOKE } from '../constants/colors';
import { strings } from '../constants/strings';

const INFO_LINKS = [
  {
    label: strings.info.links.aboutProject,
    route: 'InfoAboutScreen',
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
    <View style={styles.container}>
      <Text style={styles.title}>{strings.info.title}</Text>
      {INFO_LINKS.map(({ label, route }) => (
        <TouchableHighlight
          key={label}
          underlayColor={WHITE_SMOKE}
          onPress={() => navigation.push(route)}
        >
          <Text style={styles.item}>{label}</Text>
        </TouchableHighlight>
      ))}
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
  item: {
    fontSize: 15,
    padding: 10,
    paddingHorizontal: 16,
  },
});

export default InfoScreen;
