import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';

import {
  VerifiedCell,
  LoadingOverlay,
  DropDownAlert,
} from '../components';
import {
  promiseDispatch,
  fetchVerifiedRequest,
  fetchNextPageVerifiedRequest,
} from '../actions';
import { CINNABAR } from '../constants/colors';

class VerifiedScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingInitial: false,
      isFetchingNextPage: false,
      refreshing: false,
    };
  }

  async componentDidMount() {
    this.setState({ isFetchingInitial: true });
    await this.fetchData();
    this.setState({ isFetchingInitial: false });
    this._focusListener = this.props.navigation.addListener('focus', () => {
      this.onRefreshTriggered();
    });
  }

  componentWillUnmount() {
    this._focusListener();
  }

  drawCell = ({ item }) => {
    return <VerifiedCell item={item} />
  }

  keyExtractor = (_item, index) => index.toString();

  fetchData = async () => {
    try {
      await this.props.fetchVerifiedRequest();
    } catch (error) {
      DropDownAlert.showError();
    }
  }

  loadNextPage = async () => {
    const {
      shouldLoadNextPage,
    } = this.props;
    const {
      isFetchingNextPage,
    } = this.state;

    if (shouldLoadNextPage && !isFetchingNextPage) {
      this.setState({ isFetchingNextPage: true });
      try {
        await this.props.fetchNextPageVerifiedRequest();
        this.setState({ isFetchingNextPage: false });
      } catch (error) {
        DropDownAlert.showError();
        this.setState({ isFetchingNextPage: false });
      }
    }
  }

  onRefreshTriggered = async () => {
    this.setState({ refreshing: true });
    await this.fetchData();
    this.setState({ refreshing: false });
  }

  renderListFooterComponent = () => (
    <View style={styles.loader}>
      <ActivityIndicator size='large' color={CINNABAR} />
    </View>
  );

  render() {
    const {
      isFetchingNextPage,
      refreshing,
    } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.articles}
          renderItem={this.drawCell}
          keyExtractor={this.keyExtractor}
          onEndReached={this.loadNextPage}
          onEndReachedThreshold={0.2}
          ListFooterComponent={isFetchingNextPage ? this.renderListFooterComponent : null}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.onRefreshTriggered}
              tintColor={CINNABAR}
            />
          }
        />
        <LoadingOverlay visible={this.state.isFetchingInitial} />
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
});

const mapStateToProps = (state) => {
  return {
    articles: state.verified.articles,
    shouldLoadNextPage: state.verified.shouldLoadNextPage,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedRequest: () => promiseDispatch(dispatch, fetchVerifiedRequest),
    fetchNextPageVerifiedRequest: () => promiseDispatch(dispatch, fetchNextPageVerifiedRequest),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedScreen);
