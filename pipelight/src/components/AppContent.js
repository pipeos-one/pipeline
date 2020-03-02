import React, { Component } from 'react';
import { Dimensions, StyleSheet, ScrollView } from 'react-native';
import {
  View,
  Button,
  Icon,
  Text,
  Left,
  Right,
} from 'native-base';
import { ethers } from 'ethers';
import pipecanvas from '@pipeos/pipecanvas';
import { solidityBuilder } from '@pipeos/pipesource';
import { FunctionCall } from '@pipeos/react-function-call-ui';
import { pfunctionColor } from '@pipeos/react-pipeos-components';
import Workspace from './Workspace.js';
import Pipeoutput from './Pipeoutput.js';
import { getPageSize } from '../utils/utils.js';
import { getPipegraphInfo } from '../utils/pipecanvas.js';
import { getWeb3 } from '../utils/utils.js';
import { createRemixClient } from '../utils/remix.js';
import testtreedata from '../utils/fixtures.js';


class AppContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.getWindowDimensions(),
      pageSizes: this.getPageSizes(),
      selectedFunctions: [],
      pipeContext: [],
      canvases: 1,
      activeCanvas: 0,
      pipeGraphs: [],
      graphsSource: [],
      pipeoutput: {},
      piperun: { pfunction: {gapi: {inputs: [], outputs: []}}, deployment: {} },
      treedata: testtreedata,
    }

    this.FOOTER_HEIGHT = 41;
    this.scrollRef = React.createRef();

    this.onContentSizeChange = this.onContentSizeChange.bind(this);
    this.onToggleItem = this.onToggleItem.bind(this);
    this.onClearCanvas = this.onClearCanvas.bind(this);
    this.onAddCanvas = this.onAddCanvas.bind(this);
    this.onGoToPipeoutput = this.onGoToPipeoutput.bind(this);
    this.onGoToPipecanvas = this.onGoToPipecanvas.bind(this);
    this.onGoToPiperun = this.onGoToPiperun.bind(this);
    this.onPiperun = this.onPiperun.bind(this);

    this.loadData = this.loadData.bind(this);

    Dimensions.addEventListener('change', () => {
      this.onContentSizeChange();
    });

    this.setWeb3();
    this.setRemixClient();
  }

  componentDidMount() {
    window.ethers = ethers;
    this.addCanvasGraph(0);
  }

  async setWeb3() {
    this.web3 = await getWeb3();
  }

  async setRemixClient() {
    this.remixClient = await createRemixClient({
      loadChainLensWorkspace: this.loadData,
    });
  }

  loadData(pclasses = []) {
    let treedata = this.state.treedata;

    pclasses.forEach(pclass => {
      const exists = treedata.find(item => item._id === pclass._id);
      if (!exists) treedata.push(pclass);
    });

    this.setState({ treedata });
    return true;
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.canvases < this.state.canvases) {
  //
  //     // this.addCanvasGraph(this.state.canvases - 1);
  //   }
  // }

  getPageSizes(width, height) {
    return {
      canvas: getPageSize(3 / 2, { width, height: height - this.FOOTER_HEIGHT }),
      page: getPageSize(3, { width, height }),
    }
  }

  getWindowDimensions() {
    let wdims = Dimensions.get('window');
    let rootDims = document.getElementById('PipelineRoot').getBoundingClientRect();

    const dims = {
      width: wdims.width || rootDims.width,
      height: wdims.height || rootDims.height,
    }
    return dims;
  }

  addCanvasGraph(activeCanvas) {
    const { width, height } = this.state.pageSizes.canvas;

    const newgraph = pipecanvas(
      this.state.pipeContext[activeCanvas],
      this.state.graphsSource[activeCanvas],
      {
        width,
        height,
        domid: `#draw_canvas${activeCanvas}`,
        bodyColorFunction: pfunctionColor,
      }
    );
    newgraph.onChange(new_gr => {
      const pipeoutput = getPipegraphInfo(
        new_gr,
        this.state.activeCanvas,
        this.state.selectedFunctions,
      );

      const piperun = {
        pfunction: {
          gapi: pipeoutput.web3jsSource.gapi,
          signatureString: 'signatureString',
        },
        deployment: { chainid: this.web3.version.network}
      }
      this.setState({ pipeoutput, piperun });
    });
    newgraph.show();

    const pipeGraphs = this.state.pipeGraphs;
    pipeGraphs[activeCanvas] = newgraph;
    this.setState({ pipeGraphs });
  }

  async onPiperun(inputs) {
    const { pipeoutput } = this.state;
    console.log('pipeoutput', pipeoutput)
    const sourcecode = pipeoutput.web3jsSourceFunction(
      pipeoutput.web3jsSource.source,
      [...new Set(pipeoutput.deploymentArgs.map(depl => depl.address))]
        .map(address => `"${address}"`),
    );
    console.log('sourcecode', sourcecode);
    const runnableSource = `(function(){return ${sourcecode}})()`;
    const runnableFunction = await eval(runnableSource);
    return await runnableFunction(...inputs);
  }

  prepGraphFunction(pfunction, pclass) {
    const newpclass = {
      _id: pclass._id,
      name: pclass.data.name,
      type: 'sol',
      deployment: pclass.pclassInstances[0].data.deployment.address,
    }
    let pfunc = {
      _id: pfunction._id,
      pclassid: pfunction.pclassid,
      pfunction: {
        gapi: pfunction.data.gapi,
        signature: pfunction.data.signature,
        graph: {},
        sources: {},
      },
      timestamp: pfunction.timestamp,
      pclass: newpclass,
    }
    if (pfunc.pclass.type === 'sol') {
      pfunc = solidityBuilder.enrichAbi(pfunc);
    }

    return pfunc;
  }

  onContentSizeChange() {
    const { width, height } = this.getWindowDimensions();
    const pageSizes = this.getPageSizes(width, height);

    this.setState({ width, height, pageSizes });
    this.state.pipeGraphs.forEach(pipegraph => {
      pipegraph.setOptions({
        width: pageSizes.canvas.width,
        height: pageSizes.canvas.height
      });
      pipegraph.show();
    });
  }

  onToggleItem({ pfunction, pclass }) {
    console.log('onToggleItem', pfunction, pclass);
    const pfunc = this.prepGraphFunction(pfunction, pclass);
    const selectedFunctions = this.state.selectedFunctions;
    const pipeContext = this.state.pipeContext;

    if (!selectedFunctions[this.state.activeCanvas]) {
      selectedFunctions[this.state.activeCanvas] = {};
      pipeContext[this.state.activeCanvas] = {};
    }

    selectedFunctions[this.state.activeCanvas][pfunction._id] = Object.assign({}, pfunction, { pclass });
    pipeContext[this.state.activeCanvas][pfunction._id] = pfunc;

    this.setState({ selectedFunctions, pipeContext });
    this.state.pipeGraphs[this.state.activeCanvas].addFunction(pfunc);
  }

  onAddCanvas() {
    let canvases = this.state.canvases;
    canvases += 1;
    this.setState({ canvases });
    // this.addCanvasGraph(canvases - 1);
  }

  onClearCanvas(canvasNo) {
    // TODO
    // console.log('onClearCanvas', canvasNo);
    this.state.pipeGraphs[this.state.activeCanvas].clear();
    this.setState({ selectedFunctions: [] });
  }

  onGoToPipeoutput() {
    const width = this.state.pageSizes.page.width + this.state.pageSizes.canvas.width;
    this.scrollRef.current.scrollTo({x: width, y: 0, animated: true});
  }

  onGoToPipecanvas() {
    const width = this.state.pageSizes.page.width;
    this.scrollRef.current.scrollTo({x: width, y: 0, animated: true});
  }

  onGoToPiperun() {
    this.scrollRef.current.scrollToEnd();
  }

  render() {
    const { pageSizes, canvases, activeCanvas, treedata } = this.state;

    // const canvasTabs = new Array(canvases).fill(0).map((canvas, i) => {
    //   return (
    //     <canvas id={'draw_canvas' + i} key={i}></canvas>
    //   )
    // });

    const activeCanvasEl = (
        <canvas id={'draw_canvas' + activeCanvas}></canvas>
    )

    const canvasTabButtons = Array(canvases).fill(0).map((canvas, i) => {
      return (
        <View key={i} style={{flexDirection: "row", alignItems: "center"}}>
          <Button
            small bordered dark
            onClick={() => this.setState({ activeCanvas: i })}
            style={ styles.tabButtonStyle }
          >
            <Text>{'f_' + i}</Text>
          </Button>

          <Button
            small rounded
            style={styles.buttonStyle}
            onClick={() => this.onClearCanvas(i)}
          >
            <Icon name="close" />
          </Button>
        </View>
      )
    });

    return (
      <ScrollView
        ref={this.scrollRef}
        horizontal={true}
        pagingEnabled={true}
        scrollEnabled={true}
        scrollEventThrottle={100}
        nestedScrollEnabled={true}
        contentContainerStyle={{width: "100%"}}
        onContentSizeChange={this.onContentSizeChange}
      >
        <Workspace
          styles={{ ...this.props.styles, ...pageSizes.page }}
          onToggleItem={this.onToggleItem}
          onGoBack={this.onGoToPipecanvas}
          onRemove={ () => {} }
          treedata={treedata}
        />

        <View style={{...this.props.styles, flex: 1}}>
          <View style={{
            ...pageSizes.canvas,
            flex: 1,
            backgroundColor: "#fafafa"
          }}>
            {activeCanvasEl}
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
              <Button
                small rounded
                style={styles.buttonStyle}
                onClick={this.onAddCanvas}
              >
                <Icon name="add" />
              </Button>
            </Left>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              {canvasTabButtons}
            </View>
            <Right>
              <Button
                small rounded
                style={styles.buttonStyle}
                onClick={this.onGoToPipeoutput}
              >
                <Icon type="MaterialCommunityIcons" name='chevron-right' />
              </Button>
            </Right>
          </View>
        </View>

        <Pipeoutput
          styles={{ ...this.props.styles, ...pageSizes.page }}
          data={this.state.pipeoutput}
          remixClient={this.remixClient}
          goBack={this.onGoToPipecanvas}
          onJsRun={this.onGoToPiperun}
        />
        <FunctionCall
          styles={{ ...this.props.styles, ...pageSizes.page }}
          web3={this.web3}
          item={this.state.piperun}
          onRun={this.onPiperun}
          onInfoClosed={this.onGoToPipeoutput}
          pfunctionColor={pfunctionColor}
        />
      </ScrollView>
    )
  }
}

export default AppContent;

const styles = StyleSheet.create(
  {
    buttonStyle: {
      backgroundColor: '#cccccc',
      marginLeft: 15,
    },
    tabButtonStyle: {
      borderRadius: 10,
      borderWidth: 1,
      textTransform: 'lowercase',
    }
  }
)
