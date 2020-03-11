/**
 * @format
 */
import './src/utils/global';
import { AppRegistry, YellowBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);

YellowBox.ignoreWarnings([
    'Accessing view manager configs',
    'Remote debugger is in a background tab',
    'Task orphaned',
    'Warning: componentWillReceiveProps is deprecated',
    'Warning: componentWillMount is deprecated',
    'Warning: ViewPagerAndroid',
    'Warning:',
]);
