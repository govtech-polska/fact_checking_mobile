import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const INFO_LINKS = [
  {
    label: 'O projekcie',
    route: 'InfoAboutScreen',
  },
  {
    label: 'Zespół',
    route: '#',
  },
  {
    label: 'Reguły weryfikacji faktów',
    route: '#',
  },
  {
    label: 'Polityka korekt',
    route: '#',
  },
  {
    label: 'Polityka prywatności',
    route: '#',
  },
];

// TODO: extract title to component
const InfoScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O aplikacji</Text>
      {INFO_LINKS.map(({ label, route }) => (
        <Text
          key={label}
          onPress={() => navigation.push(route)}
          style={styles.item}
        >
          {label}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    color: 'black',
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
