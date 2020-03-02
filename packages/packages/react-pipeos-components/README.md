# @pipeos/react-pipeos-components

>

[![NPM](https://img.shields.io/npm/v/@pipeos/react-pipeos-components.svg)](https://www.npmjs.com/package/@pipeos/react-pipeos-components) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @pipeos/react-pipeos-components
```

## Usage

```jsx
import React, { Component } from 'react'

import PclassList from '@pipeos/react-pipeos-components'

class Example extends Component {
  render () {
    const buttons = {
      header: [],
      contentItem: [
        {
          callback: () => {},
          icon: {
            type: 'MaterialCommunityIcons',
            name: 'import',
          }
        }
      ],
    }

    return (
      <PclassList
        data={treedata}
        buttons={buttons}
        styles={props.styles}
        pfunctionColor={this.pfunctionColor}
      />
    )
  }
}
```

## License

MIT © [loredanacirstea](https://github.com/loredanacirstea)
