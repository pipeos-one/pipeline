import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Icon,
  Text,
  Input,
  Label,
  Item,
  Accordion,
} from 'native-base';

const nonStringTypes = ['int', 'float', 'tuple', 'boolean'];
const checkNonString = itemType => nonStringTypes.find(typ => itemType.includes(typ));
const decodeValueString = value => value || '';
const encodeValueString = value => value || '';
const decodeValueNonString = value => value ? JSON.parse(value) : null;
const encodeValueNonString = value => value ? JSON.stringify(value) : '';

function IoUI(props) {
  const { item } = props;
  const isNonString = checkNonString(item.type);
  let decodeValue, encodeValue;

  if (isNonString) {
    decodeValue = decodeValueNonString;
    encodeValue = encodeValueNonString;
  } else {
    decodeValue = decodeValueString;
    encodeValue = encodeValueString;
  }

  if (item.type === 'link') {
    return (
      <Text
        accessibilityRole='link'
        href={props.value}
        style={{color: 'blue'}}
        target='_blank'
      >
        {props.value}
      </Text>
    )
  }

  return (
    <Input
      value={encodeValue(props.value)}
      onChangeText={(text) => props.onValueChange(decodeValue(text))}
      styles={props.styles}
      disabled={props.readonly}
    />
  )
}

export default class FunctionIo extends Component {
  // static propTypes = {
  //   text: PropTypes.string
  // }

  constructor(props) {
    super(props);
    this.state = {
      componentsOpened: false,
      componentValues: props.value,
    }

    // this.onValueChange = this.onValueChange.bind(this);
    this.onComponentsValueChange = this.onComponentsValueChange.bind(this);
    this.onOpenComponents = this.onOpenComponents.bind(this);

    this._renderHeader = this._renderHeader.bind(this);
    this._renderContent = this._renderContent.bind(this);
  }

  getLabel(item) {
    return item.label || `${item.name}:${item.type}`;
  }

  onOpenComponents() {
    this.setState({ componentsOpened: true });
  }

  onComponentsValueChange(value, i) {
    const componentValues = this.state.componentValues;
    componentValues[i] = value;
    this.setState({ componentValues });
    this.props.onValueChange(componentValues);
  }

  _renderHeader(item, expanded) {
    const label = this.getLabel(item);
    return (
      <View
        style={{
          padding: 5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fafafa',
          ...this.props.styles,
        }}
      >
        <View style={{ ...this.props.styles, flexDirection: 'row' }}>
          {expanded
            ? <Icon style={{ fontSize: 18 }} name='remove-circle' />
            : <Icon style={{ fontSize: 18 }} name='add-circle' />
          }
          <Item stackedLabel style={{ ...this.props.styles, maxWidth: this.props.styles.minWidth }}>
            <Label>{label}</Label>
            <IoUI
              item={item}
              value={this.props.value}
              onValueChange={this.props.onValueChange}
              styles={this.props.styles}
              readonly={this.props.readonly}
            />
          </Item>
        </View>
      </View>
    )
  }

  _renderContent(item) {
    return (item.components || []).map((subio, i) => {
      return (
        <FunctionIo
          key={i}
          styles={this.props.styles}
          item={subio}
          value={this.props.value[i]}
          onValueChange={(value) => this.onComponentsValueChange(value, i)}
          readonly={this.props.readonly}
        />
      );
    });
  }

  render() {
    const { item, styles, readonly } = this.props;
    if (!item) return (<Text>---</Text>);

    const label = this.getLabel(item);
    return (
      <View style={{ ...styles, flexDirection: 'row', alignItems: 'center'}}>
        {!item.components || item.components.length === 0
          ? <Item stackedLabel style={{ width: '100%' }}>
            <Label>{label}</Label>
            <IoUI
              styles={styles}
              item={item}
              value={this.props.value}
              onValueChange={this.props.onValueChange}
              readonly={readonly}
            />
          </Item>
          : <Accordion
            dataArray={[item]}
            expanded={0}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            contentStyle={{ ...styles, flex: 1, backgroundColor: '#ffffff' }}
          />
        }
      </View>
    );
  }
}
