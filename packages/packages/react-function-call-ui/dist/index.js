'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
require('prop-types');
var nativeBase = require('native-base');
var reactNative = require('react-native');

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var nonStringTypes = ['int', 'float', 'tuple', 'boolean'];
var checkNonString = function checkNonString(itemType) {
  return nonStringTypes.find(function (typ) {
    return itemType.includes(typ);
  });
};
var decodeValueString = function decodeValueString(value) {
  return value || '';
};
var encodeValueString = function encodeValueString(value) {
  return value || '';
};
var decodeValueNonString = function decodeValueNonString(value) {
  return value ? JSON.parse(value) : null;
};
var encodeValueNonString = function encodeValueNonString(value) {
  return value ? JSON.stringify(value) : '';
};

function IoUI(props) {
  var item = props.item;

  var isNonString = checkNonString(item.type);
  var decodeValue = void 0,
      encodeValue = void 0;

  if (isNonString) {
    decodeValue = decodeValueNonString;
    encodeValue = encodeValueNonString;
  } else {
    decodeValue = decodeValueString;
    encodeValue = encodeValueString;
  }

  if (item.type === 'link') {
    return React__default.createElement(
      nativeBase.Text,
      {
        accessibilityRole: 'link',
        href: props.value,
        style: { color: 'blue' },
        target: '_blank'
      },
      props.value
    );
  }

  return React__default.createElement(nativeBase.Input, {
    value: encodeValue(props.value),
    onChangeText: function onChangeText(text) {
      return props.onValueChange(decodeValue(text));
    },
    styles: props.styles,
    disabled: props.readonly
  });
}

