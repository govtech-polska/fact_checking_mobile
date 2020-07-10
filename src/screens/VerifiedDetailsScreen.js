import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  ScrollView,
  Modal,
  Button,
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
import { DARK_GRAY } from '../constants/colors';
import { feedActions } from '../storages/verified/actions'
import { APP_URL } from '../constants/api';

class VerifiedDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageViewerVisible: false,
    };

    props.navigation.setOptions({
      headerRight: () => (
        <TouchableOpacityDebounce
          style={{ width: 30, height: 30 }}
          onPress={this.onShare}
        >
          <Image
            style={{ flex: 1 }}
            resizeMode='contain'
            source={require('../resources/img/share.png')}
          />
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
      DropDownAlert.showError()
    }
  }

  dateFormatted(date, format) {
    return Moment(date).format(format)
  }

  fhLink(id) {
    return `${APP_URL}/${id}`
  }

  openUrl(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        DropDownAlert.showError();
      }
    });
  }

  toggleImageViewerVisibility = () => {
    this.setState((prevState) => ({ imageViewerVisible: !prevState.imageViewerVisible }));
  }

  renderImageModalIfNeeded = () => {
    const { imageViewerVisible } = this.state;
    const { details } = this.props;
    return (
      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="slide"
      >
        <ImageViewer
          enableSwipeDown
          renderIndicator={() => { }}
          imageUrls={[
            { url: details?.screenshot_url || '' },
          ]}
          onRequestClose={this.toggleImageViewerVisibility}
          onCancel={this.toggleImageViewerVisibility}
        />
      </Modal>
    )
  }

  onShare = async () => {
    try {
      const { details: { id } } = this.props;
      const result = await Share.share({
        ...Platform.select({
          android: {
            message: `${APP_URL}/${id}`,
          }
        }),
        url: `${APP_URL}/${id}`,
      });
    } catch (error) {
      DropDownAlert.showError();
    }
  };

  render() {
    const {
      details,
      isFetching,
    } = this.props;

    return (
      (isFetching || !details) ? (<LoadingOverlay loading />) : (
        <ScrollView style={{ backgroundColor: 'white' }}>
          {this.renderImageModalIfNeeded()}
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {details?.title}
              </Text>
              <Text style={styles.dateLabel}>{`${strings.reportDateLabel} ${this.dateFormatted(details?.reported_at, 'DD.MM.YYYY')}`}</Text>
            </View>

            <TouchableOpacityDebounce
              onPress={this.toggleImageViewerVisibility}
            >
              <Image
                resizeMode='contain'
                style={styles.image}
                source={{ uri: details.screenshot_url || '' }}
              />
            </TouchableOpacityDebounce>

            <View style={styles.detailsContainer}>

              <Text style={styles.detailsTitle}>{strings.informationSourceLabel}</Text>
              <Text
                style={styles.url}
                onPress={() => this.openUrl(details.url)}
              >
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
                {`${strings.verifiedDateLabel} ${this.dateFormatted(details?.expert?.date, 'DD.MM.YYYY HH:mm')}`}
              </Text>
              <Text style={styles.detailsText}>{details?.expert_opinion?.comment}</Text>

            </View>
          </View>
        </ScrollView>
      )
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
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
  image: {
    marginTop: 8,
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
  }
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
    fetchVerifiedDetailsRequest: (...args) => dispatch(feedActions.details(...args)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedDetailsScreen);
