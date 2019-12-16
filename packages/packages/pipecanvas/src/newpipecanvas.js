/* eslint-disable */

import pipejs from './newpipe';
const S = require ('sanctuary');
const d3 = require("d3");
window.S = S;
window.d3 = d3;

let DEFAULT_GRAPH = {n: {}, e: [], r: []}
const DEFAULT_TARGETS = {
  for_click: {},
  for_click_edge: {},
  for_drag: {},
  end_drag:{},
  for_drop: {}
}
let DEFAULT_OPTIONS = {
  width: 600,
  height: 600,
  domid: '#pipegraph',
  types: {
    "number": {color: "#355"},
    "number[]": {color: "#463"},
    "function": {color: "#562"},
    "string": {color: "#662"},
  }
}

let DEFAULT_CONTEXT = {
  "5bc59e192817116e84bdd831": {
    "_id":"5bc59e192817116e84bdd831","pclassid":"5dbaa731f18ff7488e9b108b","pfunction":{"signature":"id(x)","gapi":{"constant":true,"inputs":[],"name":"id","outputs":[{"type":"string","name":"id"}],"payable":false,"stateMutability":"pure","type":"function"},
    "graph":{},
    "sources":{"javascript.rust":"() => rust.id()","javascript":"(x)=>x"}},
    // "categories":{"languages":["javascript.rust","javascript"]},
    "timestamp":"2019-11-06T19:22:53.807Z",
    pclass: {
      _id: "0x0",
      name: "unknown",
      type: 'unknown',
    }
  }
}


