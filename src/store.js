import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk'
import * as storage from 'redux-storage';
import createEngine from 'redux-storage-engine-localforage';

import rootReducer from './reducers'

const reducer = storage.reducer(rootReducer)
const engine = createEngine('telegramista');
const middlewares = [thunk, storage.createMiddleware(engine)]
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

const enhancer = composeEnhancers(applyMiddleware(...middlewares))
const persistReducer = storage.reducer(reducer)
const store = createStore(persistReducer, enhancer)

const load = storage.createLoader(engine);
load(store);

export { store as default }
