/* eslint-disable */

const Sanct = require ('sanctuary');
const SDef = require ('sanctuary-def');
const bigInt = require("big-integer");

function pipe(rtypes) {
  window.S = Sanct;

  let pipejs = {
    types: rtypes.reduce((accum, types) => Object.assign(accum, types), {}),
    settings: {
      id: "5bc59e192817116e84bdd831",
      baseurl: "http://example.com/my-package#",
    },
  }

  const PFUNC_IO = (step_out, typing) => {
    // typing might contain other attributes, like payable
    return {
      "_id": pipejs.settings.id + step_out,
      "pclassid":"5c95397d4212cc40afeec914",
      "pfunction":{
        "signature":"io",
        "sources": {"javascript":"f=>f"},
        "graph":{},
        "gapi":{"constant":true,"inputs":[typing],"name":"io","outputs":[typing],"payable":false,"stateMutability":"view","type":"function"},
      },
      "timestamp":"2019-03-22T14:38:36.112Z",
      "pclass": {
        _id: "0x0",
        name: "pipejs_identity",
        type: 'javascript',
        deployment: 'unknown',
      }
    }
  }

  const COMMON_INPUT = (id, output) => {
    // typing might contain other attributes, like payable
    return {
      "_id": id,
      "pclassid":"5dbaa731f18ff7488e9b108b",
      "pfunction":{
        "signature":"id(x)",
        "gapi":{"constant":true,"inputs":[],"name":"id","outputs":[output],"payable":false,"stateMutability":"pure","type":"function"},
        "graph":{},
        "sources":{"javascript.rust":"() => rust.id()","javascript":"(x)=>x"}
      },
      "timestamp":"2019-11-06T19:22:53.807Z",
      pclass: {
        _id: "0x0",
        name: "pipejs_common_input",
        type: 'javascript',
        deployment: 'unknown',
      }
    }
  }

  let env = SDef.env;

  let def = SDef.create ({
    checkTypes: true,
    env,
  });

  let pl = {}
  pl["mongoid"] = SDef.NullaryType  ('mongoid') (pipejs.settings.baseurl+'mongoid') ([])
  (x => Sanct.is (SDef.String) (x)// && bigInt(x, 16).geq(0) && bigInt(x, 16).lesser(two.pow(12*8))
  )
  pl["node"] = SDef.RecordType({"i": SDef.Number, "id": pl["mongoid"]})
pl["rich_node"] = SDef.RecordType({
  "i": SDef.Number, "svg_id": SDef.String,
  "id": pl["mongoid"],
   "out": SDef.StrMap (SDef.Array (SDef.Array (SDef.Number))),
   "in": SDef.StrMap (SDef.Array (SDef.Number)),
   "position": SDef.RecordType({
    "x": SDef.Number,
    "y": SDef.Number
    }),
    "edges": SDef.Array (SDef.String)
  })

pl["edge"] = SDef.NullaryType  ('edge') (pipejs.settings.baseurl+'edge') ([])
  (x => Sanct.is (SDef.Array (SDef.Number)) (x) && Sanct.equals (4) (x.length) )

pl["rich_edge"] = SDef.NullaryType  ('edge') (pipejs.settings.baseurl+'edge') ([])
  (x  => Sanct.is (SDef.RecordType({
    "e": pl["edge"], "svg_id": SDef.String, "type": SDef.String
    })) (x) &&
    Sanct.is (SDef.Type) (pipejs.types[x.type])
  )
// pl["rich_edge"] = SDef.NullaryType  ('edge') (baseurl+'edge') ([])
//   (x => Sanct.is (SDef.Array (SDef.Number)) (x) && Sanct.equals (5) (x.length) )
pl["nodes"] = SDef.StrMap (pl["node"])
pl["rich_nodes"] = SDef.StrMap (pl["rich_node"])
pl["edges"] = SDef.Array (pl["edge"])
pl["runtime"]  = SDef.Array (SDef.Any)
pl["graph"] = SDef.NullaryType  ('graph') (pipejs.settings.baseurl+'graph') ([])
  (
    x => Sanct.is (SDef.RecordType({"n": pl["nodes"], "e": pl["edges"], r: pl["runtime"]})) (x)
    //&& Sanct.map (edge => (x.n[edge[0]] || x.r[edge[0]]) && (x.n[edge[2]] || x.r[edge[2]]) (x.e) )

      )
pl["rich_graph"] = SDef.NullaryType  ('rich_graph') (pipejs.settings.baseurl+'rich_graph') ([])
  (
    x => Sanct.is (SDef.RecordType({ "n": pl["rich_nodes"], "e": pl["edges"], "r": pl["runtime"], init: pl["graph"]})) (x)
  )

pl["runnable_graph_step"] = SDef.NullaryType  ('runnable_graph_step') (pipejs.settings.baseurl+'runnable_graph_step') ([])
  (
    x => Sanct.is (SDef.Array (SDef.Number)) (x) || Sanct.is (SDef.Array0) (x)
  )

pl["runnable_graph"] = SDef.Array (pl["runnable_graph_step"])

pl["graph_history"] = SDef.Array (pl["graph"])

pl["abi_io_function"]  = SDef.NullaryType ('abi_io_function') (pipejs.settings.baseurl+'abi_io_function') ([])
    ( x =>
      Sanct.is (SDef.RecordType({
        "name": SDef.String,
        "type": SDef.String,
        // TODO components
      })) (x) &&
      Sanct.is (SDef.Type) (pipejs.types[x.type])
    )

pl["abi_io_event"]  = SDef.NullaryType ('abi_io_event') (pipejs.settings.baseurl+'abi_io_event') ([])
    ( x =>
      Sanct.is (SDef.RecordType({
        "name": SDef.String,
        "type": SDef.String,
        // TODO components
        "indexed": SDef.Boolean,
      })) (x) &&
      Sanct.is (SDef.Type) (pipejs.types[x.type])
    )

pl['abi_ios_function'] = SDef.NullaryType ('abi_ios_function') (pipejs.settings.baseurl+'abi_ios_function') ([])
    ( x =>
      Sanct.is (SDef.Array (pl["abi_io_function"])) (x) ||
      Sanct.is (SDef.Array0) (x)
    )

pl['abi_ios_events'] = SDef.NullaryType ('abi_io_event') (pipejs.settings.baseurl+'abi_io_event') ([])
    ( x =>
      Sanct.is (SDef.Array (pl["abi_io_event"])) (x) ||
      Sanct.is (SDef.Array0) (x)
        )

pl["abi_type"]  = SDef.EnumType
  ('abi_type')
  (pipejs.settings.baseurl+'abi_type')
  (["function", "constructor",  "fallback", "event", "receive", "string"]);

pl["abi_mutability"]  = SDef.EnumType
  ('abi_mutability')
  (pipejs.settings.baseurl+'abi_mutability')
  (["pure", "view", "nonpayable", "payable"]);

pl["func_abi"] = SDef.RecordType({
  "type": pl["abi_type"], // might be missing; default 'function'
  "name": SDef.String,
  "inputs": pl['abi_ios_function'],
  "outputs": pl['abi_ios_function'],
  "constant": SDef.Boolean, // will be deprecated
  "payable": SDef.Boolean, // will be deprecated
  "stateMutability": pl["abi_mutability"],
})

pl["event_abi"] = SDef.RecordType({
  "type": pl["abi_type"],
  "name": SDef.String,
  "inputs": SDef.Array0,
  "outputs": pl['abi_ios_events'],
  "anonymous": SDef.Boolean,
})

pl["gapi"] = SDef.NullaryType ('gapi') (pipejs.settings.baseurl+'gapi') ([])
    ( x =>
      Sanct.is (pl["func_abi"]) (x) ||
      Sanct.is (pl["event_abi"]) (x)
    )

pl["cont_abi"] = SDef.Array (pl["func_abi"])

pl["pclass"] = SDef.RecordType({
  _id: SDef.String,
  name: SDef.String,
  type: SDef.String,
  deployment: SDef.String,
})

pl["db_func"] = SDef.RecordType({
  "_id": pl["mongoid"],
  "pclassid": pl["mongoid"],
  "pfunction": SDef.RecordType({
    "signature": SDef.String,
    "gapi": pl["gapi"],
    "graph": SDef.Any,
    "sources": SDef.StrMap (SDef.String),
  }),
  "timestamp": SDef.String,
  "pclass": pl["pclass"],
})



pl["db_funcs"]  = SDef.Array (pl["db_func"])
pl["id_funcs"] = SDef.StrMap (pl["db_func"])


pl["runtime_graph"] = SDef.RecordType({
  "rich_graph": pl["rich_graph"],
  "runnable_graph":  pl["runnable_graph"],
  "context": pl["id_funcs"],
  "runtime": SDef.StrMap ( pl["runtime"])
})


  pipejs.pl = pl;
  pipejs._currentPoint= {x: 0, y: 1};
  pipejs.indexed_func= {};

  pipejs.set_indexed_func = def ('set_indexed_func') ({})
    ([pl["id_funcs"], pl["id_funcs"]])
    (fcontext => {
      pipejs.indexed_func = fcontext;
      return pipejs.indexed_func;
    });

  pipejs.get_indexed_func = def ('get_indexed_func') ({})
    ([pl["id_funcs"]])
    (() => pipejs.indexed_func)

  pipejs.add_indexed_func = def ('index_funcs') ({})
    ([pl["db_func"], pl["id_funcs"]])
    (added_func => {
      pipejs.indexed_func[added_func._id] = added_func;
      return pipejs.indexed_func;
    });

  pipejs.index_funcs= def ('index_funcs') ({})
    ([pl["db_funcs"], pl["id_funcs"]])
    (db_funcs => {
      let obj_funcs = {}
      Sanct.map (x => obj_funcs[x._id] = x) (db_funcs)
      return obj_funcs;
    });

  pipejs.add_const= def ('add_const') ({})
    ([pl["graph"], SDef.Object, pl["graph"]])
    (graph =>  edge => variable => {
      let graph2 = JSON.parse(JSON.stringify(graph))
      pipejs.settings.runstep ++
      graph2.r[pipejs.settings.runstep] = variable
      return pipejs.add_edge (graph2) (edge)
    });

  pipejs.add_edge= def ('add_edge') ({})
    ([pl["graph"], pl["edge"], pl["graph"]])
    (graph => edge => {
      //if (!(graph.n[edge[0]] && graph.n[edge[2]])) return graph;
      if (edge in graph.e) return graph;
      let graph2 = JSON.parse(JSON.stringify(graph))
      graph2.e.push(edge)
      return graph2;
    });

  pipejs.indexInArray= function(array, item) {
    // console.log(array, item)
    for (var i = 0; i < array.length; i++) {
      // This if statement depends on the format of your array
      if (
        array[i][0] == item[0] &&
        array[i][1] == item[1] &&
        array[i][2] == item[2] &&
        array[i][3] == item[3]
      ) {
        return i;   // Found it
      }
    }
    return -1;   // Not found
  };

  pipejs.remove_edge= def ('remove_edge') ({})
    ([pl["graph"], pl["edge"], pl["graph"]])
    (graph => edge => {
      // console.log("ndx", graph.e)
      let index = pipejs.indexInArray(graph.e, edge);
      // console.log("ndx", index)
      if (index > -1) {
        let graph2 = JSON.parse(JSON.stringify(graph))
        graph2.e.splice(index, 1);
        return graph2;
      }
      return graph;
    });

  pipejs.add_node= def ('add_node') ({})
    ([pl["graph"], pl["node"], pl["graph"]])
    (graph => node => {
      let graph2 = JSON.parse(JSON.stringify(graph))
      graph2.n[node.i] = node
      return graph2;
    });

  pipejs.remove_node= def ('remove_node') ({})
    ([pl["graph"], SDef.Number, pl["graph"]])
    (graph => node_id => {
      // console.log(!(""+node_id in graph.n))
      if (!(""+node_id in graph.n)) return graph;
      let graph2 = JSON.parse(JSON.stringify(graph))
      // console.log(graph2)
      let ndx = 0
      // delete edges from/to that node first!
      while (graph2.e.length > ndx) {
        if (graph2.e[ndx][0] == node_id || graph2.e[ndx][2] == node_id) {
          graph2.e.splice(ndx, 1);
        }  else {
          ndx++
        }
      }
      delete graph2.n[""+node_id]
      return graph2;
    });

  pipejs.enrich= function(na){
    //if (na._currentPoint === undefined) na._currentPoint = {x: 0, y: 1}
    pipejs._currentPoint.y = na.level
    if (na.row  === 0) pipejs._currentPoint.x = 0
    na.node.position = {x: pipejs._currentPoint.x, y: pipejs._currentPoint.y}

    let max  = Math.max(na.context[na.node.id].pfunction.gapi.inputs.length, na.context[na.node.id].pfunction.gapi.outputs.length)
    //console.log(max, pipejs._currentPoint)
    pipejs._currentPoint.x = pipejs._currentPoint.x  + max
  };

    pipejs.addEdges= function(g){
      //// console.log("grfff",g)
      Sanct.map (
        e => {
          // console.log("edge",e, g)
          if (g.r[e[0]]) {
            //g.n[e[0]].out[e[1]].push([e[2], e[3]])
          } else {
            //g.n[e[0]].out[e[1]] = [[e[2], e[3]]]
            if (g.n[e[0]].out[e[1]]) {
              g.n[e[0]].out[e[1]].push([e[2], e[3]])
            } else {
              g.n[e[0]].out[e[1]] = [[e[2], e[3]]]
            }
          }
          g.n[e[2]].in[e[3]] = [e[0], e[1]]
        }
      ) (g.e)
    };

  pipejs.difference= function(first, second) {
    for (var i=0; i<second.length; i++) {
        var index = undefined;
        while ((index = first.indexOf(second[i])) !== -1) {
            first.splice(index, 1);
        }
    }
    return first;
  };

  pipejs.inputNodesAreVisited= function(node, visited){
    // console.log("iii", node,  visited)
    for (const key in node.in) {
      if (!visited.includes(""+node.in[key][0]) ) return false;
    }
    return true
  };

  pipejs.inputNodesAreDefined= function(node, defined, level){
    // console.log("iii", node, defined)
    if (level  === 0) return false
    for (const key in node.in) {
      // console.log("iiikey", key, node.in[key])
      let u  = defined[node.in[key][0]]
      // console.log("iiikeyu", u)
      //return  true
      if (!u ) return false;
      if (!u[node.in[key][0]]) return false;
    }
    return true
  };

  pipejs.positionNodes= function(gf, unvisited, visited, visitors, level){
    if (unvisited.length  === 0) return;
    let row = 0, visitedNow = []
    let only_outputs = true
    Sanct.map (n => {if (n < 4000 ) only_outputs = false }) (unvisited)

    Sanct.map (n => {
      if ((pipejs.inputNodesAreVisited(gf.n[n], visited)  || pipejs.inputNodesAreDefined(gf.n[n], gf.r, level)) && (level >0 || n > 2000)){
        Sanct.flip (visitors) ({node: gf.n[n] , level: level, row: row, context: pipejs.indexed_func})
        row = row+1
        if (only_outputs || n < 4000) visitedNow.push(n)
      }
    }) (unvisited)
    unvisited = pipejs.difference(unvisited, visitedNow)
    visited = visited.concat(visitedNow)
    // console.log(gf, unvisited, visited, visitors, level+1)
    return pipejs.positionNodes(gf, unvisited, visited, visitors, level+1)
  };

  pipejs.addNodesEdges= function (grf, context){
    let added_nodes = {}
    let added_edges = []
    let step_out = 4000
    let step_in = 3000
    while (grf.n[""+step_out] !== undefined) step_out++
    while (grf.n[""+step_in] !== undefined) step_in++

    Sanct.map (
      n => {
        // for inputs with multiple edges, we add a mock node in context
        if (n.i >= 3000) {
          const [targetNode, targetPort] = n.out["1"][0];
          const output = context[grf.n[""+targetNode].id].pfunction.gapi.inputs[targetPort - 1];
          context[n.id] = COMMON_INPUT(n.id, {type: output.type, name: output.name});
        }
        for (let i = 1 ; i <=context[n.id].pfunction.gapi.outputs.length; i++){
          if (!(""+i in n.out) && n.id != pipejs.settings.id) {
            let no = {
              i: step_out,
              svg_id: "",
              id: pipejs.settings.id+step_out,
              in:{"1": [n.i, i]},
              out:{},
              position: {x: 0, y:0} ,
              edges: []
            }
            let typing  = context[n.id].pfunction.gapi.outputs[i-1]
            // console.log(context[n.id].pfunction.gapi.outputs, i)

            pipejs.indexed_func[pipejs.settings.id+step_out] = PFUNC_IO(step_out, typing);

            added_nodes[step_out]  = no
            added_edges.push([n.i, i, step_out, 1])
            n.out[""+i]= [[step_out, 1]]
            step_out++;
          }
        }

        for (let i = 1 ; i <=context[n.id].pfunction.gapi.inputs.length; i++){
          while (grf.n[step_in]) {
            step_in += 1;
          }
          if (!(""+i in n.in) && n.id != pipejs.settings.id) {
            let on = {edges: [], i: step_in, id: pipejs.settings.id +step_in,
            in:{}, out:{"1":[[n.i, i]]}, position: {x: 0, y:0}, svg_id: ""}
            let typing  = context[n.id].pfunction.gapi.inputs[i-1]
            // console.log(context[n.id].pfunction.gapi.inputs, i)

            pipejs.indexed_func[pipejs.settings.id + step_in] = PFUNC_IO(step_in, typing);

            added_nodes[step_in]  = on
            added_edges.push([step_in, 1, n.i, i])
            n.in[""+i] = [step_in, 1]
            step_in++;
          }
        }
      }
    ) (grf.n)
    grf.n= Object.assign(grf.n, added_nodes)
    // console.log("added_edges", added_edges)
    grf.e = grf.e.concat(added_edges)
  };

  // pipejs.add_common_input_context = def ('add_common_input_context') ({})
  //   ([pl["id_funcs"], pl["graph"], pl["id_funcs"]])
  //   (context => graph => {
  //     Sanct.map (n => {
  //       const common_input = COMMON_INPUT()
  //
  //       context[added_func._id] = added_func;
  //     }) (graph.n)
  //     return context;
  //   });

  pipejs.enrich_graph= def ('enrich_graph') ({})
    ([pl["id_funcs"], pl["graph"], pl["rich_graph"]])
    (context => graph1 => {
      let graph2 = JSON.parse(JSON.stringify(graph1))
      // context = pipejs.add_common_input_context(context) (graph1);

      Sanct.map (x => {
        x.out = {};
        x.in ={};
        x.position = {x: 0, y: 0};
        x.svg_id = "";
        x.edges = [];
      }) (graph2.n)
      pipejs.addEdges(graph2);
      pipejs.addNodesEdges(graph2, context);
      // console.log("lllll",graph2)
      let visitors = [pipejs.enrich];
      let graph3 =  pipejs.positionNodes(graph2, Sanct.keys(graph2.n), ["0"], visitors, 0)
      // console.log("graph3",graph3)
      graph2.init  = graph1
      return graph2
    });

  pipejs.make_runtime=  def ('make_runtime') ({})
    ([pl["id_funcs"], pl["rich_graph"], pl["runtime_graph"]])
    (context  => rich_graph => {
      let rows = []
      let rich_graph2 = JSON.parse(JSON.stringify(rich_graph))

      for (let x of Object.keys(rich_graph2.n)) {
          if ( rows[rich_graph2.n[x].position.y] === undefined) {
            rows[rich_graph2.n[x].position.y] = []
          }
          rows[rich_graph2.n[x].position.y].push(parseInt(x))
      }
      if (!rows[0]) rows[0] = [];

      return {
        "rich_graph": rich_graph2,
        "runnable_graph": rows,
        "context": context,
        "runtime": { "0": rich_graph2.r}
      }
    });

  pipejs.run_graph = def ('run_graph') ({})
    ([pl["runtime_graph"], SDef.Any,  SDef.Any, SDef.Any])
    ( runtime_graph => resolver => async ins => {
      let node;
      let arr_ins = ins instanceof Array ? ins : Object.values(ins);
      let runnable = JSON.parse(JSON.stringify(runtime_graph.runnable_graph))
      let rich = JSON.parse(JSON.stringify(runtime_graph.rich_graph))

      runnable[0].forEach((key, i) => {
        if (key < 3000) return;
        const nodeContext = runtime_graph.context[rich.n[""+key].id];
        resolver.setInput(
          ""+key,
          [arr_ins[i]],
          nodeContext.pfunction.gapi.outputs[0],
        );
      });

      for (let x of runnable) {
        for (let y of x) {
          node  = rich.n[""+y]
          let contxt = runtime_graph.context[node.id]
          let inputKeys = []

          if  ("1" in node.in) {
            Sanct.map (x1=> {
              const nodeContext = runtime_graph.context[rich.n[x1[0]].id];
              const source = nodeContext.pfunction.gapi.outputs[x1[1] - 1];
              inputKeys.push([""+x1[0], x1[1] - 1, source]);
            }) (node.in)
          } else {
            const outs = contxt.pfunction.gapi.outputs;
            inputKeys = outs.map((io, i) => [""+y, i, io]);
          }

          const outputKeys = contxt.pfunction.gapi.outputs.map((io, i) => [""+y, i, io]);
          if (Object.getOwnPropertyNames(contxt.pfunction.graph).length > 0) {
            const { subresolver, inputs: args } = resolver.onSubGraph(contxt, inputKeys, outputKeys);

            if (subresolver) {
              const answ = await pipejs.run_graph (pipejs.make_runtime (pipejs.indexed_func) (pipejs.enrich_graph (pipejs.indexed_func) (contxt.pfunction.graph))) (subresolver) (args);

              resolver.onSubGraphResponse(contxt, answ, inputKeys, outputKeys);
            }

          } else {
            await resolver.onNodeCall(contxt, inputKeys, outputKeys);
          }
        }
      }
      runnable[runnable.length - 1].map((key, i) => {
        if (key < 4000) return;

        const [sourceNode, sourcePort] = rich.n[key].in[1];
        const nodeContext = runtime_graph.context[rich.n[sourceNode].id];
        const source = nodeContext.pfunction.gapi.outputs[sourcePort - 1];
        resolver.setOutput(""+sourceNode, sourcePort - 1, source);
      });

      return resolver.getOutput();
    });

  pipejs.build_and_run_graph= def ('build_and_run_graph') ({})
    ([pl["id_funcs"], pl["graph"], SDef.Object, SDef.Any])
    ( context => graph => resolver => ins => {
      pipejs.set_indexed_func(context);
      return pipejs.run_graph (pipejs.make_runtime (context) (pipejs.enrich_graph (context) (graph)) ) (resolver) (ins)
    });

  pipejs.getFuncsFromGraph= function(gf) {
    let out  = []
    for (let node in  gf.n) {
      out.push(gf.n[node].id)
    }
    return out
  };

  return pipejs;

}

export default pipe;
