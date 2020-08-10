import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Modal,
  Share,
  Platform,
  SafeAreaView,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import Moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import Hyperlink from 'react-native-hyperlink';

import {
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
  Container,
} from '../components';
import { strings } from '../constants/strings';
import { DARK_GRAY, CINNABAR, WHITE, BLACK } from '../constants/colors';
import { feedActions } from '../storages/verified/actions';
import { APP_URL } from '../constants/urls';
import VerifiedNot from '../resources/img/verifiedCell/verifiedNot.svg';
import VerifiedOk from '../resources/img/verifiedCell/verifiedOk.svg';
import VerifiedBad from '../resources/img/verifiedCell/verifiedBad.svg';
import AndroidShareImg from '../resources/img/share-android.svg';
import IOSShareImg from '../resources/img/share-ios.svg';
import Close from '../resources/img/close.svg';
import Launch from '../resources/img/launch.svg';
import { openUrl } from '../utils/url';
import { useNavigation } from '@react-navigation/native';

const URL_FONT_SIZE = 14;
const isAndroid = Platform.OS === 'android';
const LaunchImage = (
  <Launch width={URL_FONT_SIZE} height={URL_FONT_SIZE} fill={CINNABAR} />
);

const ShareIcon = ({ onShare }) => (
  <TouchableOpacityDebounce style={styles.shareButton} onPress={onShare}>
    {isAndroid && <AndroidShareImg fill={BLACK} />}
    {!isAndroid && <IOSShareImg fill={CINNABAR} />}
  </TouchableOpacityDebounce>
);

ShareIcon.propTypes = {
  onShare: PropTypes.func,
};

const dateFormatted = (date, format) => Moment(date).format(format);
const fhLink = (id) => `${APP_URL}/${id}`;

