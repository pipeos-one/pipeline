/* eslint-disable */

const S = require ('sanctuary');
const _ = require ('sanctuary-def');

window.S = S;

let bigInt = require("big-integer");
let zero = bigInt();
let two = new bigInt(2)


let settings = {
  id: "5bc59e192817116e84bdd831",
  baseurl: "http://example.com/my-package#",
}

let sol = {}
let pl = {}

let pipe = function() {
  //console.log(S.map)
  let pipejs = { sol: {}}
  let sol = {}
  let zero = bigInt();
  let two = bigInt(2);
  S.map (((y)=>{
  sol["uint"+y*8] = _.NullaryType
  ('uint'+y*8)
  ('uint'+y*8)
  ([])
  (x => bigInt.isInstance(x) &&
        x.geq(0) &&
        x.lesser(two.pow(new bigInt(y*8))));

  sol["int"+y*8] = _.NullaryType
    ('int'+y*8)
    ('int'+y*8)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(-two.pow(new bigInt(y*8-1))) &&
          x.lesser(two.pow(new bigInt(y*8-1))));

  sol["bytes"+y] = _.NullaryType
    ('bytes'+y)
    ('bytes'+y)
    ([])
    (x => bigInt.isInstance(x) &&
          x.geq(0) &&
          x.lesser(two.pow(new bigInt(y*8))));
})) (S.range (1) (33));

  pipejs.sol = sol;
  pipejs.addType= function (name, type){
    pipejs.sol[name] = type
  }

  let types =
  [
    ["string", _.String],
    ["bytes" , _.String],
    ["number", _.Number],
    ["number[]", _.Array(_.Number)],
    ["string", _.String],
    ["string[]", _.Array(_.String)],
    ["object", _.Object],
    ["object[]", _.Array(_.Object)],
    ["function", _.Any],
    ["address", pipejs.sol["bytes20"]],
    ["byte", pipejs.sol["bytes1"]],
    ["uint", pipejs.sol["uint256"]],
    ["int", pipejs.sol["int256"]],
    ["bool", pipejs.sol["uint8"]],
    ["tuple", _.Any], // has to bbe better defined _.RecordType
    ["any", _.Any]
  ]
  //console.log(types)
  types.map(x=>pipejs.addType(x[0],x[1]))

  let pl = {}
  pl["mongoid"] = _.NullaryType  ('mongoid') (settings.baseurl+'mongoid') ([])
  (x => S.is (_.String) (x)// && bigInt(x, 16).geq(0) && bigInt(x, 16).lesser(two.pow(12*8))
  )
  pl["node"] = _.RecordType({"i": _.Number, "id": pl["mongoid"]})
pl["rich_node"] = _.RecordType({
  "i": _.Number, "svg_id": _.String,
  "id": pl["mongoid"],
   "out": _.StrMap (_.Array (_.Array (_.Number))),
   "in": _.StrMap (_.Array (_.Number)),
   "position": _.RecordType({
    "x": _.Number,
    "y": _.Number
    }),
    "edges": _.Array (_.String)
  })

pl["edge"] = _.NullaryType  ('edge') (settings.baseurl+'edge') ([])
  (x => S.is (_.Array (_.Number)) (x) && S.equals (4) (x.length) )

pl["rich_edge"] = _.NullaryType  ('edge') (settings.baseurl+'edge') ([])
  (x  => S.is (_.RecordType({
    "e": pl["edge"], "svg_id": _.String, "type": _.String
    })) (x) &&
    S.is (_.Type) (sol[x.type])
  )
// pl["rich_edge"] = _.NullaryType  ('edge') (baseurl+'edge') ([])
//   (x => S.is (_.Array (_.Number)) (x) && S.equals (5) (x.length) )
pl["nodes"] = _.StrMap (pl["node"])
pl["rich_nodes"] = _.StrMap (pl["rich_node"])
pl["edges"] = _.Array (pl["edge"])
pl["runtime"]  = _.Array (_.Any)
pl["graph"] = _.NullaryType  ('graph') (settings.baseurl+'graph') ([])
  (
    x => S.is (_.RecordType({"n": pl["nodes"], "e": pl["edges"], r: pl["runtime"]})) (x)
    //&& S.map (edge => (x.n[edge[0]] || x.r[edge[0]]) && (x.n[edge[2]] || x.r[edge[2]]) (x.e) )

      )
pl["rich_graph"] = _.NullaryType  ('rich_graph') (settings.baseurl+'rich_graph') ([])
  (
    x => S.is (_.RecordType({ "n": pl["rich_nodes"], "e": pl["edges"], "r": pl["runtime"], init: pl["graph"]})) (x)
  )

