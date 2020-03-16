import React, { Component } from 'react';
import {
  View,
  Picker
} from 'native-base';

export default class ControlledInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vtype: 'inputs',
      selected: props.gapi.inputs[0].name,
    }

    this.onValueChange = this.onValueChange.bind(this);
    this.onVtypeChange = this.onVtypeChange.bind(this);

    this.props.onSelect(this.state.vtype, this.state.selected);
  }

  onVtypeChange(vtype) {
    const selected = this.props.gapi[vtype][0].name;
    this.setState({ vtype, selected });
    this.props.onSelect(vtype, selected);
  }

  onValueChange(selected) {
    const { vtype } = this.state;
    this.setState({ selected });
    this.props.onSelect(vtype, selected);
  }

  render() {
    const { gapi } = this.props;
    const { vtype } = this.state;
    const currentOptions = gapi[vtype].map(io => io.name);

    const options = currentOptions.map((name, i) => {
      return (<Picker.Item key={i} label={name} value={name} />)
    })

    return (
      <View style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
      <Picker
        mode="dropdown"
        style={{ width: 0, marginRight: 0 }}
        selectedValue={ this.state.vtype }
        onValueChange={this.onVtypeChange}
      >
        <Picker.Item key={0} label="inputs" value="inputs" />
        <Picker.Item key={1} label="outputs" value="outputs" />
      </Picker>
      <Picker
        mode="dropdown"
        style={{ width: 0, marginRight: 0 }}
        selectedValue={ this.state.selected }
        onValueChange={this.onValueChange}
      >
        { options }
      </Picker>
      </View>
    )
  }
}
