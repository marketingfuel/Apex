/**
 * @format
 */
import React from "react";
import { AppRegistry } from 'react-native';
import App from './App';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store/Store';
import 'react-native-gesture-handler';

import { name as appName } from './app.json';

const AppContainer = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>

  );
};
AppRegistry.registerComponent(appName, () => AppContainer);
