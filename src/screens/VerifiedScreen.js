import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import isUUID from 'validator/lib/isUUID';

import {
  VerifiedCell,
  LoadingOverlay,
  TouchableOpacityDebounce,
  Title,
  Container,
  CategoryCell,
} from '../components';

import { CINNABAR, BLACK } from '../constants/colors';
import { strings } from '../constants/strings';
import {
  getVerifiedList,
  getShouldLoadVerifiedNextPage,
  getVerifiedNextPage,
  getIsFetchingNextPage,
  getIsFetchingInitial,
  getCategories,
  getIsFetching,
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

/** TODO:
 *  - rename shouldLoadNextPage to canLoadNextPage or nextPageExists
 *  - error handling
 */

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

const VerifiedScreen = ({
  isFetchingInitial,
  isFetchingNextPage,
  articles,
  categories,
  selectedCategory,
  shouldLoadNextPage,
  nextPage,
  dispatch,
  allCategoriesLength,
}) => {
  const navigation = useNavigation();

  const goToVerifiedDetails = (id) =>
    navigation.navigate(routes.verifiedDetails, { id });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const categoriesListRef = useRef(null);
  const verifiedListRef = useRef(null);
  const { animatedHeaderStyles, handleScroll } = useHeaderAnimation();

  useShareEvent({
    onShare: (url) => navigation.navigate(routes.reportModal, { url }),
  });

  useLinkEvent({
    onUrlOpen: (url) => {
      const { id } = matchUrl(url, APP_URL + '/:id');
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
    dispatch(feedActions.list(1, selectedCategory?.name));
    const selectedIndex = categories.findIndex(
      (category) => category.id === selectedCategory?.id
    );
    if (selectedIndex >= 0) {
      categoriesListRef.current?.scrollToIndex({
        animated: true,
        viewPosition: 0.3,
        index: selectedIndex,
      });
    } else {
      categoriesListRef.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
    }
  }, [selectedCategory?.id]);

  const handleRefreshTriggered = () => {
    setIsRefreshing(true);
    dispatch(
      feedActions.list(1, selectedCategory?.name, () => setIsRefreshing(false))
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerWrapper, animatedHeaderStyles]}>
        <Container>
          <Title title={strings.verifiedDetails.verifiedTitle} />
        </Container>
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
              onCellTapped={() => {
                verifiedListRef.current?.scrollToOffset({
                  animated: true,
                  offset: 0,
                });
                setTimeout(() => {
                  dispatch(feedActions.setSelectedCategory(item));
                }, 500);
              }}
            />
          )}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={() => {
            return (
              <CategoryCell
                item={{ name: strings.verifiedDetails.categoriesAll }}
                isSelected={!selectedCategory}
                onCellTapped={() => {
                  verifiedListRef.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  dispatch(feedActions.setSelectedCategory(null));
                }}
              />
            );
          }}
          ListFooterComponent={
            allCategoriesLength > categories.length && (
              <CategoryCell
                item={{ name: strings.verifiedDetails.categoriesMore }}
                onCellTapped={() => navigation.navigate(routes.categories)}
                textColor={CINNABAR}
              />
            )
          }
        />
      </Animated.View>
      <FlatList
        data={articles}
        ref={verifiedListRef}
        style={styles.verifiedList}
        contentContainerStyle={styles.verifiedListContent}
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
          if (shouldLoadNextPage && !isFetchingNextPage && nextPage) {
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
          <View style={styles.emptyComponent}>
            <TouchableOpacityDebounce
              onPress={handleRefreshTriggered}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>{strings.refresh}</Text>
            </TouchableOpacityDebounce>
          </View>
        }
      />
      <LoadingOverlay visible={isFetchingInitial && !isRefreshing} />
    </View>
  );
};

// TODO: replace any with correct types
VerifiedScreen.propTypes = {
  allCategoriesLength: PropTypes.any,
  articles: PropTypes.array,
  categories: PropTypes.shape({
    findIndex: PropTypes.func,
    length: PropTypes.any,
  }),
  dispatch: PropTypes.func,
  error: PropTypes.any,
  fetchCategories: PropTypes.func,
  fetchVerifiedRequest: PropTypes.func,
  isFetching: PropTypes.bool,
  isFetchingInitial: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  nextPage: PropTypes.any,
  selectedCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
  setSelectedCategory: PropTypes.func,
  shouldLoadNextPage: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    padding: 24,
  },
  emptyComponent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    width: 200,
    height: 50,
    backgroundColor: CINNABAR,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 14,
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
    backgroundColor: 'white',
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
    paddingVertical: 16,
    paddingTop: TITLE_HEIGHT + 8,
  },
  verifiedList: {
    flex: 1,
    marginTop: CATEGORIES_HEIGHT,
  },
});

const mapStateToProps = (state) => {
  return {
    articles: getVerifiedList(state.articles),
    shouldLoadNextPage: getShouldLoadVerifiedNextPage(state.articles),
    nextPage: getVerifiedNextPage(state.articles),
    isFetching: getIsFetching(state.articles),
    isFetchingInitial: getIsFetchingInitial(state.articles),
    isFetchingNextPage: getIsFetchingNextPage(state.articles),
    error: state.articles.verified.error,
    categories: getCategories(state.articles),
    allCategoriesLength: getAllCategories(state.articles).length,
    categoriesError: state.articles.categories.error,
    selectedCategory: state.articles.selectedCategory.data,
  };
};

export default connect(mapStateToProps)(VerifiedScreen);
