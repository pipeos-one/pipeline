import React from 'react';
import { StyleSheet } from 'react-native';
import {
  View,
  Right,
  Icon,
  Button,
  Text,
} from 'native-base';
import { PclassList, pfunctionColor } from '@pipeos/react-pipeos-components';

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
          <Button small rounded style={styles.buttonStyle} onClick={() => console.log(treedata)}>
            <Text>{treedata.length}</Text>
            <Icon type="MaterialCommunityIcons" name='import' />
          </Button>
        </Right>
      </View>
    </View>
  )
}

const styles = StyleSheet.create(
  {
    buttonStyle: {
      backgroundColor: '#cccccc',
    },
  },
)
