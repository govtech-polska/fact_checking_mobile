import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  ScrollView,
  Modal,
  Share,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
} from '../components';
import { strings } from '../constants/strings';
import { DARK_GRAY, CINNABAR } from '../constants/colors';
import { feedActions } from '../storages/verified/actions';
import { APP_URL } from '../constants/api';
import VerifiedNot from '../resources/img/verifiedCell/verifiedNot.svg';
import VerifiedOk from '../resources/img/verifiedCell/verifiedOk.svg';
import VerifiedBad from '../resources/img/verifiedCell/verifiedBad.svg';

const shareImage = require('../resources/img/share.png');

class VerifiedDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageViewerVisible: false,
    };

    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacityDebounce
          style={styles.shareButton}
          onPress={this.onShare}
        >
          <Image style={{ flex: 1 }} resizeMode="contain" source={shareImage} />
        </TouchableOpacityDebounce>
      ),
    });
  }

  componentDidMount() {
    const { id } = this.props.route.params;
    this.props.fetchVerifiedDetailsRequest(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.error && prevProps.error !== this.props.error) {
      DropDownAlert.showError();
    }
  }

  dateFormatted(date, format) {
    return Moment(date).format(format);
  }

  fhLink(id) {
    return `${APP_URL}/${id}`;
  }

  openUrl(url) {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        DropDownAlert.showError();
      }
    });
  }

  toggleImageViewerVisibility = () => {
    this.setState((prevState) => ({
      imageViewerVisible: !prevState.imageViewerVisible,
    }));
  };

  renderImageModalIfNeeded = () => {
    const { imageViewerVisible } = this.state;
    const { details } = this.props;
    return (
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
      >
        <ImageViewer
          enableSwipeDown
          renderIndicator={() => { }}
          imageUrls={[{ url: details?.screenshot_url || '' }]}
          onRequestClose={this.toggleImageViewerVisibility}
          onCancel={this.toggleImageViewerVisibility}
        />
      </Modal>
    );
  };

  onShare = async () => {
    try {
      const {
        details: { id },
      } = this.props;
      await Share.share({
        ...Platform.select({
          android: {
            message: `${APP_URL}/${id}`,
          },
        }),
        url: `${APP_URL}/${id}`,
      });
    } catch (error) {
      DropDownAlert.showError();
    }
  };

  verificationStatusImage = () => {
    const { details } = this.props;
    if (!details) return null;
    switch (details.verdict) {
      case 'true':
        return <VerifiedOk width={40} height={40} style={{ color: 'green' }} />;
      case 'false':
        return <VerifiedBad width={40} height={40} style={{ color: 'red' }} />;
      default:
        return <VerifiedNot width={40} height={40} style={{ color: 'gray' }} />;
    }
  };

  verificationStatusText = () => {
    const { details } = this.props;
    if (!details) return null;
    switch (details.verdict) {
      case 'true':
        return strings.report.authentic;
      case 'false':
        return strings.report.fakeNews;
      default:
        return strings.report.unverifiable;
    }
  };

  verificationStatusColor = () => {
    const { details } = this.props;
    if (!details) return null;
    switch (details.verdict) {
      case 'true':
        return 'green';
      case 'false':
        return CINNABAR;
      default:
        return 'gray';
    }
  };

  render() {
    const { details, isFetching } = this.props;

    return isFetching || !details ? (
      <LoadingOverlay loading />
    ) : (
        <ScrollView style={{ backgroundColor: 'white' }}>
          {this.renderImageModalIfNeeded()}
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{details?.title}</Text>
              <Text style={styles.dateLabel}>{`${
                strings.reportDateLabel
                } ${this.dateFormatted(details?.reported_at, 'DD.MM.YYYY')}`}</Text>
            </View>

            <View style={styles.verdictContainer}>
              {this.verificationStatusImage()}
              <Text style={{ ...styles.verdictText, color: this.verificationStatusColor() }}>{this.verificationStatusText()}</Text>
            </View>

            <TouchableOpacityDebounce onPress={this.toggleImageViewerVisibility}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={{ uri: details.screenshot_url || '' }}
              />
            </TouchableOpacityDebounce>

            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>
                {strings.informationSourceLabel}
              </Text>
              <Text style={styles.url} onPress={() => this.openUrl(details.url)}>
                {details.url}
              </Text>

              <Text style={styles.detailsTitle}>{strings.fhLinkLabel}</Text>
              <Text
                style={styles.url}
                onPress={() => this.openUrl(this.fhLink(details.id))}
              >
                {this.fhLink(details.id)}
              </Text>

              <Text style={{ ...styles.detailsTitle, marginBottom: 4 }}>
                {strings.expertReportLabel}
              </Text>
              <Text style={styles.dateLabel}>
                {`${strings.verifiedDateLabel} ${this.dateFormatted(
                  details?.expert?.date,
                  'DD.MM.YYYY HH:mm'
                )}`}
              </Text>
              <Text style={styles.detailsText}>
                {details?.expert_opinion?.comment}
              </Text>
            </View>
          </View>
        </ScrollView>
      );
  }
}

// TODO: replace any with correct types
VerifiedDetailsScreen.propTypes = {
  details: PropTypes.shape({
    expert: PropTypes.shape({
      date: PropTypes.any,
    }),
    expert_opinion: PropTypes.shape({
      comment: PropTypes.any,
    }),
    id: PropTypes.any,
    reported_at: PropTypes.any,
    screenshot_url: PropTypes.string,
    title: PropTypes.any,
    url: PropTypes.any,
    verdict: PropTypes.any,
  }),
  error: PropTypes.any,
  fetchVerifiedDetailsRequest: PropTypes.func,
  isFetching: PropTypes.any,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.any,
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 16,
  },
  dateLabel: {
    color: DARK_GRAY,
    fontSize: 12,
  },
  verdictContainer: {
    flexDirection: 'row',
    height: 40,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  verdictText: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    aspectRatio: 1.5,
    backgroundColor: 'black',
    padding: 8,
    marginTop: 8,
  },
  detailsContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  detailsTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: 32,
  },
  detailsText: {
    color: 'black',
    fontSize: 14,
  },
  url: {
    color: 'blue',
    fontSize: 14,
  },
  shareButton: {
    width: 30,
    height: 30,
  },
});

const mapStateToProps = (state) => {
  return {
    details: state.articles.details.data,
    isFetching: state.articles.details.isFetching,
    error: state.articles.details.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedDetailsRequest: (...args) =>
      dispatch(feedActions.details(...args)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifiedDetailsScreen);
