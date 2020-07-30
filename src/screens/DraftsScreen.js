import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import {
  Title,
  Container,
  DraftsListItem,
  TouchableOpacityDebounce,
} from '../components';

import RemoveIcon from '../resources/img/remove.svg';
import { WHITE, ERROR } from '../constants/colors';
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
  const [data, setData] = useState(MOCKED_DATA);

  const handleItemPress = (draftId) => () => {
    navigation.navigate(routes.report, { draftId });
  };

  const handleItemDelete = (draftId) => () => {
    setData(data.filter((item) => item.id !== draftId));
  };

  return (
    <SafeAreaView style={styles.bg}>
      <Container>
        <Title title={strings.drafts.title} />
      </Container>
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DraftsListItem item={item} onPress={handleItemPress(item.id)} />
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.action}>
            <TouchableOpacityDebounce
              style={styles.deleteBtn}
              onPress={handleItemDelete(item.id)}
            >
              <RemoveIcon style={styles.icon} />
            </TouchableOpacityDebounce>
          </View>
        )}
        rightOpenValue={-100}
        disableRightSwipe
        previewRowKey={data[0] && data[0].id}
        ListEmptyComponent={() => (
          <Container>
            <Text>Nie posiadasz żadnego zgłoszenia w wersji roboczej.</Text>
          </Container>
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
  action: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: ERROR,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteBtn: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    color: WHITE,
  },
});

export default DraftsScreen;
