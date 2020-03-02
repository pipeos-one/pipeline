import React, { Component } from 'react';
import {
  View,
  Text,
  Textarea,
  Button,
  Icon,
  Left,
  Right,
} from 'native-base';
import { clipboardCopy } from '@pipeos/react-pipeos-components';
import { uploadToFileManager } from '../utils/remix.js';
import styles from './Styles.js';

function TabSubBtn(props) {
  const { icon, callback } = props;
  return (
    <Button
      small rounded
      style={ styles.buttonStyle }
      onClick={ callback }
    >
      <Icon type={ icon.type } name={ icon.name } />
    </Button>
  );
}

const copyIcon = {name: 'content-copy', type: 'MaterialCommunityIcons'};
const uploadIcon = {name: 'upload', type: 'MaterialCommunityIcons'};
const playIcon = {name: 'play', type: 'MaterialCommunityIcons'};

class Pipeoutput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activetab: 'sol',
    }
  }

  render() {
    const { onJsRun, remixClient } = this.props;
    const {
      soliditySource={},
      deploymentArgs=[],
      web3jsSource={},
      graphSource={},
      web3jsSourceFunction,
    } = this.props.data;
    const { activetab } = this.state;

    console.log('Pipeoutput', this.props.data);

    const textareaStyles = {
      minWidth: this.props.styles.minWidth - 5,
      minHeight: this.props.styles.minHeight - 41 - 41,
    }

    let activeViewText;
    let outputActiveTabButtons = [];

    switch(activetab) {
      case 'sol':
        activeViewText = soliditySource.source || '';
        outputActiveTabButtons.push((
          <TabSubBtn
            key={1}
            icon={copyIcon}
            callback={() => clipboardCopy(activeViewText)}
          />
        ));
        outputActiveTabButtons.push((
          <TabSubBtn
            key={2}
            icon={uploadIcon}
            callback={() => uploadToFileManager(remixClient)(activeViewText)}
          />
        ));
        break;
      case 'deploy':
        activeViewText = JSON.stringify(deploymentArgs.map(dep => dep.address)) || '';
        outputActiveTabButtons.push((
          <TabSubBtn
            key={3}
            icon={copyIcon}
            callback={() => clipboardCopy(activeViewText)}
          />
        ));
        break;
      case 'js':
        activeViewText = web3jsSourceFunction(
          web3jsSource.source || '',
          [...new Set(deploymentArgs.map(depl => depl.address))]
            .map(address => `"${address}"`),
        );
        outputActiveTabButtons.push((
          <TabSubBtn
            key={4}
            icon={copyIcon}
            callback={() => clipboardCopy(activeViewText)}
          />
        ));
        outputActiveTabButtons.push((
          <TabSubBtn
            key={5}
            icon={playIcon}
            callback={onJsRun}
          />
        ));
        break;
      case 'graph':
        activeViewText = JSON.stringify(graphSource);
        outputActiveTabButtons.push((
          <TabSubBtn
            key={6}
            icon={copyIcon}
            callback={() => clipboardCopy(activeViewText)}
          />
        ));
        // outputActiveTabButtons.push((
        //   <TabSubBtn
        //     icon={uploadIcon}
        //     callback={() => uploadToFileManager(activeViewText)}
        //   />
        // ));
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

    const tabNames = ['sol', 'deploy', 'js', 'graph'];
    const outputTabButtons = tabNames.map((name, i) => {
      return (
        <Button
          small bordered dark
          key={i}
          onClick={() => this.setState({ activetab: name })}
          style={ styles.tabButtonStyle }
        >
          <Text>{ name }</Text>
        </Button>
      )
    });

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
          <Right>
            <View style={{ flexDirection: "row", flex: 1 }}>{ outputTabButtons }</View>
          </Right>
        </View>
      </View>
    )
  }
}

export default Pipeoutput;
