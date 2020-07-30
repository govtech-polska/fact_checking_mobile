import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
  NativeModules,
  Platform,
  AppState,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import isUUID from 'validator/lib/isUUID';

import {
  VerifiedCell,
  LoadingOverlay,
  DropDownAlert,
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
} from '../selectors';
import { feedActions } from '../storages/verified/actions';
import { routes } from '../constants/routes';
import { matchUrl } from '../utils/url';
import { APP_URL } from '../constants/urls';

const { SharedModule, UrlShareModule } = NativeModules;

class VerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.props.fetchVerifiedRequest();
    this.props.fetchCategories();
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', this.urlHandler);
      this.checkShareUrl();
      this.checkOpenUrl();
    } else {
      this.observeAndroidUrlToShare();
      this.observeAndroidUrlToOpen();
      UrlShareModule.getShareUrl();
      UrlShareModule.getOpenUrl();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.error && prevProps.error !== this.props.error) {
      DropDownAlert.showError();
    }
    if (
      this.props.selectedCategory?.id !== prevProps.selectedCategory?.id &&
      !this.props.isFetching
    ) {
      this.onRefreshTriggered();
      const selectedIndex = this.props.categories.findIndex(
        (category) => category.id === this.props.selectedCategory?.id
      );
      if (selectedIndex !== -1)
        this.flatListRef.scrollToIndex({
          animated: true,
          index: selectedIndex,
        });
    }
    if (
      prevState.isRefreshing &&
      prevProps.isFetching &&
      !this.props.isFetching
    ) {
      this.setState({ isRefreshing: false });
    }
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.urlEvent?.remove();
    this.shareEvent?.remove();
    if (Platform.OS === 'ios') {
      Linking.removeEventListener('url', this.urlHandler);
    }
  }

  handleAppStateChange = (nextState) => {
    if (nextState === 'active' && Platform.OS === 'ios') {
      this.checkShareUrl();
    }
  };

  checkShareUrl() {
    SharedModule.getShareUrl((error, url) => {
      SharedModule.clearShareUrl();
      this.showReportModal(url);
    });
  }

  checkOpenUrl() {
    SharedModule.getOpenUrl((error, url) => {
      const { id } = matchUrl(url, APP_URL + '/:id');
      SharedModule.clearOpenUrl();
      console.log('isUUID', isUUID(id));
      if (id && isUUID(id)) this.goToVerifiedDetails(id);
    });
  }

  observeAndroidUrlToShare() {
    this.shareEvent = DeviceEventEmitter.addListener(
      'shareUrl',
      this.onExternalUrlShareAndroid
    );
  }

  observeAndroidUrlToOpen() {
    this.urlEvent = DeviceEventEmitter.addListener('openUrl', ({ url }) =>
      this.onExternalUrlOpen(url)
    );
  }

  onExternalUrlShareAndroid = ({ url }) => {
    UrlShareModule.clearActionUrl();
    this.showReportModal(url);
  };

  onExternalUrlOpen = (url) => {
    const { id } = matchUrl(url, APP_URL + '/:id');
    if (Platform.OS === 'ios') {
      SharedModule.clearOpenUrl();
    } else {
      UrlShareModule.clearOpenUrl();
    }
    if (id && isUUID(id)) this.goToVerifiedDetails(id);
  };

  urlHandler = ({ url }) => this.onExternalUrlOpen(url);

  showReportModal = (url) =>
    this.props.navigation.navigate(routes.reportModal, { url });

  goToVerifiedDetails = (id) =>
    this.props.navigation.navigate(routes.verifiedDetails, { id });

  drawCell = ({ item }) => {
    return (
      <VerifiedCell
        item={item}
        onCellTapped={() => this.goToVerifiedDetails(item.id)}
      />
    );
  };

  drawCategoryCell = ({ item }) => {
    const { selectedCategory } = this.props;
    const isSelected = selectedCategory && selectedCategory.id === item.id;
    return (
      <CategoryCell
        item={item}
        isSelected={isSelected}
        onCellTapped={() => {
          this.props.setSelectedCategory(item);
        }}
      />
    );
  };

  keyExtractor = (_item, index) => index.toString();

  loadNextPage = () => {
    const {
      shouldLoadNextPage,
      nextPage,
      isFetchingNextPage,
      fetchVerifiedRequest,
      selectedCategory,
    } = this.props;

    if (shouldLoadNextPage && !isFetchingNextPage && nextPage) {
      fetchVerifiedRequest(nextPage, selectedCategory?.name);
    }
  };

  onRefreshTriggered = () => {
    const { fetchVerifiedRequest, selectedCategory } = this.props;
    this.setState({ isRefreshing: true });
    fetchVerifiedRequest(1, selectedCategory?.name);
  };

  renderListFooterComponent = () => (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={CINNABAR} />
    </View>
  );

  renderEmptyComponent = () => {
    return (
      <View style={styles.emptyComponent}>
        <TouchableOpacityDebounce
          onPress={this.onRefreshTriggered}
          style={styles.refreshButton}
        >
          <Text style={styles.refreshButtonText}>{strings.refresh}</Text>
        </TouchableOpacityDebounce>
      </View>
    );
  };

  renderCategoriesIfNeeded = () => {
    const { categories, selectedCategory } = this.props;
    if (categories.length > 0) {
      return (
        <FlatList
          style={{ maxHeight: 50 }}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={this.drawCategoryCell}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          ListHeaderComponent={() => {
            //         const { selectedCategory } = this.props;
            // const isSelected = selectedCategory && selectedCategory.id === item.id;
            return (
              <CategoryCell
                item={{ id: '0', name: strings.verifiedDetails.categoriesAll }}
                isSelected={!selectedCategory}
                onCellTapped={() => this.props.setSelectedCategory(null)}
              />
            );
          }}
        />
      );
    }
  };

  render() {
    const { isFetchingInitial, isFetchingNextPage, articles } = this.props;
    const { isRefreshing } = this.state;

    return (
      <View style={styles.container}>
        <Container>
          <Title title={strings.verifiedDetails.verifiedTitle} />
        </Container>
        {this.renderCategoriesIfNeeded()}
        <FlatList
          data={articles}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ flex: 1 }}
          renderItem={this.drawCell}
          keyExtractor={this.keyExtractor}
          onEndReached={this.loadNextPage}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this.onRefreshTriggered}
              tintColor={CINNABAR}
            />
          }
          ListFooterComponent={
            isFetchingNextPage && !isRefreshing
              ? this.renderListFooterComponent
              : null
          }
          ListEmptyComponent={this.renderEmptyComponent}
        />
        <LoadingOverlay visible={isFetchingInitial && !isRefreshing} />
      </View>
    );
  }
}

// TODO: replace any with correct types
VerifiedScreen.propTypes = {
  articles: PropTypes.array,
  error: PropTypes.any,
  fetchVerifiedRequest: PropTypes.func,
  isFetching: PropTypes.bool,
  isFetchingInitial: PropTypes.bool,
  isFetchingNextPage: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  nextPage: PropTypes.any,
  shouldLoadNextPage: PropTypes.bool,
  categories: PropTypes.any,
  fetchCategories: PropTypes.func,
  setSelectedCategory: PropTypes.func,
  selectedCategory: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }),
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
    borderRadius: 10,
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoryCell: {
    marginHorizontal: 2,
    marginVertical: 5,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    paddingHorizontal: 5,
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
    categoriesError: state.articles.categories.error,
    selectedCategory: state.articles.selectedCategory.data,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedRequest: (...args) => dispatch(feedActions.list(...args)),
    fetchCategories: () => dispatch(feedActions.categories()),
    setSelectedCategory: (...args) =>
      dispatch(feedActions.setSelectedCategory(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedScreen);
