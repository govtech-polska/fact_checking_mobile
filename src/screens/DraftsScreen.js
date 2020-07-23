import React from 'react';
import { SafeAreaView, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Title, Container, DraftsListItem } from '../components';

import { WHITE } from '../constants/colors';
import { strings } from '../constants/strings';
import { routes } from '../constants/routes';

const MOCKED_DATA = [
  {
    id: '1',
    savedAt: new Date(1595505973199).toISOString(),
    url: '',
    comment: `Czy, gdyby w USA wszyscy nosili maseczki, pandemia skończyłaby się tam w miesiąc?`,
    image:
      'file:///data/user/0/com.fakehunter/cache/react-native-image-crop-picker/Screenshot_20200722-181729.jpg',
  },
  {
    id: '2',
    savedAt: new Date(1595505983199).toISOString(),
    url: 'https://reactnative.dev/docs/flatlist.html#itemseparatorcomponent',
    comment: '',
    image:
      'file:///data/user/0/com.fakehunter/cache/react-native-image-crop-picker/Screenshot_20200722-181729.jpg',
  },
  {
    id: '3',
    savedAt: new Date('1/31/2020').toISOString(),
    url: 'http://google.com',
    comment: `Czy to prawda, że MEN po cichu szykuje się do nauki zdalnej w nowym roku szkolnym?`,
    image: '',
  },
  {
    id: '4',
    savedAt: new Date('7/31/2020').toISOString(),
    url: '',
    comment: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. `,
    image:
      'file:///data/user/0/com.fakehunter/cache/react-native-image-crop-picker/IMG-20200723-WA0001.jpeg',
  },
];

const DraftsScreen = () => {
  const navigation = useNavigation();

  const handleItemPress = (draftId) => () => {
    navigation.navigate(routes.report, { draftId });
  };

  return (
    <SafeAreaView style={styles.bg}>
      <Container>
        <Title title={strings.drafts.title} />
      </Container>
      <FlatList
        data={MOCKED_DATA}
        renderItem={({ item }) => (
          <DraftsListItem item={item} onPress={handleItemPress(item.id)} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: WHITE,
  },
});

export default DraftsScreen;