pl["graph_history"] = _.Array (pl["graph"])

pl["io"]  = _.NullaryType ('io') (settings.baseurl+'graph') ([])
    ( x =>
      S.is (_.RecordType({"name": _.String, "type": _.String})) (x) &&
      S.is (_.Type) (sol[x.type])
    )

pl["abi_type"]  = _.EnumType
  ('abi_type')
  (settings.baseurl+'abi_type')
  (["function", "constructor",  "fallback", "event", "string"]);

pl["abi_mutability"]  = _.EnumType
  ('abi_mutability')
  (settings.baseurl+'abi_mutability')
  (["pure", "view", "nonpayable", "payable"]);

pl["func_abi"] = _.RecordType({
  "type": pl["abi_type"],
  "name": _.String,
  "inputs": _.Array (pl["io"]),
  "outputs": _.Array (pl["io"]),
  "constant": _.Boolean,
  "payable": _.Boolean,
  "stateMutability": pl["abi_mutability"],
})

pl["cont_abi"] = _.Array (pl["func_abi"])

pl["db_func"] = _.RecordType({
  "_id": pl["mongoid"],
  "pclassid": pl["mongoid"],
  "pfunction": _.RecordType({
    "signature": _.String,
    "gapi": pl["func_abi"],
    "sources": _.StrMap (_.String),
    "graph": _.Any
  }),
  // "tags": _.Array (_.String),
  // "categories": _.StrMap (_.Any),
  // "categories": _.Any,
  "timestamp": _.String
})



pl["db_funcs"]  = _.Array (pl["db_func"])
pl["id_funcs"] = _.StrMap (pl["db_func"])


