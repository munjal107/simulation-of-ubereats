
// simple config 

// import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension';
// import thunk from 'redux-thunk'
// import rootReducer from './rootReducer';

// const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))

// export default store

// Persist store config

import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from 'redux-thunk'
 
import rootReducer from './rootReducer'

const persistConfig = {
    key: 'root',
    storage,
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)
 
  export default () => {
    let store = createStore(persistedReducer,  composeWithDevTools(applyMiddleware(thunk)))
    let persistor = persistStore(store)
    return { store, persistor }
  }
//   export default () => {
//     const store = createStore(
//       persistedReducer,
//       // eslint-disable-next-line no-underscore-dangle
//       window._REDUX_DEVTOOLS_EXTENSION_ && window._REDUX_DEVTOOLS_EXTENSION_(),
//     );
//     const persistor = persistStore(store);
//     return { store, persistor };
//   };
// export const store  = createStore(persistedReducer,  composeWithDevTools(applyMiddleware(thunk)))
// export const persistor = persistStore(store) 