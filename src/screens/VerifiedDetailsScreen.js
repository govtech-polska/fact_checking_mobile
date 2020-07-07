import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  Linking,
  ScrollView,
  Modal,
} from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';

import {
  promiseDispatch,
  fetchVerifiedDetailsRequest,
  verifiedDetailsScreenUnmounted,
} from '../actions'
import {
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
} from '../components';
import { strings } from '../constants/strings';
import { DARK_GRAY } from '../constants/colors';

class VerifiedDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      verifiedDetails: null,
      imageViewerVisible: false,
    };
  }

  async componentDidMount() {
    const { id } = this.props.route.params;
    try {
      const verifiedDetails = await this.props.fetchVerifiedDetailsRequest(id);
      console.log('VerifiedDetailsScreen verifiedDetails:', verifiedDetails);
      this.setState({ loading: false, verifiedDetails });
    } catch (error) {
      this.setState({ loading: false });
      DropDownAlert.showError();

    }
  }

  componentWillUnmount() {
    this.props.verifiedDetailsScreenUnmounted();
  }

  dateFormatted(date, format) {
    return Moment(date).format(format)
  }

  fhLink(id) {
    return `https://app.fakehunter.pap.pl/${id}`
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
            { url: this.state.verifiedDetails.screenshot_url },
          ]}
          onRequestClose={this.toggleImageViewerVisibility}
          onCancel={this.toggleImageViewerVisibility}
        />
      </Modal>
    )
  }

  render() {
    const {
      loading,
      verifiedDetails,
    } = this.state;
    return (
      loading ? (<LoadingOverlay loading />) : (
        <ScrollView style={{ backgroundColor: 'white' }}>
          {this.renderImageModalIfNeeded()}
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>
                {verifiedDetails?.expert?.title}
              </Text>
              <Text style={styles.dateLabel}>{`${strings.reportDateLabel} ${this.dateFormatted(verifiedDetails?.reported_at, 'DD.MM.YYYY')}`}</Text>
            </View>

            <TouchableOpacityDebounce
              onPress={this.toggleImageViewerVisibility}
            >
              <Image
                resizeMode='contain'
                style={styles.image}
                source={{ uri: verifiedDetails.screenshot_url || '' }}
              />
            </TouchableOpacityDebounce>

            <View style={styles.detailsContainer}>

              <Text style={styles.detailsTitle}>{strings.informationSourceLabel}</Text>
              <Text
                style={styles.url}
                onPress={() => this.openUrl(verifiedDetails.url)}
              >
                {verifiedDetails.url}
              </Text>

              <Text style={styles.detailsTitle}>{strings.fhLinkLabel}</Text>
              <Text
                style={styles.url}
                onPress={() => this.openUrl(this.fhLink(verifiedDetails.id))}
              >
                {this.fhLink(verifiedDetails.id)}
              </Text>

              <Text style={{ ...styles.detailsTitle, marginBottom: 4 }}>
                {strings.expertReportLabel}
              </Text>
              <Text style={styles.dateLabel}>
                {`${strings.verifiedDateLabel} ${this.dateFormatted(verifiedDetails?.expert?.date, 'DD.MM.YYYY HH:mm')}`}
              </Text>
              <Text style={styles.detailsText}>{verifiedDetails?.expert?.comment}</Text>

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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchVerifiedDetailsRequest: (...args) => promiseDispatch(dispatch, fetchVerifiedDetailsRequest, ...args),
    verifiedDetailsScreenUnmounted: () => dispatch(verifiedDetailsScreenUnmounted()),
  };
};

export default connect(null, mapDispatchToProps)(VerifiedDetailsScreen);