var FunctionIo = function (_Component) {
  inherits(FunctionIo, _Component);

  // static propTypes = {
  //   text: PropTypes.string
  // }

  function FunctionIo(props) {
    classCallCheck(this, FunctionIo);

    var _this = possibleConstructorReturn(this, (FunctionIo.__proto__ || Object.getPrototypeOf(FunctionIo)).call(this, props));

    _this.state = {
      componentsOpened: false,
      componentValues: props.value

      // this.onValueChange = this.onValueChange.bind(this);
    };_this.onComponentsValueChange = _this.onComponentsValueChange.bind(_this);
    _this.onOpenComponents = _this.onOpenComponents.bind(_this);

    _this._renderHeader = _this._renderHeader.bind(_this);
    _this._renderContent = _this._renderContent.bind(_this);
    return _this;
  }

  createClass(FunctionIo, [{
    key: 'getLabel',
    value: function getLabel(item) {
      return item.label || item.name + ':' + item.type;
    }
  }, {
    key: 'onOpenComponents',
    value: function onOpenComponents() {
      this.setState({ componentsOpened: true });
    }
  }, {
    key: 'onComponentsValueChange',
    value: function onComponentsValueChange(value, i) {
      var componentValues = this.state.componentValues;
      componentValues[i] = value;
      this.setState({ componentValues: componentValues });
      this.props.onValueChange(componentValues);
    }
  }, {
    key: '_renderHeader',
    value: function _renderHeader(item, expanded) {
      var label = this.getLabel(item);
      return React__default.createElement(
        nativeBase.View,
        {
          style: _extends({
            padding: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#fafafa'
          }, this.props.styles)
        },
        React__default.createElement(
          nativeBase.View,
          { style: _extends({}, this.props.styles, { flexDirection: 'row' }) },
          expanded ? React__default.createElement(nativeBase.Icon, { style: { fontSize: 18 }, name: 'remove-circle' }) : React__default.createElement(nativeBase.Icon, { style: { fontSize: 18 }, name: 'add-circle' }),
          React__default.createElement(
            nativeBase.Item,
            { stackedLabel: true, style: _extends({}, this.props.styles, { maxWidth: this.props.styles.minWidth }) },
            React__default.createElement(
              nativeBase.Label,
              null,
              label
            ),
            React__default.createElement(IoUI, {
              item: item,
              value: this.props.value,
              onValueChange: this.props.onValueChange,
              styles: this.props.styles,
              readonly: this.props.readonly
            })
          )
        )
      );
    }
  }, {
    key: '_renderContent',
    value: function _renderContent(item) {
      var _this2 = this;

      return (item.components || []).map(function (subio, i) {
        return React__default.createElement(FunctionIo, {
          key: i,
          styles: _this2.props.styles,
          item: subio,
          value: _this2.props.value[i],
          onValueChange: function onValueChange(value) {
            return _this2.onComponentsValueChange(value, i);
          },
          readonly: _this2.props.readonly
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          item = _props.item,
          styles = _props.styles,
          readonly = _props.readonly;

      if (!item) return React__default.createElement(
        nativeBase.Text,
        null,
        '---'
      );

      var label = this.getLabel(item);
      return React__default.createElement(
        nativeBase.View,
        { style: _extends({}, styles, { flexDirection: 'row', alignItems: 'center' }) },
        !item.components || item.components.length === 0 ? React__default.createElement(
          nativeBase.Item,
          { stackedLabel: true, style: { width: '100%' } },
          React__default.createElement(
            nativeBase.Label,
            null,
            label
          ),
          React__default.createElement(IoUI, {
            styles: styles,
            item: item,
            value: this.props.value,
            onValueChange: this.props.onValueChange,
            readonly: readonly
          })
        ) : React__default.createElement(nativeBase.Accordion, {
          dataArray: [item],
          expanded: 0,
          renderHeader: this._renderHeader,
          renderContent: this._renderContent,
          contentStyle: _extends({}, styles, { flex: 1, backgroundColor: '#ffffff' })
        })
      );
    }
  }]);
  return FunctionIo;
}(React.Component);

var CHAIN_NAMES = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  5: 'goerli',
  42: 'kovan'
};

var getEtherscanApi = function getEtherscanApi(chainid) {
  var chainname = CHAIN_NAMES[chainid];
  if (chainid === 1) chainname = '';else chainname += '.';
  return 'https://' + chainname + 'etherscan.io';
};

var getEtherscanTx = function getEtherscanTx(chainid, txhash) {
  return getEtherscanApi(chainid) + '/tx/' + txhash;
};

var PRERECEIPT_TYPE = {
  name: 'receipt',
  type: 'tuple',
  components: [{
    name: 'etherscan',
    type: 'link'
  }, {
    name: 'hash',
    type: 'string'
  }, {
    name: 'blockHash',
    type: 'string'
  }, {
    name: 'blockNumber',
    type: 'uint256'
  }, {
    name: 'confirmations',
    type: 'uint256'
  }]
};

var RECEIPT_TYPE = {
  name: 'receipt',
  type: 'tuple',
  components: [{
    name: 'etherscan',
    type: 'link'
  }, {
    name: 'transactionHash',
    type: 'string'
  }, {
    name: 'blockHash',
    type: 'string'
  }, {
    name: 'blockNumber',
    type: 'uint256'
  }, {
    name: 'confirmations',
    type: 'uint256'
  }]
};

function defaultVals(abityp) {
  if (!abityp || !abityp.components) {
    return [];
  }
  var item = new Array(abityp.components.length);
  abityp.components.forEach(function (comp, i) {
    if (comp.components) {
      item[i] = defaultVals(comp);
    }
  });
  return item;
}

var FunctionCall = function (_Component) {
  inherits(FunctionCall, _Component);

  function FunctionCall(props) {
    classCallCheck(this, FunctionCall);

    var _this = possibleConstructorReturn(this, (FunctionCall.__proto__ || Object.getPrototypeOf(FunctionCall)).call(this, props));

    _this.state = {
      inputs: _this.initInputsState(),
      outputs: _this.initOutputsState()
    };

    _this.buttonStyle = props.buttonStyle || styles.buttonStyle;

    _this.onValueChange = _this.onValueChange.bind(_this);
    _this.onRun = _this.onRun.bind(_this);
    return _this;
  }

  createClass(FunctionCall, [{
    key: 'initInputsState',
    value: function initInputsState() {
      var pfunction = this.props.item.pfunction;

      var ioGapiInputs = this.ioGapiInputs(pfunction);
      return ioGapiInputs && ioGapiInputs.components ? new Array(ioGapiInputs.components.length) : [];
    }
  }, {
    key: 'initOutputsState',
    value: function initOutputsState() {
      var pfunction = this.props.item.pfunction;

      var ioGapiOutputs = this.ioGapiOutputs(pfunction);
      return defaultVals(ioGapiOutputs);
    }
  }, {
    key: 'typesig',
    value: function typesig(typ) {
      var sig = '';
      if (typ.name) sig += typ.name + ':';
      sig += typ.type;
      return sig;
    }
  }, {
    key: 'ioGapiInputs',
    value: function ioGapiInputs(pfunction) {
      var _this2 = this;

      var signatureInp = '(' + pfunction.gapi.inputs.map(function (inp) {
        return _this2.typesig(inp);
      }).join(',') + ')';

      return pfunction.gapi.inputs.length > 0 ? {
        name: pfunction.signatureString,
        type: 'tuple',
        components: pfunction.gapi.inputs,
        label: signatureInp
      } : null;
    }
  }, {
    key: 'ioGapiOutputs',
    value: function ioGapiOutputs(pfunction) {
      var _this3 = this;

      var outputs = JSON.parse(JSON.stringify(pfunction.gapi.outputs || []));

      var signatureOut = '(' + outputs.map(function (inp) {
        return _this3.typesig(inp);
      }).join(',') + ')';

      if (pfunction.gapi.stateMutability === 'payable' || pfunction.gapi.stateMutability === 'nonpayable') {
        outputs = PRERECEIPT_TYPE.components;
        signatureOut = 'receipt' + ('(' + outputs.map(function (inp) {
          return _this3.typesig(inp);
        }).join(',') + ')');
      }

      return outputs.length > 0 ? {
        name: pfunction.signatureString,
        type: 'tuple',
        components: outputs,
        label: signatureOut
      } : null;
    }
  }, {
    key: 'onValueChange',
    value: function onValueChange(inputs) {
      this.setState({ inputs: inputs });
      if (this.props.onChange) {
        this.props.onChange({ inputs: inputs, outputs: this.state.outputs });
      }
    }
  }, {
    key: 'onRun',
    value: function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var _props$item, deployment, pfunction, onRun, result, outputs, receipt;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _props$item = this.props.item, deployment = _props$item.deployment, pfunction = _props$item.pfunction;
                onRun = this.props.onRun;
                _context.next = 4;
                return onRun(this.state.inputs);

              case 4:
                result = _context.sent;


                console.log('result', result);
                outputs = result instanceof Array ? result : [result];

                if (!(pfunction.gapi.stateMutability === 'payable' || pfunction.gapi.stateMutability === 'nonpayable')) {
                  _context.next = 15;
                  break;
                }

                outputs = PRERECEIPT_TYPE.components.map(function (comp) {
                  if (comp.name === 'etherscan') {
                    return getEtherscanTx(deployment.chainid, result.hash);
                  }
                  if (!result[comp.name]) return 'waiting';
                  return result[comp.name];
                });
                this.setState({ outputs: outputs });

                _context.next = 12;
                return result.wait(2);

              case 12:
                receipt = _context.sent;

                console.log('receipt', receipt);

                outputs = RECEIPT_TYPE.components.map(function (comp) {
                  if (comp.name === 'etherscan') {
                    return getEtherscanTx(deployment.chainid, receipt.transactionHash);
                  }
                  return receipt[comp.name];
                });

              case 15:

                this.setState({ outputs: outputs });

                if (this.props.onChange) {
                  this.props.onChange({ inputs: this.state.inputs, outputs: outputs });
                }

              case 17:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function onRun() {
        return _ref.apply(this, arguments);
      }

      return onRun;
    }()
  }, {
    key: 'render',
    value: function render() {
      var pfunction = this.props.item.pfunction;

      var width = this.props.styles.minWidth - 40;
      var ioStyles = { minWidth: width, width: width };

      var ioGapiInputs = this.ioGapiInputs(pfunction);
      var ioGapiOutputs = this.ioGapiOutputs(pfunction);

      return React__default.createElement(
        nativeBase.View,
        { style: _extends({}, this.props.styles, { flex: 1, width: this.props.styles.minWidth }) },
        React__default.createElement(
          nativeBase.Content,
          null,
          React__default.createElement(
            nativeBase.CardItem,
            { style: { backgroundColor: this.props.pfunctionColor(pfunction.gapi) } },
            React__default.createElement(
              nativeBase.View,
              { style: { flexDirection: 'row', alignItems: 'center' } },
              React__default.createElement(
                nativeBase.H1,
                { style: { paddingRight: 20 } },
                pfunction.gapi.name
              )
            )
          ),
          React__default.createElement(
            nativeBase.Card,
            null,
            React__default.createElement(
              nativeBase.CardItem,
              { header: true },
              React__default.createElement(
                nativeBase.Text,
                null,
                'Inputs'
              )
            ),
            React__default.createElement(
              nativeBase.CardItem,
              null,
              React__default.createElement(FunctionIo, {
                item: ioGapiInputs,
                value: this.state.inputs,
                onValueChange: this.onValueChange,
                styles: ioStyles
              })
            ),
            React__default.createElement(
              nativeBase.CardItem,
              { header: true },
              React__default.createElement(
                nativeBase.Text,
                null,
                'Outputs'
              )
            ),
            React__default.createElement(
              nativeBase.CardItem,
              null,
              React__default.createElement(FunctionIo, {
                item: ioGapiOutputs,
                readonly: true,
                value: this.state.outputs,
                styles: ioStyles
              })
            )
          )
        ),
        React__default.createElement(
          nativeBase.View,
          { style: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 5,
              borderTopWidth: 1,
              borderTopColor: '#cccccc'
            } },
          React__default.createElement(
            nativeBase.Left,
            null,
            React__default.createElement(
              nativeBase.Button,
              { small: true, rounded: true, style: this.buttonStyle, onClick: this.props.onInfoClosed },
              React__default.createElement(nativeBase.Icon, { type: 'MaterialCommunityIcons', name: 'close' })
            )
          ),
          React__default.createElement(
            nativeBase.Right,
            null,
            React__default.createElement(
              nativeBase.Button,
              { small: true, rounded: true, style: this.buttonStyle, onClick: this.onRun },
              React__default.createElement(nativeBase.Icon, { type: 'MaterialCommunityIcons', name: 'play' })
            )
          )
        )
      );
    }
  }]);
  return FunctionCall;
}(React.Component);


var styles = reactNative.StyleSheet.create({
  buttonStyle: {
    backgroundColor: '#cccccc'
  }
});

exports.FunctionIo = FunctionIo;
exports.FunctionCall = FunctionCall;
//# sourceMappingURL=index.js.map
