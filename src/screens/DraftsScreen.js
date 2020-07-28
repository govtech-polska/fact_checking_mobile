import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';

import {
  Title,
  Container,
  DraftsListItem,
  TouchableOpacityDebounce,
  LoadingOverlay,
} from '../components';

import RemoveIcon from '../resources/img/remove.svg';
import { WHITE, ERROR, CINNABAR } from '../constants/colors';
import { strings } from '../constants/strings';
import { routes } from '../constants/routes';
import { useDrafts } from '../utils/useDrafts';

const DraftsScreen = () => {
  const navigation = useNavigation();
  const { isLoading, drafts, removeDraft, refreshDrafts } = useDrafts();

  useFocusEffect(
    useCallback(() => {
      refreshDrafts();
    }, [])
  );

  const handleItemPress = (draftId) => () => {
    navigation.navigate(routes.report, { draftId });
  };

  const handleItemDelete = (draftId) => () => {
    removeDraft(draftId);
  };

  return (
    <SafeAreaView style={styles.bg}>
      <Container>
        <Title title={strings.drafts.title} />
      </Container>
      <SwipeListView
        data={drafts}
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
        previewRowKey={drafts[0] && drafts[0].id}
        ListEmptyComponent={() => (
          <Container>
            <Text>{strings.drafts.listEmptyState}</Text>
          </Container>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshDrafts}
            tintColor={CINNABAR}
          />
        }
      />
      <LoadingOverlay visible={isLoading} />
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
