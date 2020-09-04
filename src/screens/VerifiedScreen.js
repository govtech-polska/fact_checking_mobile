import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  Animated,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import isUUID from 'validator/lib/isUUID';

import {
  VerifiedCell,
  LoadingOverlay,
  Title,
  Container,
  CategoryCell,
  DropDownAlert,
} from '../components';

import { CINNABAR, BLACK, WHITE } from '../constants/colors';
import { strings } from '../constants/strings';
import {
  getVerifiedList,
  getShouldLoadVerifiedNextPage,
  getVerifiedNextPage,
  getIsFetchingNextPage,
  getIsFetchingInitial,
  getCategories,
  getAllCategories,
} from '../selectors';
import { feedActions } from '../storages/verified/actions';
import { routes } from '../constants/routes';
import { matchUrl } from '../utils/url';
import { APP_URL } from '../constants/urls';
import { TITLE_HEIGHT } from '../components/Title';
import { useShareEvent } from '../utils/useShareEvent';
import { useLinkEvent } from '../utils/useLinkEvent';

const CATEGORIES_HEIGHT = 60;

const VerifiedScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    articles,
    nextPageExists,
    nextPage,
    isFetchingInitial,
    isFetchingNextPage,
    error,
    categories,
    allCategoriesLength,
    selectedCategory,
  } = useSelector(({ articles }) => ({
    articles: getVerifiedList(articles),
    nextPageExists: getShouldLoadVerifiedNextPage(articles),
    nextPage: getVerifiedNextPage(articles),
    isFetchingInitial: getIsFetchingInitial(articles),
    isFetchingNextPage: getIsFetchingNextPage(articles),
    error: articles.verified.error,
    categories: getCategories(articles),
    allCategoriesLength: getAllCategories(articles).length,
    selectedCategory: articles.selectedCategory.data,
  }));

  const [isRefreshing, setIsRefreshing] = useState(false);
  const categoriesListRef = useRef(null);
  const verifiedListRef = useRef(null);
  const { animatedHeaderStyles, handleScroll } = useHeaderAnimation();

  useShareEvent({
    onShare: (url) => navigation.navigate(routes.reportModal, { url }),
  });

  useLinkEvent({
    onUrlOpen: (url) => {
      const { id } = matchUrl(url, APP_URL + '/raport/:id');
      if (id && isUUID(id)) {
        goToVerifiedDetails(id);
      }
    },
  });

  useEffect(() => {
    dispatch(feedActions.list());
    dispatch(feedActions.categories());
  }, []);

  useEffect(() => {
    dispatch(
      feedActions.list(1, selectedCategory?.name, {
        waitForSuccess: 100,
        afterSuccess: () => setIsRefreshing(false),
      })
    );
    const selectedIndex = categories.findIndex(
      (category) => category.id === selectedCategory?.id
    );
    scrollToSelectedCategory(selectedIndex);
  }, [selectedCategory?.id]);

  useEffect(() => {
    if (error) {
      DropDownAlert.showError();
    }
  }, [error]);

  const goToVerifiedDetails = (id) =>
    navigation.navigate(routes.verifiedDetails, { id });

  const scrollToSelectedCategory = (index) => {
    if (index >= 0) {
      categoriesListRef.current?.scrollToIndex({
        animated: true,
        viewPosition: 0.3,
        index,
      });
    } else {
      categoriesListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
  };

  const handleCategoryCellTap = (item) => () => {
    verifiedListRef.current?.scrollToOffset({
      animated: true,
      offset: -TITLE_HEIGHT,
    });
    setIsRefreshing(true);
    dispatch(feedActions.setSelectedCategory(item));
  };

  const handleRefreshTriggered = () => {
    setIsRefreshing(true);
    dispatch(
      feedActions.list(1, selectedCategory?.name, {
        afterSuccess: () => setIsRefreshing(false),
      })
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerWrapper, animatedHeaderStyles]}>
        <Container>
          <Title title={strings.verifiedList.verifiedTitle} />
        </Container>
        {categories && (
          <FlatList
            horizontal
            ref={categoriesListRef}
            style={styles.categoriesList}
            contentContainerStyle={styles.categoriesContent}
            data={categories}
            renderItem={({ item }) => (
              <CategoryCell
                item={item}
                isSelected={selectedCategory && selectedCategory.id === item.id}
                onCellTapped={handleCategoryCellTap(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={() => {
              return (
                <CategoryCell
                  item={{ name: strings.verifiedList.categoriesAll }}
                  isSelected={!selectedCategory}
                  onCellTapped={handleCategoryCellTap(null)}
                />
              );
            }}
            ListFooterComponent={
              allCategoriesLength > categories.length && (
                <CategoryCell
                  item={{ name: strings.verifiedList.categoriesMore }}
                  onCellTapped={() => navigation.navigate(routes.categories)}
                  textColor={CINNABAR}
                />
              )
            }
          />
        )}
      </Animated.View>

      <FlatList
        data={articles}
        ref={verifiedListRef}
        style={styles.verifiedList}
        contentContainerStyle={styles.verifiedListContent}
        contentInset={{ top: TITLE_HEIGHT }}
        contentOffset={{ x: 0, y: -TITLE_HEIGHT }}
        scrollEventThrottle={16}
        renderScrollComponent={(props) => (
          <Animated.ScrollView
            {...props}
            // eslint-disable-next-line react/prop-types
            onScroll={handleScroll((event) => props.onScroll(event))}
          />
        )}
        renderItem={({ item }) => (
          <VerifiedCell
            item={item}
            onCellTapped={() => goToVerifiedDetails(item.id)}
          />
        )}
        onEndReached={() => {
          if (nextPageExists && !isFetchingNextPage && nextPage) {
            dispatch(feedActions.list(nextPage, selectedCategory?.name));
          }
        }}
        onEndReachedThreshold={0.2}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefreshTriggered}
            tintColor={CINNABAR}
            progressViewOffset={TITLE_HEIGHT}
          />
        }
        ListFooterComponent={
          isFetchingNextPage &&
          !isRefreshing && (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={CINNABAR} />
            </View>
          )
        }
        ListEmptyComponent={
          <Text style={styles.emptyListText}>
            {strings.verifiedList.emptyList}
          </Text>
        }
      />
      <LoadingOverlay visible={isFetchingInitial && !isRefreshing} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    padding: 24,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 16,
  },
  categoriesList: {
    flexGrow: 0,
    backgroundColor: 'rgb(247, 240, 242)',
    padding: 12,
    paddingHorizontal: 16,
    height: CATEGORIES_HEIGHT,
  },
  categoriesContent: {
    paddingRight: 32,
    minWidth: '100%',
  },
  headerWrapper: {
    position: 'absolute',
    backgroundColor: WHITE,
    top: 0,
    zIndex: 9,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 2,
  },
  verifiedListContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'android' ? TITLE_HEIGHT + 8 : 8,
  },
  verifiedList: {
    flex: 1,
    marginTop: CATEGORIES_HEIGHT,
  },
});

const useHeaderAnimation = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateY = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -TITLE_HEIGHT],
    extrapolate: 'clamp',
  });
  const elevation = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 4],
    extrapolate: 'clamp',
  });
  const shadowOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 0.18],
    extrapolate: 'clamp',
  });

  const handleScroll = (listener) =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y: scrollY },
          },
        },
      ],
      {
        useNativeDriver: true,
        listener,
      }
    );

  return {
    scrollY,
    animatedHeaderStyles: {
      transform: [{ translateY }],
      elevation,
      shadowOpacity,
    },
    handleScroll,
  };
};

export default VerifiedScreen;
