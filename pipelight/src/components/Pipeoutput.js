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

const copyIcon = {name: 'content-copy', type: 'MaterialCommunityIcons'};
const uploadIcon = {name: 'upload', type: 'MaterialCommunityIcons'};
const playIcon = {name: 'play', type: 'MaterialCommunityIcons'};
const saveIcon = {name: 'content-save', type: 'MaterialCommunityIcons'};

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

function GraphDetails(props) {
  return (
    <View style={{   ...props.styles }}>
      <Textarea
        disabled
        bordered={true}
        value={ JSON.stringify(props.interpreterGraph || {}) }
        style={{ ...props.styles, height: props.styles.height }}
      />
    </View>
  )
}

class Pipeoutput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activetab: 'graph',
    }
  }

  render() {
    const {
      onJsRun,
      remixClient,
      onGraphSave,
      onRunInterpreter,
    } = this.props;
    const {
      soliditySource,
      deploymentArgs=[],
      web3jsSource,
      graphSource={},
      interpreterGraph,
    } = this.props.data;
    const { activetab } = this.state;

    // console.log('Pipeoutput', this.props.data);

    let textareaStyles = {
      minWidth: this.props.styles.minWidth - 5,
      minHeight: this.props.styles.minHeight - 41 - 41,
    }

    let activeViewText;
    let outputActiveTabButtons = [];

    switch(activetab) {
      case 'sol':
        activeViewText = soliditySource || '';
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
        activeViewText = web3jsSource;
        // activeViewText = web3jsSourceFunction ? web3jsSourceFunction(
        //   web3jsSource.source || '',
        //   [...new Set(deploymentArgs.map(depl => depl.address))]
        //     .map(address => `"${address}"`),
        // ): '';
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
        textareaStyles.minHeight = textareaStyles.minHeight / 2;
        // outputActiveTabButtons.push((
        //   <TabSubBtn
        //     key={6}
        //     icon={copyIcon}
        //     callback={() => clipboardCopy(activeViewText)}
        //   />
        // ));
        outputActiveTabButtons.push((
          <TabSubBtn
            key={6}
            icon={saveIcon}
            callback={onGraphSave}
          />
        ));
        outputActiveTabButtons.push((
          <TabSubBtn
            key={7}
            icon={{ type: 'MaterialCommunityIcons', name: 'chevron-right' }}
            callback={onRunInterpreter}
          />
        ));
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

    let graphDetails = (<></>);
    if (activetab === 'graph') {
      const styles = {width: textareaStyles.minWidth, height: textareaStyles.minHeight};
      const { pipegraph } = this.props.data;
      graphDetails = (
        <GraphDetails
          styles={styles}
          pipegraph={pipegraph}
          interpreterGraph={interpreterGraph}
          onGraphSave={onGraphSave}
        />
      )
    }

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
        { graphDetails }
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
