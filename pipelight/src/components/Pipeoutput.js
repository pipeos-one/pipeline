import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Text,
  Textarea,
  Button,
  Icon,
  Left,
  Right,
} from 'native-base';
import { outputTabs } from '../config/pipeoutput';

class Pipeoutput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activetab: 'sol',
    }
  }

  render() {
    const { onJsRun } = this.props;
    const {
      soliditySource={},
      deploymentArgs=[],
      web3jsSource={},
      graphSource={},
      web3jsSourceFunction,
    } = this.props.data;
    console.log('Pipeoutput', this.props.data);

    const { activetab } = this.state;

    const textareaStyles = {
      minWidth: this.props.styles.minWidth - 5,
      minHeight: this.props.styles.minHeight - 41 - 41,
    }

    let activeViewText;

    switch(this.state.activetab) {
      case 'sol':
        activeViewText = soliditySource.source || '';
        break;
      case 'deploy':
        activeViewText = JSON.stringify(deploymentArgs.map(dep => dep.address)) || '';
        break;
      case 'js':
        activeViewText = web3jsSource.source || '';
        break;
      case 'graph':
        activeViewText = JSON.stringify(graphSource);
        break;
      default:
        activeViewText = '';
        break;
    }

    const activeView = (
      <Textarea
        disabled
        bordered={true}
        value={activeViewText}
        style={{...textareaStyles}}
      />
    )

    // Run js
    outputTabs[2].buttons[1].callback = () => onJsRun('source');

    const outputTabButtons = outputTabs.map((tab, i) => {
      return (
        <Button
          small bordered dark
          key={i}
          onClick={() => this.setState({ activetab: tab.name })}
        >
          <Text>{ tab.name }</Text>
        </Button>
      )
    });

    const outputActiveTabButtons = outputTabs.find(tab => tab.name === activetab).buttons.map((btn, i) => {
      return (
        <Button
          small rounded
          style={ styles.buttonStyle }
          key={i}
          onClick={ btn.callback }
        >
          <Icon type={ btn.icon.type } name={ btn.icon.name } />
        </Button>
      );
    })

    return (
      <View style={{ ...this.props.styles, flex: 1 }}>
        { activeView }
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          borderTopWidth: 1,
          borderTopColor: '#cccccc',
        }}>
          { outputActiveTabButtons }
        </View>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          borderTopWidth: 1,
          borderTopColor: '#cccccc',
        }}>
          <Left>
            <Button
              small rounded
              style={ styles.buttonStyle }
              onClick={ this.props.goBack }
            >
              <Icon type="MaterialCommunityIcons" name='chevron-left' />
            </Button>
          </Left>
          { outputTabButtons }
        </View>
      </View>
    )
  }
}

export default Pipeoutput;

const styles = StyleSheet.create(
  {
    buttonStyle: {
      backgroundColor: '#cccccc',
      marginLeft: 15,
    },
  }
)
