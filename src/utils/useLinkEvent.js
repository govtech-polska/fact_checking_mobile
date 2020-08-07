import { useRef, useEffect } from 'react';
import {
  Platform,
  NativeModules,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
const { SharedModule, UrlShareModule } = NativeModules;

export const useLinkEvent = ({ onUrlOpen }) => {
  const urlEvent = useRef(null);

  const checkOpenUrl = () => {
    SharedModule.getOpenUrl((error, url) => {
      SharedModule.clearOpenUrl();
      onUrlOpen?.(url);
    });
  };

  const handleExternalUrlOpen = ({ url }) => {
    if (Platform.OS === 'ios') {
      SharedModule.clearOpenUrl();
    } else {
      UrlShareModule.clearOpenUrl();
    }
    onUrlOpen?.(url);
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Linking.addEventListener('url', handleExternalUrlOpen);
      checkOpenUrl();
    } else {
      urlEvent.current = DeviceEventEmitter.addListener(
        'openUrl',
        handleExternalUrlOpen
      );
      UrlShareModule.getOpenUrl();
    }

    return () => {
      urlEvent.current?.remove();
      Linking.removeEventListener('url', handleExternalUrlOpen);
    };
  }, []);
};
