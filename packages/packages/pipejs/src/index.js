/* eslint-disable */

const Sanct = require ('sanctuary');
const SDef = require ('sanctuary-def');
const bigInt = require("big-integer");

function pipe() {
  window.S = Sanct;

  let pipejs = {
    sol: {},
    settings: {
      id: "5bc59e192817116e84bdd831",
      baseurl: "http://example.com/my-package#",
    }
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
        // "chainids":["3"]
      },
      // "tags": ["pipeline"],
      // "categories":{
      //   "tags":[]
      // },
      "timestamp":"2019-03-22T14:38:36.112Z",
      "pclass": {
        _id: "0x0",
        name: "unknown",
        type: 'unknown',
        deployment: 'unknown',
      }
    }
  }

  let sol = {}
  let zero = bigInt();
  let two = bigInt(2);

  let cast = type => obj => {
    const names = Object.keys (type.types);
    const types = Object.values (type.types);
    const values = Object.values (obj);
    return values.length === types.length &&
           values.every ((v, idx) => Sanct.is (types[idx]) (v))
           ? Sanct.unchecked.fromPairs (Sanct.unchecked.zip (names) (values))
           : Sanct.Nothing;
  };

  let env = SDef.env;

  let def = SDef.create ({
    checkTypes: true,
    env,
  });

  let like = t1 => t2 =>
    t1.type === 'RECORD' &&
    t2.type === 'RECORD' &&
    Sanct.equals (Object.values (t1.types)) (Object.values (t2.types));


  Sanct.map (((y)=>{
  sol["uint"+y*8] = SDef.NullaryType
  ('uint'+y*8)
  ('uint'+y*8)
  ([])
  (x => bigInt.isInstance(x) &&
        x.geq(0) &&
        x.lesser(two.pow(new bigInt(y*8))));

  sol["int"+y*8] = SDef.NullaryType
    ('int'+y*8)
    ('int'+y*8)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(-two.pow(new bigInt(y*8-1))) &&
          x.lesser(two.pow(new bigInt(y*8-1))));

  sol["bytes"+y] = SDef.NullaryType
    ('bytes'+y)
    ('bytes'+y)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(0) &&
          x.lesser(two.pow(new bigInt(y*8))));
})) (Sanct.range (1) (33));

  pipejs.sol = sol;
  pipejs.addType= function (name, type){
    pipejs.sol[name] = type
  }

  let types =
  [
    ["string", SDef.String],
    ["bytes" , SDef.String],
    ["number", SDef.Number],
    ["number[]", SDef.Array(SDef.Number)],
    ["string", SDef.String],
    ["string[]", SDef.Array(SDef.String)],
    ["object", SDef.Object],
    ["object[]", SDef.Array(SDef.Object)],
    ["function", SDef.Any],
    ["address", pipejs.sol["bytes20"]],
    ["byte", pipejs.sol["bytes1"]],
    ["uint", pipejs.sol["uint256"]],
    ["int", pipejs.sol["int256"]],
    ["bool", pipejs.sol["uint8"]],
    ["tuple", SDef.Any], // has to bbe better defined SDef.RecordType
    ["any", SDef.Any]
  ]
  //console.log(types)
  types.map(x=>pipejs.addType(x[0],x[1]))

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
    Sanct.is (SDef.Type) (sol[x.type])
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

pl["abi_io"]  = SDef.NullaryType ('abi_io') (pipejs.settings.baseurl+'abi_io') ([])
    ( x =>
      Sanct.is (SDef.RecordType({"name": SDef.String, "type": SDef.String})) (x) &&
      Sanct.is (SDef.Type) (sol[x.type])
    )

