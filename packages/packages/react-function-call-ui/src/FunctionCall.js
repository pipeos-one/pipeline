import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  Content,
  View,
  Card,
  CardItem,
  Icon,
  Text,
  Button,
  H1,
  Right,
  Left,
} from 'native-base';

import FunctionIo from './FunctionIo.js';
import { getEtherscanTx, PRERECEIPT_TYPE, RECEIPT_TYPE } from './utils.js';

function defaultVals(abityp) {
  if (!abityp || !abityp.components) {
    return [];
  }
  let item = new Array(abityp.components.length);
  abityp.components.forEach((comp, i) => {
    if (comp.components) {
      item[i] = defaultVals(comp);
    }
  });
  return item;
}

export default class FunctionCall extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: this.initInputsState(),
      outputs: this.initOutputsState(),
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onRun = this.onRun.bind(this);
  }

  initInputsState() {
    const { pfunction } = this.props.item;
    const ioGapiInputs = this.ioGapiInputs(pfunction);
    return ioGapiInputs && ioGapiInputs.components
      ? new Array(ioGapiInputs.components.length)
      : [];
  }

  initOutputsState() {
    const { pfunction } = this.props.item;
    const ioGapiOutputs = this.ioGapiOutputs(pfunction);
    return defaultVals(ioGapiOutputs);
  }

  typesig(typ) {
    let sig = '';
    if (typ.name) sig += `${typ.name}:`;
    sig += typ.type;
    return sig;
  }

  ioGapiInputs(pfunction) {
    const signatureInp = `(${pfunction.gapi.inputs.map(inp => this.typesig(inp)).join(',')})`;

    return pfunction.gapi.inputs.length > 0 ? {
      name: pfunction.signatureString,
      type: 'tuple',
      components: pfunction.gapi.inputs,
      label: signatureInp,
    } : null;
  }

  ioGapiOutputs(pfunction) {
    let outputs = JSON.parse(JSON.stringify(
      pfunction.gapi.outputs || []
    ));

    let signatureOut = `(${outputs.map(inp => this.typesig(inp)).join(',')})`;

    if (
      pfunction.gapi.stateMutability === 'payable'
      || pfunction.gapi.stateMutability === 'nonpayable'
    ) {
      outputs = PRERECEIPT_TYPE.components;
      signatureOut = 'receipt' + `(${outputs.map(inp => this.typesig(inp)).join(',')})`;
    }

    return outputs.length > 0 ? {
      name: pfunction.signatureString,
      type: 'tuple',
      components: outputs,
      label: signatureOut,
    } : null;
  }

  onValueChange(value) {
    this.setState({ inputs: value });
  }

  async onRun() {
    const { deployment, pfunction } = this.props.item;
    const { onRun } = this.props;

    const result = await onRun(this.state.inputs);

    console.log('result', result);
    let outputs = (result instanceof Array) ? result : [result];

    if (
      pfunction.gapi.stateMutability === 'payable'
      || pfunction.gapi.stateMutability === 'nonpayable'
    ) {
      outputs = PRERECEIPT_TYPE.components.map(comp => {
        if (comp.name === 'etherscan') {
          return getEtherscanTx(deployment.chainid, result.hash);
        }
        if (!result[comp.name]) return 'waiting';
        return result[comp.name];
      });
      this.setState({ outputs });

      const receipt = await result.wait(2);
      console.log('receipt', receipt);

      outputs = RECEIPT_TYPE.components.map(comp => {
        if (comp.name === 'etherscan') {
          return getEtherscanTx(deployment.chainid, receipt.transactionHash);
        }
        return receipt[comp.name];
      });
      this.setState({ outputs });

      return;
    }

    this.setState({ outputs });
  }

  render() {
    const { pfunction } = this.props.item;
    const width = this.props.styles.minWidth - 40;
    const ioStyles = { minWidth: width, width };

    const ioGapiInputs = this.ioGapiInputs(pfunction);
    const ioGapiOutputs = this.ioGapiOutputs(pfunction);

    return (
      <View style={{...this.props.styles, flex: 1, width: this.props.styles.minWidth }}>
        <Content>
          <CardItem style={{ backgroundColor: this.props.pfunctionColor(pfunction.gapi) }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <H1 style={{ paddingRight: 20 }}>{pfunction.gapi.name}</H1>
            </View>
          </CardItem>
          <Card>
            <CardItem header>
              <Text>Inputs</Text>
            </CardItem>
            <CardItem>
              <FunctionIo
                item={ioGapiInputs}
                value={this.state.inputs}
                onValueChange={this.onValueChange}
                styles={ioStyles}
              />
            </CardItem>
            <CardItem header>
              <Text>Outputs</Text>
            </CardItem>
            <CardItem>
              <FunctionIo
                item={ioGapiOutputs}
                readonly={true}
                value={this.state.outputs}
                styles={ioStyles}
              />
            </CardItem>
          </Card>
        </Content>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 5,
          borderTopWidth: 1,
          borderTopColor: '#cccccc',
        }}>
          <Left>
            <Button small rounded style={styles.buttonStyle} onClick={this.props.onInfoClosed} >
              <Icon type='MaterialCommunityIcons' name='close' />
            </Button>
          </Left>
          <Right>
            <Button small rounded style={styles.buttonStyle} onClick={this.onRun} >
              <Icon type='MaterialCommunityIcons' name='play' />
            </Button>
          </Right>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create(
  {
    buttonStyle: {
      backgroundColor: '#cccccc',
    },
  }
)