const VerifiedDetailsScreen = ({
  route,
  error,
  isFetching,
  fetchVerifiedDetailsRequest,
  details,
}) => {
  const navigation = useNavigation();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(0);
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareIcon onShare={onShare} />,
    });
  }, []);

  useEffect(() => {
    const { id } = route.params;
    fetchVerifiedDetailsRequest(id);
  }, []);

  useEffect(() => {
    if (details?.screenshot_url) {
      Image.getSize(details.screenshot_url, (width, height) => {
        setImageAspectRatio(width / height);
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [details?.screenshot_url]);

  useEffect(() => {
    if (error) {
      DropDownAlert.showError();
    }
  }, [error]);

  const toggleImageViewerVisibility = () => {
    setImageViewerVisible(!imageViewerVisible);
  };

  const onShare = async () => {
    try {
      const url = fhLink(details.url);
      await Share.share({
        ...Platform.select({
          android: {
            message: url,
          },
        }),
        url,
      });
    } catch (error) {
      DropDownAlert.showError();
    }
  };

  const verificationStatusImage = () => {
    if (!details) return null;
    switch (details.verdict) {
      case 'true':
        return <VerifiedOk width={40} height={40} style={{ color: 'green' }} />;
      case 'false':
        return (
          <VerifiedBad width={40} height={40} style={{ color: CINNABAR }} />
        );
      default:
        return <VerifiedNot width={40} height={40} style={{ color: 'gray' }} />;
    }
  };

  const verificationStatusText = () => {
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

  const verificationStatusColor = () => {
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

  const renderImageModalHeader = () => {
    return (
      <SafeAreaView style={{ position: 'absolute', zIndex: 1 }}>
        <TouchableOpacityDebounce
          style={styles.closeButton}
          onPress={() => setImageViewerVisible(false)}
        >
          <Close width={40} height={40} fill={WHITE} />
        </TouchableOpacityDebounce>
      </SafeAreaView>
    );
  };

  const renderSource = (value) => {
    return (
      <Hyperlink
        key={value}
        linkDefault={true}
        linkStyle={styles.url}
        linkText={(url) => (
          <Text>
            {LaunchImage} {url}
          </Text>
        )}
        style={{ flexDirection: 'row', marginTop: 8 }}
      >
        <Text style={styles.detailsText}>{value}</Text>
      </Hyperlink>
    );
  };

  const renderExpertSources = () => {
    const sources =
      details.expert_opinion?.confirmation_sources
        .split('\n')
        .filter((source) => !!source) ?? [];
    if (sources.length === 0) {
      return null;
    }
    return (
      <>
        <Text style={{ ...styles.detailsSubtitle, marginTop: 12 }}>
          {strings.verifiedDetails.sources}
        </Text>
        {sources.map(renderSource)}
      </>
    );
  };

  const renderFactCheckerOpinions = () => {
    if (details.fact_checker_opinions.length === 0) return null;
    return (
      <>
        <Text style={{ ...styles.detailsTitle, marginBottom: 4 }}>
          {strings.verifiedDetails.communityReportsLabel}
        </Text>

        {details.fact_checker_opinions.map((report, index) => {
          const sources = report.confirmation_sources
            .split('\n')
            .filter((source) => !!source);
          return (
            <View style={{ marginBottom: 16 }} key={report.title}>
              <Text style={styles.detailsSubtitle}>
                {strings.verifiedDetails.communityReportLabel} {index + 1}
              </Text>
              <Text style={styles.dateLabel}>
                {strings.verifiedDetails.verifiedDateLabel}{' '}
                {dateFormatted(details?.expert?.date, 'DD.MM.YYYY HH:mm')}
              </Text>
              <Text style={styles.detailsText}>{report.comment}</Text>
              {sources.map(renderSource)}
            </View>
          );
        })}
      </>
    );
  };

  if (isFetching || !details) {
    return <LoadingOverlay loading />;
  }

  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View style={styles.container}>
        <Container style={styles.titleContainer}>
          <Text style={styles.title}>{details?.title}</Text>
          <Text style={styles.dateLabel}>{`${
            strings.verifiedDetails.reportDateLabel
          } ${dateFormatted(details?.reported_at, 'DD.MM.YYYY')}`}</Text>
        </Container>

        <Container style={styles.verdictContainer}>
          <Text
            style={{ ...styles.detailsTitle, marginTop: 0, marginRight: 8 }}
          >
            {strings.report.verdict}
          </Text>
          {verificationStatusImage()}
          <Text
            style={{
              ...styles.verdictText,
              color: verificationStatusColor(),
            }}
          >
            {verificationStatusText()}
          </Text>
        </Container>

        <TouchableOpacityDebounce
          onPress={toggleImageViewerVisibility}
          style={[styles.imageWrapper, { opacity: imageOpacity }]}
        >
          <Image
            resizeMode="contain"
            style={[styles.image, { aspectRatio: imageAspectRatio }]}
            source={{ uri: details.screenshot_url || '' }}
          />
        </TouchableOpacityDebounce>

        <Container style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>
            {strings.verifiedDetails.informationSourceLabel}
          </Text>
          <Text style={styles.url} onPress={() => openUrl(details.url)}>
            {LaunchImage} {details.url}
          </Text>

          <Text style={styles.detailsTitle}>
            {strings.verifiedDetails.fhLinkLabel}
          </Text>
          <Text style={styles.url} onPress={() => openUrl(fhLink(details.id))}>
            {LaunchImage} {fhLink(details.id)}
          </Text>

          <Text style={{ ...styles.detailsTitle, marginBottom: 4 }}>
            {strings.verifiedDetails.expertReportLabel}
          </Text>
          <Text style={styles.dateLabel}>
            {`${strings.verifiedDetails.verifiedDateLabel} ${dateFormatted(
              details?.expert?.date,
              'DD.MM.YYYY HH:mm'
            )}`}
          </Text>
          <Text style={styles.detailsText}>
            {details?.expert_opinion?.comment}
          </Text>
          {renderExpertSources()}

          {renderFactCheckerOpinions()}
        </Container>
      </View>

      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <ImageViewer
          enableSwipeDown
          renderIndicator={() => {}}
          imageUrls={[{ url: details?.screenshot_url || '' }]}
          onRequestClose={toggleImageViewerVisibility}
          onCancel={toggleImageViewerVisibility}
          renderHeader={renderImageModalHeader}
        />
      </Modal>
    </ScrollView>
  );
};

// TODO: replace any with correct types
VerifiedDetailsScreen.propTypes = {
  details: PropTypes.shape({
    expert: PropTypes.shape({
      date: PropTypes.any,
    }),
    expert_opinion: PropTypes.shape({
      comment: PropTypes.any,
      confirmation_sources: PropTypes.string,
    }),
    id: PropTypes.any,
    reported_at: PropTypes.any,
    screenshot_url: PropTypes.string,
    title: PropTypes.any,
    url: PropTypes.any,
    verdict: PropTypes.any,
    fact_checker_opinions: PropTypes.arrayOf(
      PropTypes.shape({
        comment: PropTypes.string,
        confirmation_sources: PropTypes.string,
        date: PropTypes.string,
        title: PropTypes.string,
      })
    ),
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
    backgroundColor: WHITE,
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  title: {
    color: BLACK,
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
    alignItems: 'center',
  },
  verdictText: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageWrapper: {
    margin: 8,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 1,
    backgroundColor: WHITE,
  },
  image: {
    width: '100%',
  },
  detailsContainer: {
    flex: 1,
    width: '100%',
  },
  detailsTitle: {
    color: BLACK,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    marginTop: 32,
  },
  detailsSubtitle: {
    color: BLACK,
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsText: {
    color: BLACK,
    fontSize: 14,
  },
  url: {
    color: CINNABAR,
    fontSize: URL_FONT_SIZE,
  },
  shareButton: {
    width: 24,
    height: 24,
    marginRight: isAndroid ? 16 : 8,
  },
  closeButton: {
    marginLeft: 16,
    marginTop: 20,
    width: 40,
    height: 40,
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
