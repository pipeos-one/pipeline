# react-function-call-ui

>

[![NPM](https://img.shields.io/npm/v/@pipeos/react-function-call-ui.svg)](https://www.npmjs.com/package/@pipeos/react-function-call-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @pipeos/react-function-call-ui
```

## Usage

```jsx
import React, { Component } from 'react'

import { FunctionCall } from '@pipeos/react-function-call-ui';

class Example extends Component {
  render () {
    return (
      <FunctionCall
        styles={this.props}
        web3={web3}
        item={item}
        onRun={this.onRun}
        onInfoClosed={this.onInfoClosed}
        pfunctionColor={this.pfunctionColor}
      />
    )
  }
}
```

## License

MIT © [loredanacirstea](https://github.com/loredanacirstea)
