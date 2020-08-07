import { useRef, useEffect } from 'react';

import {
  Platform,
  AppState,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
const { SharedModule, UrlShareModule } = NativeModules;

export const useShareEvent = ({ onShare }) => {
  const shareEvent = useRef(null);
  const checkShareUrl = () => {
    SharedModule.getShareUrl((error, url) => {
      SharedModule.clearShareUrl();
      onShare?.(url);
    });
  };

  const handleAndroidShareUrl = ({ url }) => {
    UrlShareModule.clearActionUrl();
    onShare?.(url);
  };

  const handleAppStateChange = (nextState) => {
    if (nextState === 'active' && Platform.OS === 'ios') {
      checkShareUrl();
    }
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      checkShareUrl();
    } else {
      shareEvent.current = DeviceEventEmitter.addListener(
        'shareUrl',
        handleAndroidShareUrl
      );
      UrlShareModule.getShareUrl();
    }

    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
      shareEvent.current?.remove();
    };
  }, []);
};
