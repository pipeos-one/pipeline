import React from 'react';
import {
  View,
  Right,
  Icon,
  Button,
} from 'native-base';
import { PclassList, pfunctionColor } from '@pipeos/react-pipeos-components';
import styles from './Styles.js';

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
  return (
    <View style={{...props.styles, flex: 1}}>
      <PclassList
        data={treedata}
        buttons={buttons}
        styles={props.styles}
        buttonStyle={styles.buttonStyle}
        pfunctionColor={pfunctionColor}
      />

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
