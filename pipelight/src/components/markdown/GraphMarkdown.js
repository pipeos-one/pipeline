import React, { Component } from 'react';
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

    // MDEditor cannot be rendered with preview === 'preview' directly
    // But changing state after mounting works
    this.state = {
      preview: 'live',
    }
  }
  componentDidMount() {
    const { preview } = this.props;
    this.setState({ preview })
  }
  render() {
    const { props } = this;
    const { value, styles={}, preview, onChange } = props;
    const { preview: statePreview } = this.state;

    let commands = mdCommands;
    if (preview === 'preview') {
      commands = [];
    }

    return (
      <MDEditor
        value={value}
        height={styles.height}
        onChange={onChange}
        commands={commands}
        preview={statePreview}
      />
    )
  }
}
