import React, { Component } from 'react';
import {
  View,
  Right,
  Left,
  Icon,
  Button,
  Text,
  H2,
} from 'native-base';
import { PclassList, pfunctionColor } from '@pipeos/react-pipeos-components';
import styles from './Styles.js';

function EmptyContractsInfo(props) {
  return (
    <View style={props.styles}>
      <H2>Load contracts from ChainLens:</H2>
      <br />
      <Text>- activate ChainLens from the PluginManager menu</Text>
      <Text>- load contracts in the workspace on the right</Text>
      <Text>- select Pipeline and click on the bottom export button</Text>
    </View>
  )
}

function EmptyGraphsInfo(props) {
  return (
    <View style={props.styles}>
      <H2>No graphs found</H2>
    </View>
  )
}

export default class Workspace extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activetab: 'contracts',
    }
  }

  render() {
    const { props } = this;
    const { treedata, graphdata } = props;
    const { activetab } = this.state;

    const contractButtons = {
      header: [],
      contentItem: [
        {
          callback: props.onToggleItem,
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'import',
          }
        }
      ],
    }
    const graphButtons = {
      header: [],
      contentItem: [
        {
          callback: props.onGraphLoad,
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'eye',
          }
        },
        {
          callback: props.onGraphNodeItem,
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'import',
          }
        }
      ],
    }

    const emptyInfoStyles = {
      width: props.styles.width,
      height: props.styles.height - 36,
      maxHeight: props.styles.height - 36,
    }

    const treedataWithIcons = treedata.map(item => {
      item.icons = (item.metadata.languages || item.metadata.categories).map(lang => {
        return {uri: `/${lang}_type.svg`};
      });
      return item;
    });

    const tabButtons = [];
    tabButtons.push((
      <Button
        small bordered dark
        key={1}
        onClick={() => this.setState({ activetab: 'contracts' })}
        style={ styles.tabButtonStyle }
      >
        <Text>contracts</Text>
      </Button>
    ));
    tabButtons.push((
      <Button
        small bordered dark
        key={0}
        onClick={() => this.setState({ activetab: 'graphs' })}
        style={ styles.tabButtonStyle }
      >
        <Text>graphs</Text>
      </Button>
    ));

    let mainView;
    if (activetab === 'graphs') {
      mainView = graphdata.length > 0
        ? <PclassList
            data={graphdata}
            buttons={graphButtons}
            styles={props.styles}
            buttonStyle={styles.buttonStyle}
            pfunctionColor={pfunctionColor}
          />
        : <EmptyGraphsInfo styles={emptyInfoStyles}/>
    } else {
      mainView = treedata.length > 0
        ? <PclassList
            data={treedataWithIcons}
            buttons={contractButtons}
            styles={props.styles}
            buttonStyle={styles.buttonStyle}
            pfunctionColor={pfunctionColor}
          />
        : <EmptyContractsInfo styles={emptyInfoStyles}/>
    }

    return (
      <View style={{...props.styles, flex: 1}}>
        { mainView }
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 5,
          borderTopWidth: 1,
          borderTopColor: '#cccccc',
        }}>
          <Left>
            <View style={{ flexDirection: "row", flex: 1 }}>{ tabButtons }</View>
          </Left>
          <Right>
            <Button small rounded style={styles.buttonStyle} onClick={props.onGoBack}>
              <Icon type="MaterialCommunityIcons" name='chevron-right' />
            </Button>
          </Right>
        </View>
      </View>
    )
  }
}
