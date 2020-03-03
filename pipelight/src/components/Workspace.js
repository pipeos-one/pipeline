import React from 'react';
import {
  View,
  Right,
  Icon,
  Button,
  Text,
  H2,
} from 'native-base';
import { PclassList, pfunctionColor } from '@pipeos/react-pipeos-components';
import styles from './Styles.js';

function LoadInfo(props) {
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

export default function Workspace(props) {
  const { treedata } = props;

  const buttons = {
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

  const loadInfoStyles = {
    width: props.styles.width,
    height: props.styles.height - 36,
    maxHeight: props.styles.height - 36,
  }
  return (
    <View style={{...props.styles, flex: 1}}>
      {
        treedata.length > 0
        ? <PclassList
          data={treedata}
          buttons={buttons}
          styles={props.styles}
          buttonStyle={styles.buttonStyle}
          pfunctionColor={pfunctionColor}
        />
        : <LoadInfo styles={loadInfoStyles}/>
      }

      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        borderTopWidth: 1,
        borderTopColor: '#cccccc',
      }}>
        <Right>
          <Button small rounded style={styles.buttonStyle} onClick={props.onGoBack}>
            <Icon type="MaterialCommunityIcons" name='chevron-right' />
          </Button>
        </Right>
      </View>
    </View>
  )
}
