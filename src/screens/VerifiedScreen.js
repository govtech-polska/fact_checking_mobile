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

import {
  VerifiedCell,
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
  Title,
  Container,
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

const { SharedModule, UrlShareModule } = NativeModules;

class VerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: null,
      selectedCategoryId: '0',
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
    if (prevState.selectedCategory !== this.state.selectedCategory) {
      this.onRefreshTriggered();
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
      const id = this.getDetailsIdFromUrl(url);
      SharedModule.clearOpenUrl();
      this.goToVerifiedDetails(id);
    });
  }

  getDetailsIdFromUrl(url) {
    const urlParts = url.split('/');
    const id = urlParts.pop() || urlParts.pop(); // handle potential trailing slash
    return id;
  }

  observeAndroidUrlToShare() {
    this.urlEvent = DeviceEventEmitter.addListener(
      'shareUrl',
      this.onExternalUrlShareAndroid
    );
  }

  observeAndroidUrlToOpen() {
    this.urlEvent = DeviceEventEmitter.addListener(
      'openUrl',
      this.onExternalUrlOpenAndroid
    );
  }

  onExternalUrlShareAndroid = ({ url }) => {
    UrlShareModule.clearActionUrl();
    this.showReportModal(url);
  };

  onExternalUrlOpenAndroid = ({ url }) => {
    this.onExternalUrlOpen(url);
  };

  onExternalUrlOpen = (url) => {
    const id = this.getDetailsIdFromUrl(url);
    if (Platform.OS === 'ios') {
      SharedModule.clearOpenUrl();
    } else {
      UrlShareModule.clearOpenUrl();
    }
    this.goToVerifiedDetails(id);
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
    const { selectedCategoryId } = this.state;
    return (
      <TouchableOpacityDebounce
        style={{
          ...styles.categoryCell,
          backgroundColor:
            selectedCategoryId === item.id ? CINNABAR : 'transparent',
        }}
        onPress={() => {
          if (item.id === '0') {
            this.setState({
              selectedCategoryId: item.id,
              selectedCategory: null,
            });
          } else if (item.id === '1') {
            //TODO: show modal
            console.log('ShowModal');
          } else {
            this.setState({
              selectedCategoryId: item.id,
              selectedCategory: item.name,
            });
          }
        }}
      >
        <Text style={{ textTransform: 'capitalize' }}>{item.name}</Text>
      </TouchableOpacityDebounce>
    );
  };

  keyExtractor = (_item, index) => index.toString();

  loadNextPage = () => {
    const {
      shouldLoadNextPage,
      nextPage,
      isFetchingNextPage,
      fetchVerifiedRequest,
    } = this.props;
    const { selectedCategory } = this.state;

    if (shouldLoadNextPage && !isFetchingNextPage && nextPage) {
      fetchVerifiedRequest(nextPage, selectedCategory);
    }
  };

  onRefreshTriggered = () => {
    const { fetchVerifiedRequest } = this.props;
    const { selectedCategory } = this.state;
    this.setState({ isRefreshing: true });
    fetchVerifiedRequest(1, selectedCategory);
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
    const { categories } = this.props;
    if (categories.length > 0) {
      return (
        <FlatList
          style={{ maxHeight: 50 }}
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          renderItem={this.drawCategoryCell}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
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
    borderWidth: 1,
    borderColor: BLACK,
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedRequest: (...args) => dispatch(feedActions.list(...args)),
    fetchCategories: () => dispatch(feedActions.categories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedScreen);
