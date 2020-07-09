import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Text,
} from 'react-native';
import { connect } from 'react-redux';

import {
  VerifiedCell,
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
} from '../components';

import { CINNABAR } from '../constants/colors';
import { strings } from '../constants/strings';
import {
  getVerifiedList,
  getShouldLoadVerifiedNextPage,
  getVerifiedNextPageUrl,
  getIsFetchingNextPage,
  getIsFetchingInitial,
} from '../selectors';
import { feedActions } from '../storages/verified/actions'

class VerifiedScreen extends Component {

  componentDidMount() {
    this.props.fetchVerifiedRequest();
    this._focusListener = this.props.navigation.addListener('focus', () => {
      this.onRefreshTriggered();
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && prevProps.error !== this.props.error) {
      DropDownAlert.showError()
    }
  }

  componentWillUnmount() {
    this._focusListener();
  }

  drawCell = ({ item }) => {
    return (
      <VerifiedCell
        item={item}
        onCellTapped={() => this.props.navigation.navigate('VerifiedDetailsScreen', { id: item.id })}
      />
    );
  }

  keyExtractor = (_item, index) => index.toString();

  loadNextPage = async () => {
    const {
      shouldLoadNextPage,
      nextPageUrl,
      isFetchingNextPage,
      fetchVerifiedRequest,
    } = this.props;

    if (shouldLoadNextPage && !isFetchingNextPage && nextPageUrl) {
      fetchVerifiedRequest(nextPageUrl);
    }
  }

  onRefreshTriggered = async () => {
    const { fetchVerifiedRequest } = this.props;
    fetchVerifiedRequest();
  }

  renderListFooterComponent = () => (
    <View style={styles.loader}>
      <ActivityIndicator size='large' color={CINNABAR} />
    </View>
  );

  renderEmptyComponent = () => {
    return (
      <View style={styles.emptyComponent}>
      <TouchableOpacityDebounce
        onPress={this.onRefreshTriggered}
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>
          {strings.refresh}
        </Text>
      </TouchableOpacityDebounce>
      </View>);
  }

  renderTitleIfNeeded = () => {
    const { articles } = this.props;
    if(articles.length > 0) {
      <Text style={styles.title}>{strings.verifiedTitle}</Text>
    }
  }

  render() {
    const {
      isFetchingInitial,
      isFetchingNextPage,
      articles,
    } = this.props;

    return (
      <View style={styles.container}>
        {this.renderTitleIfNeeded}
        <FlatList
          data={articles}
          contentContainerStyle={{ flexGrow: 1 }}
          renderItem={this.drawCell}
          keyExtractor={this.keyExtractor}
          onEndReached={this.loadNextPage}
          onEndReachedThreshold={0.2}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingInitial}
              onRefresh={this.onRefreshTriggered}
              tintColor={CINNABAR}
            />
          }
          ListFooterComponent={isFetchingNextPage ? this.renderListFooterComponent : null}
          ListEmptyComponent={this.renderEmptyComponent}
        />
        <LoadingOverlay visible={isFetchingInitial} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  loader: {
    alignItems: 'center',
    flex: 1,
    padding: 24,
  },
  title: {
    color: 'black',
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
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
  }
});

const mapStateToProps = (state) => {
  return {
    articles: getVerifiedList(state.articles),
    shouldLoadNextPage: getShouldLoadVerifiedNextPage(state.articles),
    nextPageUrl: getVerifiedNextPageUrl(state.articles),
    isFetchingInitial: getIsFetchingInitial(state.articles),
    isFetchingNextPage: getIsFetchingNextPage(state.articles),
    error: state.articles.verified.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedRequest: (...args) => dispatch(feedActions.list(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedScreen);
