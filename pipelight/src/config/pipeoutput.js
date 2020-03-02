import { clipboardCopy } from '@pipeos/react-pipeos-components';

export const outputTabs = [
  {
    name: 'sol',
    buttons: [
      {
        icon: {name: 'content-copy', type: 'MaterialCommunityIcons'},
        callback: clipboardCopy,
      },
      {
        icon: {name: 'upload', type: 'MaterialCommunityIcons'},
        callback: () => {},
      }
    ]
  },
  {
    name: 'deploy',
    buttons: [
      {
        icon: {name: 'content-copy', type: 'MaterialCommunityIcons'},
        callback: clipboardCopy,
      },
    ]
  },
  {
    name: 'js',
    buttons: [
      {
        icon: {name: 'content-copy', type: 'MaterialCommunityIcons'},
        callback: clipboardCopy,
      },
      {
        icon: {name: 'play', type: 'MaterialCommunityIcons'},
        callback: () => {},
      }
    ]
  },
  {
    name: 'graph',
    buttons: [
      {
        icon: {name: 'content-copy', type: 'MaterialCommunityIcons'},
        callback: clipboardCopy,
      },
      {
        icon: {name: 'upload', type: 'MaterialCommunityIcons'},
        callback: () => {},
      }
    ]
  },
]
