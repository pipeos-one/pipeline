import React, { Component } from 'react';
import { View } from 'native-base';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css';

const mdCommands = [
  commands.bold, commands.italic, commands.strikethrough, commands.hr, commands.title, commands.divider,
  commands.link, commands.quote, commands.code, commands.divider,
  commands.unorderedListCommand, commands.orderedListCommand, commands.checkedListCommand, commands.divider,
  commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
]

export default class GraphMarkdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markdown: props.value,
    }

    const self = this;

    this.renderers = {
      linkReference: ({ children, language, value }) => {
        const { gapi, gapiValues } = self.props;
        console.log('self', gapi, gapiValues);
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

  render() {
    const { props } = this;
    const { styles={}, preview, onChange } = props;
    const { markdown } = this.state;

    let commands = mdCommands;
    if (preview === 'preview') {
      commands = [];
    }

    return (
      <View style={styles}>
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
