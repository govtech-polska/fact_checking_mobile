import { useRef, useEffect } from 'react';
import {
  Platform,
  NativeModules,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
const { SharedModule, UrlShareModule } = NativeModules;

const isIOS = Platform.OS === 'ios';
export const useLinkEvent = ({ onUrlOpen }) => {
  const urlEvent = useRef(null);

  const checkOpenUrl = () => {
    SharedModule.getOpenUrl((error, url) => {
      SharedModule.clearOpenUrl();
      onUrlOpen?.(url);
    });
  };

  const handleExternalUrlOpen = ({ url }) => {
    if (isIOS) {
      SharedModule.clearOpenUrl();
    } else {
      UrlShareModule.clearOpenUrl();
    }
    onUrlOpen?.(url);
  };

  useEffect(() => {
    if (isIOS) {
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
      if (isIOS) {
        Linking.removeEventListener('url', handleExternalUrlOpen);
      }
    };
  }, []);
};
