const path = require('path');
const {
  override,
  addWebpackAlias,
  babelInclude,
  addBabelPlugins,
} = require('customize-cra');

const overrideGeneral = override(
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
    "@babel/plugin-proposal-class-properties",
  ),
);

function overrideWasm(config, env) {
  const wasmExtensionRegExp = /\.wasm$/;
  console.log('overrideWasm config', config)
  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // Make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // Add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'src'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  });

  return config;
};

module.exports = (config, env) => overrideWasm(overrideGeneral(config, env), env);