pl["runtime_graph"] = _.RecordType({
  "rich_graph": pl["rich_graph"],
  "runnable_graph":  _.Array (_.Array (_.Number)),
  "context": pl["id_funcs"],
  "runtime": _.StrMap ( pl["runtime"])
})


  pipejs.pl = pl;
  //pipejs.try = {};
  pipejs._currentPoint= {x: 0, y: 1};
  pipejs.indexed_func= {};

  pipejs.index_funcs= def ('index_funcs') ({})
    ([pl["db_funcs"], pl["id_funcs"]])
    (db_funcs => {
      let obj_funcs = {}
      S.map (x => obj_funcs[x._id] = x) (db_funcs)
      return obj_funcs;
    });

  pipejs.add_const= def ('add_const') ({})
    ([pl["graph"], _.Object, pl["graph"]])
    (graph =>  edge => variable => {
      let graph2 = JSON.parse(JSON.stringify(graph))
      settings.runstep ++
      graph2.r[settings.runstep] = variable
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
    ([pl["graph"], _.Number, pl["graph"]])
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
      S.map (
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
    S.map (n => {if (n < 4000 ) only_outputs = false }) (unvisited)

    S.map (n => {
      if ((pipejs.inputNodesAreVisited(gf.n[n], visited)  || pipejs.inputNodesAreDefined(gf.n[n], gf.r, level)) && (level >0 || n > 2000)){
        S.flip (visitors) ({node: gf.n[n] , level: level, row: row, context: pipejs.indexed_func})
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
    S.map (
      n => {
        for (let i = 1 ; i <=context[n.id].pfunction.gapi.outputs.length; i++){
          if (!(""+i in n.out) && n.id != settings.id) {
            let no = {
              i: step_out,
              svg_id: "",
              id: settings.id+step_out,
              in:{"1": [n.i, i]},
              out:{},
              position: {x: 0, y:0} ,
              edges: []
            }
            let typing  = context[n.id].pfunction.gapi.outputs[i-1]
            // console.log(context[n.id].pfunction.gapi.outputs, i)
            pipejs.indexed_func[settings.id+step_out]  = {"_id": settings.id + step_out,"pclassid":"5c95397d4212cc40afeec914","pfunction":{"signature":"io", "sources": {"javascript":"f=>f"}, "graph":{}, "gapi":{"constant":true,"inputs":[{"name":typing.name,"type": typing.type}],"name":"io","outputs":[{"name":"o","type": typing.type}],"payable":false,"stateMutability":"view","type":"function"},"chainids":["3"]},"categories":{"tags":["Pipeline Demo Package","ethpm","pipeline","ethpm"]},"timestamp":"2019-03-22T14:38:36.112Z", graph: {}}
            added_nodes[step_out]  = no
            added_edges.push([n.i, i, step_out, 1])
            n.out[""+i]= [[step_out, 1]]
            step_out++;
          }
        }

        for (let i = 1 ; i <=context[n.id].pfunction.gapi.inputs.length; i++){
          if (!(""+i in n.in) && n.id != settings.id) {
            let on = {edges: [], i: step_in, id: settings.id +step_in,
            in:{}, out:{"1":[[n.i, i]]}, position: {x: 0, y:0}, svg_id: ""}
            let typing  = context[n.id].pfunction.gapi.inputs[i-1]
            // console.log(context[n.id].pfunction.gapi.inputs, i)
            pipejs.indexed_func[settings.id + step_in]  = {"_id": settings.id +step_in,"pclassid":"5c95397d4212cc40afeec914","pfunction":{"signature":"io", "sources": {"javascript":"f=>f"},"graph":{}, "gapi":{"constant":true,"inputs":[{"name": "i","type": typing.type}],"name":"io","outputs":[{"name":typing.name,"type": typing.type}],"payable":false,"stateMutability":"view","type":"function"},"chainids":["3"]},"categories":{"tags":["Pipeline Demo Package","ethpm","pipeline","ethpm"]},"timestamp":"2019-03-22T14:38:36.112Z", graph: {}}
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

      S.map (x => {
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
      let graph3 =  pipejs.positionNodes(graph2, S.keys(graph2.n), ["0"], visitors, 0)
      // console.log("graph3",graph3)
      graph2.init  = graph1
      return graph2
    });

  pipejs.make_runtime=  def ('make_runtime') ({})
    ([pl["id_funcs"], pl["rich_graph"], pl["runtime_graph"]])
    (context  => rich_graph => {
      let rows = []
      let rich_graph2 = JSON.parse(JSON.stringify(rich_graph))
      for (let x in rich_graph2.n) {
        // console.log("x", rich_graph.n[x], rows[rich_graph.n[x].position.y])
          if ( rows[rich_graph2.n[x].position.y] === undefined) rows[rich_graph2.n[x].position.y] = []
        rows[rich_graph2.n[x].position.y].push(parseInt(x))
        }
        // console.log(JSON.stringify(rows))
        //S.map (x  => S.map (y => rows[x][y] = 100) (x)) (rows)
      // console.log(JSON.stringify(rows))
      return {
        "rich_graph": rich_graph2,
        "runnable_graph": rows,
        "context": context,
        "runtime": { "0": rich_graph2.r}
      }
    });

  pipejs.run_graph=  def ('run_graph') ({})
    ([pl["runtime_graph"], _.Any, _.Any])
    ( runtime_graph => ins => {
      let outs = [], ndx = 0, node
      let func, args, ans;
      let arr_ins = Object.values(ins)


      let runtime = JSON.parse(JSON.stringify(runtime_graph.runtime))
      let runnable = JSON.parse(JSON.stringify(runtime_graph.runnable_graph))
      let rich = JSON.parse(JSON.stringify(runtime_graph.rich_graph))

      //// console.log("gkkgg", arr_ins)
      S.map (x => {
        //console.log("in item gkkgg", x, ndx, arr_ins, arr_ins[ndx], ""+x)
        runtime[""+x] = [arr_ins[ndx]]
        //console.log("vvvv", JSON.parse(JSON.stringify(runtime)), runtime[""+x])
        ndx++
      }) (runnable[0])

      //console.log(ins, arr_ins, runnable)
      //console.log("gkkgg ins", arr_ins, runnable, JSON.parse(JSON.stringify(runtime)))
      ndx = 0
      S.map (x => {
        //console.log(x,"x")
        //if (ndx !== 0) {
        S.map (y => {
        node  = rich.n[""+y]
        let contxt = runtime_graph.context[node.id]
        let source = contxt.pfunction.sources.javascript

        let args=[]
        //console.log("node.in.length", node.in,  node,"1" in node.in)

        if  ("1" in node.in){
          let port  =  0
          S.map (x1=> {
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
              ans = S.unchecked.reduce (S.I)
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
    ([pl["id_funcs"], pl["graph"], _.Object, _.Any])
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

let cast = type => obj => {
  const names = Object.keys (type.types);
  const types = Object.values (type.types);
  const values = Object.values (obj);
  return values.length === types.length &&
         values.every ((v, idx) => S.is (types[idx]) (v))
         ? S.unchecked.fromPairs (S.unchecked.zip (names) (values))
         : S.Nothing;
};

let env = _.env;

let def = _.create ({
  checkTypes: true,
  env,
});

let like = t1 => t2 =>
  t1.type === 'RECORD' &&
  t2.type === 'RECORD' &&
  S.equals (Object.values (t1.types))
           (Object.values (t2.types));

export default pipe;
