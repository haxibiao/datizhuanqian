/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import './src/utils/global';

AppRegistry.registerComponent(appName, () => App);
