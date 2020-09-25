import store from '../base/redux/configureStore';

import {
  getCurrentLanguageTag,
  translationGetters,
} from '../utils/translations';

const languageTag = getCurrentLanguageTag();
const strings = translationGetters[languageTag]();

store.dispatch({
  type: 'SET_LANGUAGE',
  payload: languageTag,
});

export { strings };
