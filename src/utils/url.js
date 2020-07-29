import { Linking } from 'react-native';
import Route from 'route-parser';
import qs from 'qs';
import { DropDownAlert } from '../components';

export const resolveUrl = (path, params, query) => {
  const route = new Route(path);
  const url = route.reverse(params);
  const queryString = qs.stringify(query, {
    arrayFormat: 'brackets',
    addQueryPrefix: true,
  });
  return `${url}${queryString}`;
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
