import { Linking } from 'react-native';
import Route from 'route-parser';
import { DropDownAlert } from '../components';

export const resolveUrl = (path, params) => {
  const route = new Route(path);
  const url = route.reverse(params);
  return `${url}`;
};

export const openUrl = (url) => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      DropDownAlert.showError();
    }
  });
};
