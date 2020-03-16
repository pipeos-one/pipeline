import React, { Component } from 'react';
import {
  View,
  Item,
  Text,
  Button,
  Icon,
  Input,
  Left,
  Right,
} from 'native-base';
import styles from './Styles.js';
import GraphMarkdown from './markdown/GraphMarkdown.js';

export default class GraphSave extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: 'GraphName',
      namespace: 'test',
      markdown: props.markdown,
      savedGraph: null,
      link: null,
      saving: false,
    };

    this.onChangeNamespace = this.onChangeNamespace.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMarkdown = this.onChangeMarkdown.bind(this);
    this.onGraphSave = this.onGraphSave.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.markdown !== prevProps.markdown) {
      this.setState({ markdown: this.props.markdown});
    }
  }

  onChangeName(name) {
    this.setState({ name });
  }

  onChangeNamespace(namespace) {
    this.setState({ namespace });
  }

  onChangeMarkdown(markdown) {
    this.setState({ markdown });
  }

  async onGraphSave() {
    const { name, namespace, markdown } = this.state;
    if (!name || !namespace) {
      throw new Error('Graph needs a name & namespace');
    }

    this.setState({ saving: true });
    const { savedGraph, link } = await this.props.onGraphSave({ name, namespace, markdown });
    this.setState({ savedGraph, link, saving: false });
  }

  render() {
    const { props } = this;
    const { savedGraph, link, saving, markdown } = this.state;
    const editorHeight = props.styles.height - 100;

    const afterSave = savedGraph
      ? (
          <Item>
            <View style={{
              flex: 1,
              alignItems: "center",
            }}>
              <Text>Graph id: {savedGraph.data.onchainid}</Text>
              <Text
                accessibilityRole='link'
                href={link}
                style={{color: 'blue'}}
                target='_blank'
              >
                {link}
              </Text>
            </View>
          </Item>
        )
      : (saving ? <Text>Saving...</Text> : <></>)

    return (
      <View style={{ ...props.styles, flex: 1 }}>
        <View style={{ ...props.styles, flex: 1 }}>
          <Item>
            <Input
              style={{
                width: props.styles.width / 2 - 35,
                borderColor: '#a8b3bc',
                borderStyle: 'solid',
                borderRightWidth: '1px',
                marginRight: '1px',
              }}
              placeholder='Namespace'
              onChangeText={ text => this.onChangeNamespace(text) }
            />
            <Input
              style={{
                width: props.styles.width / 2 - 35,
                borderColor: '#a8b3bc',
                borderStyle: 'solid',
                borderLeftWidth: '1px',
              }}
              placeholder='Graph Name'
              onChangeText={ text => this.onChangeName(text) }
            />
          </Item>
          <GraphMarkdown
            value={markdown}
            styles={{ height: editorHeight }}
            onChange={this.onChangeMarkdown}
          />
          {afterSave}
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
            <Button small rounded style={styles.buttonStyle} onClick={props.onGoBack}>
              <Icon type="MaterialCommunityIcons" name='chevron-left' />
            </Button>
          </Left>
          <Right>
            <Button
              small rounded
              style={ styles.buttonStyle }
              onClick={ this.onGraphSave }
            >
              <Icon type="MaterialCommunityIcons" name='check-bold' />
            </Button>
          </Right>
        </View>
      </View>
    );
  }
}
