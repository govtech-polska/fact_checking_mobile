import React, { useState, useCallback, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  RefreshControl,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useAsyncStorage } from '@react-native-community/async-storage';

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

const SWIPE_OPEN_WIDTH = -100;
const WAS_PREVIEW_FIRED_KEY = 'fakehunter.drafts.preview';
const useSwipePreview = (drafts) => {
  const shouldBeChecked = drafts.length > 0;
  const { getItem, setItem } = useAsyncStorage(WAS_PREVIEW_FIRED_KEY);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    (async () => {
      const wasPreviewFired = await getItem();
      setShowPreview(!wasPreviewFired);
    })();
  }, []);

  useEffect(() => {
    if (showPreview && shouldBeChecked) {
      setTimeout(() => {
        setShowPreview(false);
        setItem(Date.now().toString());
      }, 500);
    }
  }, [showPreview, shouldBeChecked]);

  return { previewRowKey: showPreview && shouldBeChecked ? drafts[0].id : '' };
};

const DraftsScreen = () => {
  const navigation = useNavigation();
  const { isLoading, drafts, removeDraft, refreshDrafts } = useDrafts();
  const { previewRowKey } = useSwipePreview(drafts);

  useFocusEffect(
    useCallback(() => {
      refreshDrafts();
    }, [])
  );

  const handleItemPress = (draft) => () => {
    navigation.navigate(routes.report, { draft });
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
          <DraftsListItem item={item} onPress={handleItemPress(item)} />
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
        rightOpenValue={SWIPE_OPEN_WIDTH}
        disableRightSwipe
        previewRowKey={previewRowKey}
        previewDuration={350}
        previewOpenValue={SWIPE_OPEN_WIDTH}
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
