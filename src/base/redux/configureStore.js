import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import { createLogger } from 'redux-logger';

import reducers from './rootReducer';
import rootSaga from './rootSaga';

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware];

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({ collapsed: true });
  middleware.push(logger);
}

const store = configureStore();

function configureStore(initialState) {
  return createStore(reducers, initialState, applyMiddleware(...middleware));
}

sagaMiddleware.run(rootSaga);
export default store;