pl['abi_ios'] = SDef.NullaryType ('abi_ios') (pipejs.settings.baseurl+'abi_ios') ([])
    ( x =>
      Sanct.is (SDef.Array (pl["abi_io"])) (x) ||
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
  "type": pl["abi_type"],
  "name": SDef.String,
  "inputs": pl['abi_ios'],
  "outputs": pl['abi_ios'],
  "constant": SDef.Boolean,
  "payable": SDef.Boolean,
  "stateMutability": pl["abi_mutability"],
})

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
    "gapi": pl["func_abi"],
    "graph": SDef.Any,
    // "chainids": SDef.Array (SDef.String),
    "sources": SDef.StrMap (SDef.String),
  }),
  // "tags": SDef.Array (SDef.String),
  // "categories": SDef.StrMap (SDef.Any),
  // "categories": SDef.Any,
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
  //pipejs.try = {};
  pipejs._currentPoint= {x: 0, y: 1};
  pipejs.indexed_func= {};

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
    //// console.log(na.context[na.node.id])
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

  pipejs.enrich_graph= def ('enrich_graph') ({})
    ([pl["id_funcs"], pl["graph"], pl["rich_graph"]])
    (context => graph1 => {
      let graph2 = JSON.parse(JSON.stringify(graph1))

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

  pipejs.run_graph=  def ('run_graph') ({})
    ([pl["runtime_graph"], SDef.Any, SDef.Any])
    ( runtime_graph => ins => {
      let outs = [], ndx = 0, node
      let func, args, ans;
      let arr_ins = Object.values(ins)


      let runtime = JSON.parse(JSON.stringify(runtime_graph.runtime))
      let runnable = JSON.parse(JSON.stringify(runtime_graph.runnable_graph))
      let rich = JSON.parse(JSON.stringify(runtime_graph.rich_graph))

      //// console.log("gkkgg", arr_ins)
      Sanct.map (x => {
        //console.log("in item gkkgg", x, ndx, arr_ins, arr_ins[ndx], ""+x)
        runtime[""+x] = [arr_ins[ndx]]
        //console.log("vvvv", JSON.parse(JSON.stringify(runtime)), runtime[""+x])
        ndx++
      }) (runnable[0])

      //console.log(ins, arr_ins, runnable)
      //console.log("gkkgg ins", arr_ins, runnable, JSON.parse(JSON.stringify(runtime)))
      ndx = 0
      Sanct.map (x => {
        //console.log(x,"x")
        //if (ndx !== 0) {
        Sanct.map (y => {
        node  = rich.n[""+y]
        let contxt = runtime_graph.context[node.id]
        let source = contxt.pfunction.sources.javascript

        let args=[]
        //console.log("node.in.length", node.in,  node,"1" in node.in)

        if  ("1" in node.in){
          let port  =  0
          Sanct.map (x1=> {
            // console.log(x1)
            let argt = runtime[x1[0]][x1[1]-1]
            let type  = contxt.pfunction.gapi.inputs[port].type
            if (type == "function") {
              argt  = new Function("return " + argt)();
            }
            port++
            args.push(argt)
          }) (node.in)
        } else {
          args  = runtime[""+y]
        }

        args = args || [];

        if (contxt.pfunction.gapi.type == "function") {
          //let ans, func

          if (Object.getOwnPropertyNames(contxt.pfunction.graph).length > 0) {
            //console.log("------", contxt.pfunction.graph, node)
            ans = pipejs.run_graph (pipejs.make_runtime (pipejs.indexed_func) (pipejs.enrich_graph (pipejs.indexed_func) (contxt.pfunction.graph))) (args);
            //ans = Object.values(func.apply(this, [args]));
            ans = Object.values(ans)
          } else {
            //console.log("Src: ",source)
            func = new Function("return " + source)();
            //console.log("func",func,JSON.stringify(args), JSON.stringify(runtime))
            if (func.length < args.length) {
              ans = Sanct.unchecked.reduce (Sanct.I)
              (func)
              (args)
            } else  {
              // ans = func.apply(this, args);
              ans = func.apply(this, args);
            }
          }

        } else {
          try {
            func = JSON.parse("["+source+"]")[0]
          } catch (error) {
            func = JSON.parse("[\""+source+"\"]")[0]
          }
        }
        // if ( contxt.pfunction.gapi.outputs.length <= 1) {
        //   ans = [ans]
        // }
        runtime[""+y] = [ans]
        //console.log("aans2", ans, func, JSON.stringify(runtime))

        if (y >=  4000)  outs.push(ans)

        //// console.log(JSON.stringify(runtime_graph.runtime))
    }) (x) } )  (runnable)
      // console.log(ins)
      //console.log("run, out", JSON.stringify(runtime), outs)
      return outs;

    });

  pipejs.fun_graph= def ('fun_graph') ({})
    ([pl["id_funcs"], pl["graph"], SDef.Object, SDef.Any])
    ( context => graph => ins =>{
      return pipejs.run_graph (pipejs.make_runtime (context) (pipejs.enrich_graph (context) (graph)) ) (ins)
    });

  pipejs.getFuncsFromGraph= function(gf) {
    let out  = []
    for (let node in  gf.n) {
      out.push(gf.n[node].id)
    }
    return out
  };

  pipejs.resolveDb= function(arrFunc){
    let arr =  arrFunc.filter(x=>!(x in pipejs.indexed_func))
    console.log(arr, pipejs.indexed_func)
    /*
    let res = arr.map(x=>fetch('http://192.168.1.140:3001/pfunction/'+x)
    .then(data => {
      return data.json();
    }));
    console.log(res, arrFunc)
    */
  };

  pipejs.resolveGraph= function(context, gra, ins){
    //console.log("gra", context, gra, ins)
      //console.log(pipejs.indexed_func, pipejs._currentPoint)
    pipejs.indexed_func = Object.assign({}, pipejs.indexed_func, pipejs.index_funcs(context))
      //console.log(pipejs.indexed_func)
    pipejs.resolveDb(pipejs.getFuncsFromGraph(gra));
    setTimeout ( x=>{
        //graph  = enrich_graph (indexed_func) (gra)
        let out
        //console.log("index_funcs", JSON.stringify(indexed_func), gra0)
        out = pipejs.fun_graph  (pipejs.indexed_func) (gra) (ins);
        //out=pipejs.enrich_graph (pipejs.indexed_func) (gra)
        console.log(out);
        //resolve(out);
        //doit2()
      }, 2000);
  }

  return pipejs;

}

export default pipe;
