import React, { Component } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
  View,
  Accordion,
  List,
  ListItem,
  Left,
  Right,
  Icon,
  Text,
  Button,
  Thumbnail,
} from 'native-base';
import { pfunctionColor as pfunctionColorDefault } from './utils.js';

export default class PclassList extends Component {
  constructor(props) {
    super(props);

    this.buttonStyle = props.buttonStyle || styles.buttonStyle;
    this.buttonOffset = 52;

    this._renderHeader = this._renderHeader.bind(this);
    this._renderContent = this._renderContent.bind(this);
    this._renderListItem = this._renderListItem.bind(this);
  }

  _renderHeader(item, expanded) {
    const headerButtons = this.props.buttons.header.map((btn, i) => {
      return (
        <Button
          small rounded
          style={this.buttonStyle}
          key={i}
          onClick={() => btn.callback(item)}
        >
          <Icon type={btn.icon.type} name={btn.icon.name} />
        </Button>
      )
    });
    const btnOffset = headerButtons.length * this.buttonOffset + 110;

    return (
      <View
        style={{
          padding: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa'
        }}
      >

        <View style={{flexDirection: 'row'}}>
          {expanded
            ? <Icon style={{ fontSize: 18 }} name='remove-circle' />
            : <Icon style={{ fontSize: 18 }} name='add-circle' />
          }
          <Text
            style={{ fontFamily: null, fontWeight: '400', paddingLeft: 10, maxWidth: this.props.styles.minWidth - btnOffset }}
          >
            {item.data.name}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          {headerButtons}
        </View>
      </View>
    );
  }

  _renderContent(item) {
    let { pfunctionColor } = this.props;
    pfunctionColor = pfunctionColor || pfunctionColorDefault;

    const pfunctions = [];
    (item.pfunctions || []).forEach(pfunction => {
      if (!pfunction.data.name) return;

      let signature = pfunction.data.signatureString;
      if (
        pfunction.data.gapi.outputs
        && pfunction.data.gapi.outputs.length > 0
      ) {
        signature += `->(${
          pfunction.data.gapi.outputs
            .map(out => out.type)
            .join(',')
        })`;
      }

      const contentButtons = this.props.buttons.contentItem.map((btn, i) => {
        return (
          <Button
            small rounded
            style={this.buttonStyle}
            key={i}
            onClick={() => btn.callback({ pfunction, pclass: item })}
          >
            <Icon type={btn.icon.type} name={btn.icon.name} />
          </Button>
        )
      });

      const btnOffset = contentButtons.length * this.buttonOffset + 110;

      pfunctions.push((
        <ListItem key={pfunction._id} style={{ backgroundColor: pfunctionColor(pfunction.data.gapi) }}>
          <Left>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {pfunction.data.gapi.type === 'event'
                ? <Thumbnail
                  source={{ uri: '/event.png' }}
                  style={{ height: 15, width: 15, borderRadius: 5}}
                />
                : <Thumbnail
                  source={{ uri: '/lambda.png' }}
                  style={{ height: 15, width: 15, borderRadius: 5}}
                />
              }
              <Text
                style={{ fontFamily: null, paddingLeft: 10, maxWidth: this.props.styles.minWidth - btnOffset}}
              >{signature}</Text>
            </View>
          </Left>
          <Right>
            <View style={{flexDirection: 'row'}}>
              {contentButtons}
            </View>
          </Right>
        </ListItem>
      ));
    });

    return (
      <List style={{ paddingLeft: 15 }}>{pfunctions}</List>
    )
  }

  _renderListItem({ item, index, separators }) {
    return (
      <Accordion
        dataArray={[item]}
        keyExtractor={item => item._id}
        renderHeader={this._renderHeader}
        renderContent={this._renderContent}
        contentStyle={{ flex: 1, backgroundColor: '#ffffff' }}
      />
    );
  }

  render() {
    const { data: dataArray } = this.props;

    return (
      <FlatList
        data={dataArray}
        keyExtractor={item => item._id}
        renderItem={this._renderListItem}

        scrollEnabled={true}
        scrollEventThrottle={300}

        contentStyle={{ flex: 1, backgroundColor: '#ffffff' }}
      />
    );
  }
}


const styles = StyleSheet.create(
  {
    buttonStyle: {
      backgroundColor: '#cccccc',
      marginLeft: 10,
    },
  }
)
