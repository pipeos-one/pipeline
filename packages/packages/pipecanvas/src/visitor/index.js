import solidityVisitorOptions from './soloptions.js';
import jsVisitorOptions from './jsoptions.js';
import GraphVisitor from './GraphVisitor.js';

const visitorOptions = {
  solidity: solidityVisitorOptions,
  js: jsVisitorOptions,
  graphRender: {
    type: 'visual',
  },
};

export {visitorOptions, GraphVisitor};