function pipecanvas(initialcontext = {}, pipegraph = {}, options={}) {
  if (!pipegraph || !(pipegraph instanceof Object) || Object.keys(pipegraph).length === 0) {
    pipegraph = Object.assign({}, DEFAULT_GRAPH);
  }

  function typeOptions(type) {
    return pipeopts.types[type] ? pipeopts.types[type] : {color: "#223"};
  }

  let fcontext = Object.assign({}, DEFAULT_CONTEXT, initialcontext);
  if (!pipegraph || !(pipegraph instanceof Object) || Object.keys(pipegraph).length === 0) {
    pipegraph = Object.assign({}, DEFAULT_GRAPH);
  }

  let pipeopts = Object.assign({}, DEFAULT_OPTIONS, options);
  let graph1 = {}
  let current_stage = ({settings:{transform:{}}})
  let current_edge = ({pos:[], target: false})

  let targets = JSON.parse(JSON.stringify(DEFAULT_TARGETS));
  let pipe1 = new pipejs();
  pipe1.indexed_func = fcontext;

  current_stage.settings.r_graph = runnable(pipegraph);

  function runnable(graph) {
    console.log('runnable pipe1', pipe1);
    console.log('runnable fcontext', fcontext);
    console.log('runnable graph', graph);
    let rich  = pipe1.enrich_graph (fcontext) (graph)
    console.log('runnable rich', rich)
    let runtime = pipe1.make_runtime (fcontext)(rich)
    current_stage.settings.r_graph = runtime
    return runtime
  }

  function dstart() {
    let coords= JSON.parse(JSON.stringify(d3.mouse(this)));
    // d3.event.x, d3.event.y
    const coordp = {x: coords[0], y: coords[1]};
    let done = false
    // console.log("srttt", coords)
    // console.log('targets', targets)
    for (let key in targets.for_click_edge) {
      let value = targets.for_click_edge[key]
      if ( value.l <= coordp.x && value.r >= coordp.x) {
        if ( value.t <= coordp.y && value.b >= coordp.y) {
          console.log("edge-click", value, key)
          let new_gr = JSON.parse(JSON.stringify(current_stage.settings.r_graph.rich_graph.init))
            new_gr = pipe1.remove_edge (new_gr) (JSON.parse("["+key+"]"))
            new_gr = runnable(new_gr)
            // console.log( "dstart new_gryyy", new_gr)
            current_stage.settings.r_graph = new_gr
            done = true;
        }
      }
    }
    if (done) return ;

    for (let key in targets.for_click) {
      let value = targets.for_click[key]
      // console.log("sttt", value, coordp.x, coordp.y);
      if ( value.l <= coordp.x && value.r >= coordp.x) {
        if ( value.t <= coordp.y && value.b >= coordp.y) {
          //mutable current_edge = {pos:[coords[0], coords[1], coords[0], coords[1]]}
          // console.log("starttt-click", value, key)
          let key1 = JSON.parse("["+key+"]")
          if (key1[1] ===1) {
            console.log("clicked node", value, key1)
            //return change_mode(key1[0]);
          }
          if (key1[1] ===0) {
            //console.log( "new_gr",current_stage)
            let new_gr = JSON.parse(JSON.stringify(current_stage.settings.r_graph.rich_graph.init))
            new_gr = pipe1.remove_node (new_gr) (key1[0])
            new_gr = runnable(new_gr)
            // console.log("dstart new_gryyy", new_gr)
            current_stage.settings.r_graph = new_gr
            graph1 = new_gr
            done = true
          }
        }
      }
    }
    if (done) return

    for (let key in targets.for_drag) {
      let value = targets.for_drag[key]
      if ( value.l <= coordp.x && value.r >= coordp.x) {
        if ( value.t <= coordp.y && value.b >= coordp.y) {
          current_edge.pos = [(value.r+value.l)/2, (value.b+value.t)/2, coords[0], coords[1]]
          current_edge.source = value.port
          // console.log("dstart starttt-edge", value)
        }
      }
    }
    // console.log("start", d3.event, coords)
  }

  function change_mode(key){
    console.log(key)
    for (let x=0; x<1;x=x+1/30){
      //let transform = current_stage.settings.transform
      console.log(x)
      current_stage.settings.transform = {i:key,  f:x}
      graph_show(current_stage.settings.ctx, current_stage.settings.width, current_stage.settings.height, current_stage.settings.nodes, current_stage.settings.edges, current_stage.settings.matrix, current_stage.settings.transform, current_stage.settings.r_graph)
    }
  }

  function ddrag(e){
    let coords= d3.mouse(this);
    if (current_edge.pos.length === 4){
      let co = JSON.parse(JSON.stringify(current_edge.pos))
      graph_show(current_stage.settings.ctx, current_stage.settings.width, current_stage.settings.height, current_stage.settings.nodes, current_stage.settings.edges, current_stage.settings.matrix, current_stage.settings.transform, current_stage.settings.r_graph)

          let nearest = nearestf(coords)
          if (nearest){
            // console.log("ddrag neeear", nearest)
              current_edge.pos = [current_edge.pos[0], current_edge.pos[1], nearest.x, nearest.y]
              current_edge.target = nearest
          } else {
              // console.log('ddrag', nearest)
              current_edge.pos = [co[0], co[1], coords[0], coords[1]]
              current_edge.target = false
          }
      drawExactArrow(current_stage.settings.ctx, current_edge.pos[0], current_edge.pos[1], current_edge.pos[2], current_edge.pos[3], current_edge.source.type, 1)
      // console.log('ddrag current_edge', current_edge)
    }
  }

  function nearestf(pos) {
      let nearest = false, dx,dy,d2,d1, acc
      for (let rec in targets.end_drag){
        // console.log('nearestf', current_edge.source.type, targets.end_drag[rec], rec, current_stage.settings.r_graph.rich_graph.n[targets.end_drag[rec].port.i], targets.end_drag[rec].port.i)

          if (current_edge.source.type === targets.end_drag[rec].port.type &&
              current_stage.settings.r_graph.rich_graph.n[targets.end_drag[rec].port.i].in[targets.end_drag[rec].port.port][0] >2999) {
              acc = nearest? nearest : targets.end_drag[rec]

              d1 = dist(acc, pos)
              // console.log('nearestf', targets.end_drag[rec], pos)
              d2 = dist(targets.end_drag[rec], pos)
              // console.log('nearestf', d1,d2)
              if (d1 >= d2) {
                  if (d2 < 30000){
                      nearest = targets.end_drag[rec]
                  } else {
                      nearest = false
                      // console.log('nearestf', d2)
                  }
              }
          }
      }
      return nearest
  }

  function dist( xy, vec){
      let dx,dy,d2
      dx = xy.x - vec[0]
      dy = xy.y -  vec[1]
      d2 = dx*dx +dy*dy
      return d2
  }

  function dend(){
    // console.log("dend", d3.event, d3.mouse,current_edge)
    let new_gr;
    if (current_edge.target !== false) {
      // console.log("dend:   j . ", current_edge)
      if (current_edge.source.i > 2999) {
        new_gr = add_edge_to_input(current_edge)
      } else {
        new_gr = JSON.parse(JSON.stringify(current_stage.settings.r_graph.rich_graph.init))
        new_gr = pipe1.add_edge (new_gr) ([current_edge.source.i, current_edge.source.port, current_edge.target.port.i, current_edge.target.port.port] )
      }

      new_gr = runnable(new_gr)
      current_stage.settings.r_graph = new_gr
      console.log( "new_gryyy", new_gr)
    }

    current_edge = {pos:[], target: false}
    current_edge.target = false
    redraw()
  }

  function add_edge_to_input(current_edge){
    let n1 = current_stage.settings.r_graph.rich_graph.n[current_edge.source.i]
    let new_gr = JSON.parse(JSON.stringify(current_stage.settings.r_graph.rich_graph.init))
    //new_gr  = pipe1.add_node(new_gr) ({in: {1: true}, i: current_edge.source.i, id: JSON.parse(JSON.stringify(n1.id))})
    new_gr  = pipe1.add_node(new_gr) ({i: current_edge.source.i, id: pipe1.settings.id})
    for (let e in current_stage.settings.r_graph.rich_graph.e) {
      if (current_stage.settings.r_graph.rich_graph.e[e][0] === current_edge.source.i)
        new_gr = pipe1.add_edge (new_gr) (current_stage.settings.r_graph.rich_graph.e[e])
    }
    new_gr = pipe1.add_edge (new_gr) ([current_edge.source.i, current_edge.source.port, current_edge.target.port.i, current_edge.target.port.port] )
    return new_gr
  }

  function graph_edit(ctx, r_graph) {
    let dnodes = {}
    let rows = r_graph.runnable_graph.length
    let cols = 0

    for (const nodes of r_graph.runnable_graph) {
      for (const node of nodes) {
        let node_i = r_graph.rich_graph.n[node]
        let node_x = r_graph.context[node_i.id]
        let len = Math.max(node_x.pfunction.gapi.inputs.length, node_x.pfunction.gapi.outputs.length)
        dnodes[node] = {x: node_i.position.x, y: node_i.position.y, container: node_x.pclassid, name: node_x.pfunction.gapi.name, len: len, context: node_x.pfunction.gapi, i:node}
        if (cols < node_i.position.x  + len) {
          cols = node_i.position.x  + len
        }
      }
    }

    current_stage.settings = {width: pipeopts.width, height: pipeopts.height, nodes: dnodes, edges: r_graph.rich_graph.e, matrix: [rows,cols], transform: {x:0, y:0, l:1, f:0.00}, r_graph: r_graph}

    return graph_show(ctx, pipeopts.width, pipeopts.height, dnodes, r_graph.rich_graph.e, [rows,cols], current_stage.settings.transform, current_stage.settings.r_graph); // x:0, y:0, l:1, f:0.00

  }

  function pos_calculate(x, y, l, matrix, dims) {
    let marginw = pipeopts.width / 30
    let marginh = 0
    let minh = 16
    let stepw = (dims[0]-2*marginw)/(matrix[1]+0)
    let steph = (dims[1]-2*marginh+minh)/(matrix[0]-1)//-minh/2
    return {x: x*stepw+marginw+l*stepw/2, y: y*steph-minh/2, l: l*stepw, h: minh, steps: {w:stepw, h:steph}}
  }

  function graph_show(ctx2, width, height, nodes,  edges, matrix, transform, r_graph) {
    //mutable
    ctx2.clearRect(0, 0, width, height);
    ctx2.fillStyle="#fff"
    rect1([ctx2, width / 2, height / 2, width, height])
    current_stage.settings = {ctx: ctx2, width: width, height: height, nodes: nodes, edges:edges, matrix:matrix, transform:transform, r_graph: r_graph}

    let ports_pos = {}
    for (const node in nodes) {
      let n = nodes[node]
      node_show(ctx2, n, matrix, [width, height], ports_pos)
    }

    for (const edge of edges) {

        let e = edge
        let p1 = ports_pos[[e[0], e[1], 1]]
        let p2 = ports_pos[[e[2], e[3], 0]]
        let mid = [(p1.x+p2.x)/2,  (p1.y+p2.y)/2]
        let r = 4
        //console.log(edge, p1,p2)
        drawExactArrow(ctx2, p1.x, p1.y, p2.x, p2.y, p1.type, 1)
        targets.for_click_edge[e]= {t: mid[1]-r,  b: mid[1]+r , l:  mid[0]-r, r: mid[0]+r}
      }
  }

  function node_show(ctx, node, matrix, dims, ports_pos) {
    let scale=1
    let x = node.x
    let y = node.y
    let pos = pos_calculate(x, y, node.len, matrix, dims)
    let nw = pos.l
    let nh = pos.h

    ports_show(ctx, pos, node.context, ports_pos, node.i)
    ctx.fillStyle="#ccc"
    rect1([ctx,pos.x,pos.y,nw,pos.h,pos.h/2])
    targets.for_click[[node.i, 1]] = {l: pos.x-nw/2, r:  pos.x+nw/2-16 , t: pos.y-pos.h/2 , b: pos.y+pos.h/2}
    ctx.fillStyle="#fcc"
    rect1([ctx,pos.x+nw/2-8,pos.y,16,16,8])
    targets.for_click[[node.i, 0]] = {l: pos.x+nw/2-16, r:  pos.x+nw/2 , t: pos.y-pos.h/2 , b: pos.y+pos.h/2}
    ctx.beginPath()
    ctx.textAlign = "center";
    //ctx.font = (18*scale-9)+"px Roboto Condensed"
    //context.lineJoin = "round";
    ctx.fillStyle = "#000000"
    //ctx.fillText(shorten(node.container,max*5+2), pos.x, pos.y-2 );
    ctx.font = (12*scale+4)+"px Roboto Condensed"
    ctx.fillText(shorten(node.container,node.len*2+2)+": "+shorten(node.name,node.len*10+4), pos.x, pos.y+6 );
    ctx.fill()
  }

  function ports_show(ctx, pos, node_x, ports_pos,i){
    let ndx=0, nw=20
    for (let port1 of node_x.inputs){
      //console.log(port1, pos.x+pos.l+50*ndx, pos.y-20)
      ctx.fillStyle = typeOptions(port1.type).color
      let x = pos.x-pos.l/2+pos.steps.w*(ndx+0.5)
      let y = pos.y-pos.h/2
      rect1([ctx,x, y,nw,nw,10,10,0,0])
      ctx.save();
      ctx.translate( x, y);
      ctx.rotate( -Math.PI / 4 );
      ctx.font = (8/1+4)+"px Roboto Condensed";
      ctx.fillStyle = "#aaaaaa";; // red
      ctx.textAlign = "left";
      ctx.fillText( port1.name, 0,0 );
      ctx.restore();
      ports_pos[[i,ndx+1,0]]={x: x,y: y, type: port1.type}
      // console.log(i)
      if (parseInt(i) < 3000) targets.end_drag[[i,ndx+1]] = {x: x,  y: y, port: {i:i, port:ndx+1, type:port1.type}}
      ndx++
    }
    ndx=0
    for (let port1 of node_x.outputs){
      //console.log(port1)
      ctx.fillStyle = typeOptions(port1.type).color
      let x = pos.x-pos.l/2+pos.steps.w*(ndx+0.5)
      let y = pos.y+pos.h/2
      rect1([ctx, x, y,nw,nw,0,0,10,10])
      ports_pos[[i,ndx+1,1]]={x: x, y: y, type: port1.type}
      targets.for_drag[[i,ndx+1]] = {l: x-10,  r: x+10 ,t: y,b: y+10, port: {i:i, port:ndx+1, type:port1.type}}
      ndx++
    }
  }

  function shorten(txt, noChar){
    let len = txt.length
    if ( len < noChar) return txt;
    let half = Math.floor(noChar/2)
    return txt.slice(0, half)+ ".." +txt.slice(-half)
  }

  function drawExactArrow(ctx2, x1, y1, x2, y2, type, scale){
      var midx = (x2+x1)/2
      var midy = (y2+y1)/2
      let context = ctx2
      //let color  = types[type].color
      let srt  = "M"+x1+","+y1+"C"+x1+"," +midy+"," +
      midx+","+ midy+","+ midx+","+ midy+
      "C"+midx+"," +midy+","+ x2+","+ midy+"," +x2+","+ y2
      //let scale = 1
      //context.moveTo(x1, y1)
      context.lineCap = "round"
      context.strokeStyle  =  pipeopts.types[type] ? pipeopts.types[type].color : "#aaaaaa"
      context.lineWidth = 1*scale;
      context.stroke(new Path2D(srt));
      context.closePath();
      //context.moveTo(midx, midy)
      context.beginPath()
      context.arc(midx, midy, 3, 0, Math.PI*2, false);
      context.fillStyle = '#DDAAAA';
      context.fill();
      context.closePath();

  }

  function rect1(args) {
    const ctx = args[0];
    const x = args[1];
    const y = args[2];
    const w = args[3];
    const h = args[4];
    let tl = args[5];
    let tr = args[6];
    let br = args[7];
    let bl = args[8];

    //console.log(ctx)

    ctx.beginPath();

    if (typeof tl === 'undefined') {
      // No rounded corners
      ctx.rect(x-w/2, y-h/2, w, h);
    } else {
      // At least one rounded corner
      // Set defaults when not specified
      if (typeof tr === 'undefined') {
        tr = tl;
      }
      if (typeof br === 'undefined') {
        br = tr;
      }
      if (typeof bl === 'undefined') {
        bl = br;
      }

      // corner rounding must always be positive
      const absW = Math.abs(w);
      const absH = Math.abs(h);
      const hw = absW / 2;
      const hh = absH / 2;

      // Clip radii
      if (absW < 2 * tl) {
        tl = hw;
      }
      if (absH < 2 * tl) {
        tl = hh;
      }
      if (absW < 2 * tr) {
        tr = hw;
      }
      if (absH < 2 * tr) {
        tr = hh;
      }
      if (absW < 2 * br) {
        br = hw;
      }
      if (absH < 2 * br) {
        br = hh;
      }
      if (absW < 2 * bl) {
        bl = hw;
      }
      if (absH < 2 * bl) {
        bl = hh;
      }

      // Draw shape
      ctx.beginPath();
      ctx.moveTo(x + tl-w/2, y- h/2);
      ctx.arcTo(x + w/2, y-h/2, x + w/2, y + h/2, tr);
      ctx.arcTo(x + w/2, y + h/2, x-w/2, y + h/2, br);
      ctx.arcTo(x-w/2, y + h/2, x-w/2, y-h/2, bl);
      ctx.arcTo(x-w/2, y-h/2, x + w/2, y-h/2, tl);
      ctx.closePath();
    }
      ctx.fill();

    return ctx;
  };

  function redraw() {
    targets = JSON.parse(JSON.stringify(DEFAULT_TARGETS));
    graph_edit(current_stage.settings.ctx, current_stage.settings.r_graph)
    if (onchangeCallb) {
      const graph = JSON.parse(JSON.stringify(current_stage.settings.r_graph));
      onchangeCallb(graph);
    }
  }

  function showGraph() {
    let canvas1 = d3.select(pipeopts.domid).attr('width', pipeopts.width).attr('height', pipeopts.height);
    const ctx1 = canvas1.node().getContext('2d');
    d3.select(ctx1.canvas).call(d3.drag().on("start", dstart).on("drag", ddrag).on("end", dend));
    current_stage.settings.ctx = ctx1;
    graph_edit(current_stage.settings.ctx, current_stage.settings.r_graph)
  }

  function addFunction(pfunction, index) {
    console.log('addFunction pfunction', pfunction);
    fcontext[pfunction._id] = pfunction;
    console.log(current_stage.settings.r_graph);
    const lastIndex = Math.max(100,
      ...Object.keys(current_stage.settings.r_graph.rich_graph.init.n)
    );
    console.log('lastIndex', lastIndex);
    let new_gr = JSON.parse(JSON.stringify(current_stage.settings.r_graph.rich_graph.init))

    new_gr = pipe1.add_node(new_gr) ({i: lastIndex + 1, id: pfunction._id})
    new_gr = runnable(new_gr)

    console.log( "new_gryyy", new_gr)
    current_stage.settings.r_graph = new_gr

    redraw()
  }

  function clearGraph() {
    const graph = Object.assign({}, DEFAULT_GRAPH);
    current_stage.settings.r_graph = runnable(graph);
    showGraph();
  }

  let onchangeCallb;
  function onChange(cb) {
    onchangeCallb = cb;
  }

  function getGraph() {
    return current_stage.settings.r_graph;
  }

  return {
    show: showGraph,
    getGraph,
    pipe: pipe1,
    addFunction,
    clear: clearGraph,
    onChange,
  }
}

export default pipecanvas;
