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
import { useDispatch, useSelector } from 'react-redux';
import Moment from 'moment';
import ImageViewer from 'react-native-image-zoom-viewer';
import Hyperlink from 'react-native-hyperlink';
import { useNavigation } from '@react-navigation/native';

import {
  LoadingOverlay,
  DropDownAlert,
  TouchableOpacityDebounce,
  Container,
  ShareButton,
} from '../components';
import { strings } from '../constants/strings';
import {
  DARK_GRAY,
  CINNABAR,
  WHITE,
  BLACK,
  VERDICT_TRUE,
  VERDICT_FALSE,
  VERDICT_UNIDENTIFIED,
} from '../constants/colors';
import { feedActions } from '../storages/verified/actions';
import { APP_URL } from '../constants/urls';
import VerifiedNot from '../resources/img/verifiedCell/verifiedNot.svg';
import VerifiedOk from '../resources/img/verifiedCell/verifiedOk.svg';
import VerifiedBad from '../resources/img/verifiedCell/verifiedBad.svg';
import Close from '../resources/img/close.svg';
import Launch from '../resources/img/launch.svg';
import { openUrl } from '../utils/url';

const URL_FONT_SIZE = 14;
const VERIFICATION_STATUS = {
  true: {
    color: VERDICT_TRUE,
    image: (
      <VerifiedOk width={40} height={40} style={{ color: VERDICT_TRUE }} />
    ),
    text: strings.report.authentic,
  },
  false: {
    color: VERDICT_FALSE,
    image: (
      <VerifiedBad width={40} height={40} style={{ color: VERDICT_FALSE }} />
    ),
    text: strings.report.fakeNews,
  },
  unidentified: {
    color: VERDICT_UNIDENTIFIED,
    image: (
      <VerifiedNot
        width={40}
        height={40}
        style={{ color: VERDICT_UNIDENTIFIED }}
      />
    ),
    text: strings.report.unverifiable,
  },
};

const LaunchImage = (
  <Launch width={URL_FONT_SIZE} height={URL_FONT_SIZE} fill={CINNABAR} />
);

const formatDate = (date, format) =>
  Moment(date).format(format ?? 'DD.MM.YYYY HH:mm');
const getSourcesArray = (sourcesString) =>
  (sourcesString ?? []).split('\n').filter((source) => !!source);
const fhLink = (id) => `${APP_URL}/raport/${id}`;

const VerifiedDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState(0);
  const imageOpacity = useRef(new Animated.Value(0)).current;

  const { details, isFetching, error } = useSelector(
    ({ articles: { details } }) => ({
      details: details.data,
      isFetching: details.isFetching,
      error: details.error,
    })
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareButton onShare={handleShare} />,
    });
  }, []);

  useEffect(() => {
    dispatch(feedActions.details(route.params?.id));
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

  const handleShare = async () => {
    try {
      const url = fhLink(details?.id);
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

  const renderImageModalHeader = () => (
    <SafeAreaView style={{ position: 'absolute', zIndex: 1 }}>
      <TouchableOpacityDebounce
        style={styles.closeButton}
        onPress={() => setImageViewerVisible(false)}
      >
        <Close width={40} height={40} fill={WHITE} />
      </TouchableOpacityDebounce>
    </SafeAreaView>
  );

  const renderSource = (value) => (
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

  const renderExpertSources = () => {
    const sources = getSourcesArray(
      details.expert_opinion?.confirmation_sources
    );
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
          const sources = getSourcesArray(
            details.expert_opinion?.confirmation_sources
          );
          return (
            <View style={{ marginBottom: 16 }} key={report.title}>
              <Text style={styles.detailsSubtitle}>
                {strings.verifiedDetails.communityReportLabel} {index + 1}
              </Text>
              <Text style={styles.dateLabel}>
                {strings.verifiedDetails.verifiedDateLabel}{' '}
                {formatDate(details?.expert?.date)}
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

  const verificationStatus = VERIFICATION_STATUS[details.verdict];
  const reportUrl = fhLink(details.id);
  return (
    <ScrollView style={{ backgroundColor: WHITE }}>
      <View style={styles.container}>
        <Container style={styles.titleContainer}>
          <Text style={styles.title}>{details?.title}</Text>
          <Text style={styles.dateLabel}>{`${
            strings.verifiedDetails.reportDateLabel
          } ${formatDate(details?.reported_at, 'DD.MM.YYYY')}`}</Text>
        </Container>

        <Container style={styles.verdictContainer}>
          <Text
            style={{ ...styles.detailsTitle, marginTop: 0, marginRight: 8 }}
          >
            {strings.report.verdict}
          </Text>
          {verificationStatus.image}
          <Text
            style={{
              ...styles.verdictText,
              color: verificationStatus.color,
            }}
          >
            {verificationStatus.text}
          </Text>
        </Container>
        {!!details.screenshot_url && (
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
        )}
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
          <Text style={styles.url} onPress={() => openUrl(reportUrl)}>
            {LaunchImage} {reportUrl}
          </Text>

          <Text style={{ ...styles.detailsTitle, marginBottom: 4 }}>
            {strings.verifiedDetails.expertReportLabel}
          </Text>
          <Text style={styles.dateLabel}>
            {`${strings.verifiedDetails.verifiedDateLabel} ${formatDate(
              details?.expert?.date
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

VerifiedDetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    paddingBottom: 16,
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
  closeButton: {
    marginLeft: 16,
    marginTop: 20,
    width: 40,
    height: 40,
  },
});

export default VerifiedDetailsScreen;
