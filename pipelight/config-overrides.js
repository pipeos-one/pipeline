const path = require('path');
const {
  override,
  addWebpackAlias,
  babelInclude,
  addBabelPlugins
} = require('customize-cra');

module.exports = override(
  addWebpackAlias({
    "react-native/Libraries/Renderer/shims/ReactNativePropRegistry": "react-native-web/dist/modules/ReactNativePropRegistry",
    "react-native": "react-native-web"
  }),
  babelInclude([
    path.resolve('src'),
    path.resolve('node_modules/native-base-shoutem-theme'),
    path.resolve('node_modules/react-navigation'),
    path.resolve('node_modules/react-native-easy-grid'),
    path.resolve('node_modules/react-native-drawer'),
    path.resolve('node_modules/react-native-safe-area-view'),
    path.resolve('node_modules/react-native-vector-icons'),
    path.resolve('node_modules/react-native-keyboard-aware-scroll-view'),
    path.resolve('node_modules/react-native-web'),
    path.resolve('node_modules/react-native-tab-view'),
    path.resolve('node_modules/static-container'),
    path.resolve('node_modules/roboto-fontface'),
    path.resolve('node_modules/@pipeos/lens-react-accordion-list'),
    path.resolve('node_modules/@pipeos/lens-react-gapi'),
  ]),
  addBabelPlugins(
    "@babel/plugin-proposal-class-properties"
  ),
);
