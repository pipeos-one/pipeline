import React, { Component } from 'react';
import { View } from 'native-base';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css';

import ControlledInput from './ControlledInput.js';

export default class GraphMarkdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: props.value,
      controlledInput: null,
    }

    this.onSelect = this.onSelect.bind(this);

    const self = this;

    this.addControlledInput = {
      name: 'addControlledInput',
      keyCommand: 'addControlledInput',
      buttonProps: { 'aria-label': 'Add input/output' },
      icon: (
        <svg height="12" width="12" id="svg839" enable-background="new 0 0 512 512" viewBox="0 0 12 12" y="0px" x="0px" >
          <defs id="defs843" />
          <path
             fill="currentColor"
             id="path833"
             d="M 3.8375356,4.8588494 2.996627,5.6995828 5.9999218,8.7029305 9.003234,5.6995828 8.1623254,4.8588494 6.6005633,6.4206119 V 0.59406937 H 5.3993152 V 6.3903703 Z M 11.405922,10.204683 V 1.7953873 c 0,-0.6608263 -0.540596,-1.20124793 -1.201248,-1.20124793 H 7.8020036 V 1.7953873 H 10.204587 V 10.204683 H 1.7952924 V 1.7953873 H 4.1979799 V 0.59413937 H 1.7953274 c -0.660828,0 -1.20124904,0.54059663 -1.20124904,1.20124793 v 8.4092957 c 0,0.660826 0.54059604,1.201248 1.20124904,1.201248 h 8.4092946 c 0.660826,0 1.201248,-0.540597 1.201248,-1.201248 z"
          />
        </svg>
      ),
      execute: (state, api) => {
        const { controlledInput } = this.state;
        if (!controlledInput) return;

        let addition = `**[${controlledInput}]**`;
        let modifyText = `${state.selectedText || ''}${addition}`;
        api.replaceSelection(modifyText);
      },
    };

    this.mdCommands = [
      commands.bold, commands.italic, commands.strikethrough, commands.hr, commands.title, commands.divider,
      commands.link, commands.quote, commands.code, commands.divider,
      commands.unorderedListCommand, commands.orderedListCommand, commands.checkedListCommand, commands.divider,
      commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
      this.addControlledInput,
    ]

    this.renderers = {
      linkReference: ({ children, language, value }) => {
        const { gapi, gapiValues } = self.props;
        const linkrefvalue = children[0].props.value;

        if (!gapiValues) return children;
        const gapiValuesParsed = JSON.parse(gapiValues);

        const inputIndex = gapi.inputs.findIndex(io => io.name === linkrefvalue)
        if (inputIndex > -1) {
          const value = JSON.stringify(gapiValuesParsed.inputs[inputIndex]);
          const html = `<span>${value}</span>`;
          return (<code dangerouslySetInnerHTML={{ __html: html }} />);
        }

        const outputIndex = gapi.outputs.findIndex(io => io.name === linkrefvalue)
        if (outputIndex > -1) {
          const value = JSON.stringify(gapiValuesParsed.outputs[outputIndex]);
          const html = `<span>${value}</span>`;
          return (<code dangerouslySetInnerHTML={{ __html: html }} />);
        }

        return children;
      },
    }
  }

  componentDidMount() {
    const { preview } = this.props;
    this.fixPreview(preview);
  }

  componentDidUpdate(prevProps) {
    const { preview } = this.props;
    this.fixPreview(preview);

    let markdown;
    if (this.props.value !== prevProps.value) {
      markdown = this.props.value;
      this.setState({ markdown });
    }

    const { gapi, gapiValues } = this.props;

    if (gapiValues && prevProps.gapiValues !== gapiValues) {
      let value = markdown || this.props.value;
      const gapiValuesParsed = JSON.parse(gapiValues);

      gapiValuesParsed.inputs.forEach((ioval, i) => {
        const toReplace = `[${gapi.inputs[i].name}]`;
        value = value.replace(toReplace, JSON.stringify(ioval));
      });
      gapiValuesParsed.outputs.forEach((ioval, i) => {
        const toReplace = `[${gapi.outputs[i].name}]`;
        value = value.replace(toReplace, JSON.stringify(ioval));
      });

      this.setState({ markdown: value });
    }
  }

  fixPreview(preview) {
    if (preview === 'preview') {
      document.getElementsByClassName('w-md-editor-input')[0].style.width = '0px';
      document.getElementsByClassName('w-md-editor-preview')[0].style.width = '100%';
    }
  }

  onSelect(iotype, controlledInput) {
    this.setState({ controlledInput });
  }

  render() {
    const { props } = this;
    const { styles={}, preview, onChange, gapi } = props;
    const { markdown } = this.state;

    let commands = this.mdCommands;
    if (preview === 'preview') {
      commands = [];
    }

    return (
      <View style={styles}>
        {preview !== 'preview'
          ? <ControlledInput
              gapi={gapi}
              onSelect={this.onSelect}
            />
          : <></>
        }
        <MDEditor
          value={markdown}
          height={styles.height}
          onChange={onChange}
          commands={commands}
          previewOptions={{ renderers: this.renderers, includeNodeIndex: true, sourcePos: true, rawSourcePos: true }}
        />
      </View>
    )
  }
}
