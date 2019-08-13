/* eslint-disable */
import SVG from 'svg.js';
import 'svg.draggable.js';
import './svg.foreignobject';
import * as FIXTURES from './fixtures.js';

const R = require('ramda');


const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
const UNNAMED_INPUT = 'i_unnamed';
const UNNAMED_OUTPUT = 'o_unnamed';
const WEI_VALUE  = 'wei_value';
const DEPLOYMENT_VAR = 'deployment';

function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }

    return result;
}

let pipe2 = {};
let grIndex = 0
let langs ={}
langs['abi'] = [];
let types = {}

let funcs; let gra = {}; let gre;
// const graphs = [{ nodes: {}, edges: {} }];

let draw;
let edges;
let g;
const xr = 32;
let startDrop; let endDrop;
let containsEvent = {};

const graph = {"n": [], "e": []};

export default class Graphs {

    constructor(functions, callbacks){
        // console.log("constr", functions)
        pipe2.functions = functions.concat(FIXTURES.ports.map(port => {
            port.container = FIXTURES.containers[0];
            return port;
        }));
        pipe2.graphs = []
        pipe2.draws =[]
        pipe2.domids =[]
        pipe2.incNodes =[]
        pipe2.rgraphs = []
        pipe2.cgraphs = []
        this.idGen = 0
        pipe2.callbacks = {
            onGraphChange: callbacks.onGraphChange,
            onGraphFunctionRemove: callbacks.onGraphFunctionRemove,
        };
    }

    getGraphs() {
        return pipe2.graphs;
    }
    getPipe(){
        return pipe2;
    }

    addGraph(domid) {
        // console.log("addGr", domid)
        pipe2.domids.push(domid)
        pipe2.draws.push(SVG(domid))
        pipe2.incNodes.push(0)
        pipe2.graphs.push({n:{}, e:[]})
        pipe2.rgraphs.push({})
        pipe2.cgraphs.push({})

    }

    setGraphs(igraphs) {
        pipe2.graphs = igraphs;
        this.idGen = igraphs.length;
        proc1();
    }

    addFunction( funcData, grIndex1){
        console.log("add", funcData, grIndex1)
        // console.log("gr", pipe2)
        if (funcData.pfunction.gapi.payable) {
            funcData.pfunction.gapi.inputs.push({
                name: `${funcData.pfunction.gapi.name}_${this.idGen}_${WEI_VALUE}`,
                type: 'uint256'
            });
        }
        grIndex = grIndex1
        pipe2.functions.push(funcData)
        pipe2.graphs[grIndex].n[this.idGen] = {
            i: this.idGen,
            id: funcData._id
        }
        this.idGen++


        proc1()



    }

    activeTab(ndx){
        grIndex = ndx
        // console.log(ndx)
    }

    deleteGraph(index) {
        delete pipe2.draws[index]

    }

    getSource(lang) {
        return langs[lang]
    }

    containsEvent(index) {
        return containsEvent[index];
    }
}




// Expects functions as an array of pfunction objects, each with a `container` key for the pclass.
const loadAll = function loadAll(domids, functions, graphs) {
    pipe2.functions = functions.concat(FIXTURES.ports.map(port => {
        port.container = FIXTURES.containers[0];
        return port;
    }));
    pipe2.graphs = graphs;
    // console.log('pipecanvaslib.pipe2.functions', pipe2.functions);
    // console.log('pipecanvaslib.pipe2.graph', JSON.stringify(pipe2.graph));

    // return true;
    if (draw == undefined) {
        draw = SVG(domids[gndx]);
        edges = draw.group();
    }

    proc1();
};

function find2(idVal, obj3) {
    // console.log(obj3)
    if (obj3 && '_id' in obj3 && obj3._id == idVal) return obj3;
    return false;
}


const findById = R.converge(
    R.find,
    [R.pipe(R.nthArg(0), R.propEq('_id')), R.nthArg(1)]
);

const findBy = R.converge(
    R.find,
    [R.pipe(R.nthArg(1), R.propEq(R.nthArg(0))), R.nthArg(2)],
);

const findByI = R.converge(
    R.find,
    [R.pipe(R.nthArg(0), R.propEq('i')), R.nthArg(1)]
);


const filterWithKeys = (pred, obj) => R.pipe(
    R.toPairs,
    R.filter(R.apply(pred)),
    R.fromPairs,
)(obj);

let gr;

function menu() {
    const m = pipe2.draws[grIndex].group();
    const c = m.circle(15).center(0, 0);
    m.click(e => proc1());
}

function getPort(funcObj, io, ndx) {
    // console.log(funcObj, io, ndx)
    let y = 0;
    if (io === 'out') {
        y = xr;
    }
    if (ndx === 0 ) {
        if (io === 'out') return { x: 0, y: xr - 10 };
        return { x: 0, y: 10};
    }

    return { x: ((ndx) * xr - 0.5 * xr), y };

}

function proc1() {
    // console.log(pipe2.graphs[grIndex]);
    pipe2.cgraphs[grIndex]= R.clone(pipe2.graphs[grIndex]);
    //gre = R.clone(pipe2.graphs[grIndex].e);

    R.map((x) => {
        x.links = { in: {}, out: {} };
        x.state ={}
    }, pipe2.cgraphs[grIndex].n);

    // console.log(pipe2.graphs[grIndex]);
    // console.log(gre);




    // bring edges data inside nodes
    R.map((x) => {
        // console.log(JSON.stringify(pipe2.cgraphs[grIndex].n), x);
        //const o = findByI(x[0], pipe2.graphs[grIndex].n);
        if (x === undefined) return
        let o = pipe2.cgraphs[grIndex].n[x[0]]
        // console.log(o,x);
        let s = x[2];
        let s2 = {};
        s2[s] = x[3];
        //console.log(o.links)
        if (o.links.out[x[1]]=== undefined){
            o.links.out[x[1]] = []
        }
        // console.log(o)

        o.links.out[x[1]].push(s2);
        //const o2 = findByI(x[2], pipe2.graphs[grIndex].n);
        let o2 = pipe2.cgraphs[grIndex].n[x[2]]
        s = x[0];
        s2 = {};
        s2[s] = x[1];
        if (o2.links.in[x[3]]=== undefined){
            o2.links.in[x[3]] = []
        }
        o2.links.in[x[3]].push(s2);
        return x;

    }, pipe2.graphs[grIndex].e);


    funcs = pipe2.functions;

    // gr is the nodes + function data
    pipe2.cgraphs[grIndex].n = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), pipe2.cgraphs[grIndex].n); // pipe2.graph.n

    //console.log(Object.assign({},pipe2.cgraphs[grIndex].n))

    //console.log(JSON.stringify(pipe2.cgraphs[grIndex].n))
    delete containsEvent[grIndex];
    // events reverse i/o
    R.mapObjIndexed((x, key, all) => {
        if (x.func.pfunction.gapi.type == "event"){
            containsEvent[grIndex] = true;
            if (x.func.pfunction.gapi.outputs === undefined) {
                x.func.pfunction.gapi.outputs = []
            }
            if (!x.func.pfunction.reversed) {
                let ins = JSON.parse(JSON.stringify(x.func.pfunction.gapi.inputs))
                let outs = JSON.parse(JSON.stringify(x.func.pfunction.gapi.outputs))
                x.func.pfunction.gapi.outputs = ins
                x.func.pfunction.gapi.inputs = outs
                x.func.pfunction.reversed = true;
            }
        }
    }, pipe2.cgraphs[grIndex].n);





  //return true;

    // add ports
    proc4(pipe2.cgraphs[grIndex].n);






    // console.log("gr after proc4", pipe2.cgraphs[grIndex].n)

    // gr is the nodes + function data


    // console.log(pipe2.cgraphs[grIndex])


    gra = {}
    // re-index
    R.mapObjIndexed((x, key, all) => {
        gra[x.i] = x;
    }, pipe2.cgraphs[grIndex].n);

    pipe2.cgraphs[grIndex].n = gra

    // console.log("gr after proc4 1", pipe2.cgraphs[grIndex].n)


    // pipe2.cgraphs[grIndex].n = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), pipe2.cgraphs[grIndex].n);

    // console.log("gr after proc4 2", pipe2.cgraphs[grIndex].n)




    //console.log("grrrrra",JSON.stringify(gra))
    // console.log("gra",gra)
    //if (window.stop) return true;

    proc2(pipe2.cgraphs[grIndex].n);




    // console.log(funcs)

    // console.log(cont)
}

let render = {};

function proc2(gr) {
    //render = {};
    // console.log(grIndex, pipe2.draws[grIndex])
    pipe2.draws[grIndex].clear();
    edges = pipe2.draws[grIndex].group();
    menu();

    // proc4(gr)
    // console.log('proc2', gr)
    // return true;



    // console.log("gr",gr)
    //console.log("grrrrr",JSON.stringify(gr))

    // draw nodes
    R.mapObjIndexed((x, key, all) => {
    //console.log("grrrrra",JSON.stringify(x))
    // graph.nodes[x.i] ={ render:new FuncBox( x ), links: { in: R.repeat("", x.func.pfunction.gapi.inputs.length), out:R.repeat("", "outputs" in x.func.pfunction.gapi? x.func.pfunction.gapi.outputs.length: [])}}
        //x.state = {}
        // console.log(JSON.stringify(x))
        pipe2.rgraphs[grIndex][x.i] = new FuncBox(x);
        //gra[x.i] = x;
        let outl = 0;
        if (x.func.pfunction.gapi.outputs !== undefined) {
            outl = x.func.pfunction.gapi.outputs.length;
        }
        //const w = Math.max(x.func.pfunction.gapi.inputs.length, outl);
        //g.setNode(x.i, { label: x.i, width: w * xr, height: xr });
    // gra[x.i] = {links: x.links, func: x.func}
    }, gr);



    //console.log("grrrrr",JSON.stringify(gr))

    //console.log("grrrrra",JSON.stringify(gra))
    // console.log("gra",gra)


    // return true

    proc_e(gr);



    pipe2.cgraphs[grIndex].n = gr

    let visitors = [
        new GraphVisitor(visOptions.graphRender),
        new GraphVisitor(visOptions.solidity),
        new GraphVisitor(visOptions.js),
    ]

    R.map( (x)=>{
        if (x.ops.type == "source") {
            x.genContainer(pipe2.cgraphs)
        }
    },visitors)

    let ndx = grIndex

    R.mapObjIndexed((x, key, all) => {
        let pg = x.n
        let n={}





        R.mapObjIndexed((x1, key1, all1) => {
            if (x1.func.pfunction.gapi.name == 'PortIn') n[key1] = true;
            if (x1.func.pfunction.gapi.inputs.length === 0) n[key1] = true;
        }, pg)
        // console.log("pg",pg)
        grIndex = parseInt(key)


        proc_d(pg, [{}], 0, {}, n, visitors);

        R.map( (x)=>{
            if (x.ops.type == "source") {
                x.genGraph(pg)
            }
            if (x.ops.type == "visual") {
                x.setGraph(pg)
            }
        },visitors)





    },pipe2.cgraphs)

    grIndex = ndx




/*
    const pg = clone(gr);
    incre = 1;
    let n={}

    R.mapObjIndexed((x, key, all) => {
        if (x.func.pfunction.gapi.name == 'PortIn') n[key] = true;
    }, pg)

    let visitors = [ new GraphVisitor(visOptions.graphRender), new GraphVisitor(visOptions.solidity)]



    //console.log(n)
    proc_d(pg, [{}], 0, {}, n, visitors);
*/
    R.map( (x)=>{
        if (x.ops.type == "source") {
            // console.log(x.getGen())
            langs[x.ops.lang] = x.getGen()
        }
        if (x.ops.type == "visual") {
            langs["graphs"] = pipe2.graphs
        }


    },visitors)

    pipe2.callbacks.onGraphChange()
}

// draw edges
function proc_e(gr) {
    // graph.nodes = pipe2.graph.n
    //graph.nodes = gr;
    // console.log(gr)
    // console.log(gre)


    R.mapObjIndexed((x, key, all) => {
    // x.ndx = key
    // console.log(x,graph.nodes)
    // console.log(graph.nodes, x[0], x[2])
        const n1 = pipe2.rgraphs[grIndex][x[0]];
        const n2 = pipe2.rgraphs[grIndex][x[2]];
        // console.log(n1, n2)
        // console.log(getPort(n1,"out", x[1]), getPort(n2, "in", x[3]))
        // alert("j")
        // console.log(n1,n2,x)

        const link = new Smooth(n1, n2, x[1], x[3]);
        pipe2.rgraphs[grIndex][x[0]].links.out.push(link);
        pipe2.rgraphs[grIndex][x[2]].links.in.push(link);

        /*
        let o1 = {}
        o1[x[2]] = x[3]
        let o2 = {}
        o2[x[0]] = x[1]

        gr[x[0]].links.out[x[1]] = o1;
        gr[x[0]].links.in[x[3]] = o2;
        */
        // console.log(n1.obj.i,   n2.obj.i)
        //g.setEdge(n1.i, n2.i);
    }, pipe2.cgraphs[grIndex].e);
/*
    R.map((x) => {
        console.log(JSON.stringify(x.links), x)
    }, pipe2.cgraphs[grIndex].n);
*/
}


function clone(obj) {
    const out = {};
    R.mapObjIndexed((x, key, all) => {
        out[key] = x;
    }, obj);
    return out;
}

var incre = 1;




function proc_d(grf, tabl, row, known, next, vis) {
    //console.log("proc_D grf: ", grf, "row",row,"known", known, "next",next)
    if (Object.keys(next).length == 0) return
    tabl[row] = {}
    let next1={}, known1 = {}

    incre = incre+1;

    R.mapObjIndexed((x, key, all) => {
        let runnable = true
        R.mapObjIndexed((x1, key1, all1) => {
            //const n1 = Object.keys(x1)[0];
            //console.log( key,x1, Object.keys(x1),n1)
            R.mapObjIndexed((x2, key2, all2) => {

                const n1 = Object.keys(x2)[0];
                // console.log( "n1",n1)
                if ((known[n1] === undefined || known[n1] === false) && parseInt(key1) > 0){
                    runnable = false;
                }
            }, x1)

        }, grf[parseInt(key)].links.in);

        if (runnable) {
            R.map( (x)=>{
                if (x.ops.type == "source") {
                    x.genFunc(grf[parseInt(key)])
                }
                if (x.ops.type == "visual") {
                    x.renderFunc(grf[parseInt(key)], row)
                }

            },vis)
            known1[key] = true

            R.mapObjIndexed((x2, key2, all2) => {
                // console.log("next", x2, key2, all2)
                R.mapObjIndexed((x3, key3, all3) => {
                    next1[Object.keys(x3)[0]] = true;
                }, x2)

            }, grf[parseInt(key)].links.out);

        }
        delete next[parseInt(key)]


    }, next);

    next1 = Object.assign(next,next1)
    known1 = Object.assign(known,known1)




    //console.log(tabl, known, grf, Object.assign(next,next1));
    // console.log('proc_d2', grf); if (incre < 5)

    proc_d(grf, tabl, row + 1, known1, next1, vis);
}


function proc3() {
    const n = g.nodes();
    R.map((x) => {
        const t = gra[x].render;
        // console.log(t)
        const o = g.node(x);
        // console.log(o)
        t.redraw(o.x, o.y);
    }, n);
}

function addPortFunc(i, o1, state1){
    let out = { i: i, id: '5bc59e192817116e84bdd831', links: { in: {}, "out": { 1: [o1] } } , state: state1};

    out.func = findById(out.id, pipe2.functions)
    let out2 = JSON.parse(JSON.stringify(out))
    // let out2 = out

    out2.func.pfunction.gapi.outputs[0] = {name: state1.name, type: state1.type}
    // console.log('addPortFunc', out.state)
    // console.log('addPortFunc', JSON.stringify(out2))
    return out2

}

function addPortOut(i, o1, state1){
    let out = { i: i, id: '5bc59e192817116e84bdd830', links: { in: { 1: [o1]}, out: {}  }, state: state1};
    out.func = findById(out.id, pipe2.functions)
    let out2 = JSON.parse(JSON.stringify(out))
    return out2
}

// add new nodes for ports
function proc4(gr) {

    R.mapObjIndexed((x, key, all) => {
        // console.log("pp",JSON.stringify(x))
        if (x.func.pfunction.gapi.type == "port" && x.i <3000) {
            let o1 = {}
            o1[x.i] = parseInt(key) + 1
            let link = x.links.out[1][0]
            let kkey = Object.keys(link)[0]
            // console.log(kkey, link, pipe2.cgraphs[grIndex].n[kkey])
            let port = pipe2.cgraphs[grIndex].n[kkey].func.pfunction.gapi.inputs[link[parseInt(kkey)]-1]
            // console.log("p",port, pipe2.cgraphs[grIndex].n[kkey].func.pfunction.gapi.inputs, link[parseInt(kkey)])
            let name = (port.name !== undefined)? port.name : ""
            let state1 = {name: "i_"+name+"_"+kkey, type: port.type, value: undefined}
            x.state = state1;
            // console.log("pp",x,"state",state1)


        }


    }, gr);


    // console.log(pipe2.graph.e)
    // return true
    // console.log(gr)
    let incr = 3000;
    R.map((x) => {
        let x_incr = incr;
        //if (x.func.pfunction.gapi.type == "port") return
        R.mapObjIndexed((x1, key, all) => {
            // console.log(x1)
            // console.log(x.links.in[parseInt(key) + 1], key)
            if (x.links.in[parseInt(key) + 1] === undefined) {
                incr++;
                // console.log(key)
                let o1 = {}
                o1[x.i] = parseInt(key) + 1
                // let t = {i: inc, func: {gapi: {inputs:[],outputs:[{ name: "out", type:x1.type}], name:"PortIn"}, container:{name:"PipeOS"}}, links:{in:{},out:{0:x.i}}}
                let name = (x1.name !== undefined)? x1.name : ""
                let state1 = {name: "i_"+name+"_"+x.i, type: x1.type, value: undefined}
                const t = addPortFunc(incr, o1, state1)
                //const t = { i: incr, id: '5bc59e192817116e84bdd831', links: { in: {}, out: { 1: o1 } } , state: state};
                gr[incr] = t;
                x.state[incr-x_incr] = state1;
                /*

                graph.nodes[inc] ={ render:new FuncBox( t ), links: { in: R.repeat("", t.func.pfunction.gapi.inputs.length), out:R.repeat("", "outputs" in t.func.pfunction.gapi? t.func.pfunction.gapi.outputs.length: [])}}

*/
                //const int = {};
                //int[incr] = 1;
                if (x.links.in[parseInt(key)+1]=== undefined){
                    x.links.in[parseInt(key)+1] = []
                }
                let s2 = {};
                s2[incr] = 1;
                x.links.in[parseInt(key)+1].push(s2);
                pipe2.cgraphs[grIndex].e.push([incr, 1, x.i, parseInt(key) + 1]);
                // alert(key)
            }
        }, x.func.pfunction.gapi.inputs);

        R.mapObjIndexed((x2, key, all) => {
            // console.log(x.links.out[parseInt(key) + 1], key)
            if (x.links.out[parseInt(key) + 1] === undefined) {
                incr++;
                // console.log(key)
                // t ={i: inc, func: {gapi: {inputs:[{ name: "in", type:x2.type}],outputs:[], name:"PortOut"}, container:{name:"PipeOS"}}, links:{in:{0:x.i},out:{}}}
                let o1 = {}
                o1[x.i] = parseInt(key) + 1
                let name = (x2.name !== undefined)? x2.name : ""
                let state = {name: "o_"+name+"_"+x.i, type: x2.type, value: undefined}
                const t = addPortOut(incr, o1, state)
                gr[incr] = t;
                // console.log(pipe2.graph.e)
                //const int = {};
                //int[incr] = 1;
                //x.links.out[parseInt(key)+1] = int;

                if (x.links.out[parseInt(key)+1]=== undefined){
                    x.links.out[parseInt(key)+1] = []
                }
                let s2 = {};
                s2[incr] = 1;
                x.links.out[parseInt(key)+1].push(s2);

                pipe2.cgraphs[grIndex].e.push([x.i, parseInt(key) + 1, incr, 1]);
                // alert(key)
            }
        }, x.func.pfunction.gapi.outputs);
    }, gr);

    // add optionaal data
    // procDat(gr, incr)

    //console.log(JSON.stringify(gr))
    //console.log(JSON.stringify(gre))

    // console.log('-----gr after addPort', gr)

    // proc_e()
}

function procDat(gr, incr){
    let addl = [
        '5bc59e192817116e84bdd832',
        '5bc59e192817116e84bdd833',
        '5bc59e192817116e84bdd834'
    ]

    R.map((x)=>{
        incr++;
        let t = {i:incr, id: x, links:{in:[], out:[]}}
        t.func = findById(t.id, pipe2.functions)
        gr[incr]= t

    }, addl)


}


class Smooth {
    constructor(point1, point2, diff1, diff2) {
        this.point1 = point1;
        this.point2 = point2;
        this.id1 = point1.obj.i;
        this.id2 = point2.obj.i;
        this.port1 = diff1;
        this.port2 = diff2;
        // console.log(point1, point2)
        let state1 = {name: "o_"+point1.obj.func.pfunction.gapi.outputs[diff1-1].name+"_"+point1.obj.i, type: point1.obj.func.pfunction.gapi.outputs[diff1-1].type, value: undefined}
        // console.log(point1.obj.state, diff1, JSON.stringify(point1.obj.state[diff1]))
        let state = point1.obj.state[diff1] ? point1.obj.state[diff1] : point1.obj.state;
        // console.log('smooth state', JSON.stringify(state))
        // console.log('smooth state1', JSON.stringify(state1))
        if (point1.obj.func.pfunction.gapi.type === 'port') {
            point2.obj.state[diff2] = state
        } else {
            point2.obj.state[diff2] = state1
        }
        // console.log('smooth final state', JSON.stringify(point2.obj.state[diff2]))
        this.diff1 = getPort(point1, 'out', diff1);
        const dff2 = getPort(point2, 'in', diff2);
        this.diff2 = { x: dff2.x, y: dff2.y - 6 };
        this.dir = 1;


        this.draw();
    }

    draw() {
        // console.log(this)
        const arrowSize = 6;
        // if(this.point1.y > this.point2.y){ this.dir = -1 }
        const shapness = xr / 4;

        const p1 = { x: this.point1.x + this.diff1.x, y: this.point1.y + this.diff1.y };
        const p2 = { x: this.point2.x + this.diff2.x, y: this.point2.y + this.diff2.y };
        const middle = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
        const self = this;


        if (!this.element) {
            // console.log(edges)
            this.element = edges.group();
            this.path = this.element.path();

            this.path.marker('end', arrowSize, arrowSize, (add) => {
                add.path(`M0,0 L${arrowSize},${arrowSize / 2} 0,${arrowSize} z`).attr({ 'stroke-width': 0, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
            });

            this.mid = this.element.circle(6).cx(middle.x).cy(middle.y);
            this.element.dblclick(() => {
                self.remove();
                return proc1();
            });
        }


        // console.log(this)
        this.path.plot([
            ['M', p1.x, p1.y],
            ['C', p1.x, p1.y + (shapness * this.dir), p1.x, middle.y, middle.x, middle.y],
            ['C', p2.x, middle.y, p2.x, p2.y - (shapness * this.dir) - arrowSize, p2.x, p2.y],
        ]).attr({
            fill: 'none',
            stroke: '#555',
            'stroke-width': 1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        });

        this.mid.cx(middle.x).cy(middle.y);
    }

    redraw(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;

        this.draw();
    }

    remove() {
        this.element.remove();
        // console.log(pipe2.graph.e);
        // console.log([this.id1, this.port1, this.id2, this.port2]);
        const self = this;
        let key1 = undefined
        R.mapObjIndexed((x, key, all) => {
            console.log(self.id1, self.port1, self.id2, self.port2, key, x);
            if (x[0] == self.id1 && x[1] == self.port1 && x[2] == self.id2 && x[3] == self.port2) {
                // delete pipe2.graph.e[parseInt(key)]
                pipe2.graphs[grIndex].e.splice(parseInt(key), 1);
                key1 = key
            }
            // pipe2.graph.e.splice(ndx, 1);
        }, pipe2.graphs[grIndex].e);

        if (key1 !== undefined) {
            delete pipe2.graphs[grIndex].e[key1]
        }
    }
}


class FuncBox {
    constructor(obj) {
        // console.log(obj)
        this.obj = obj;
        this.r = 5;
        this.id = obj.i;

        this.links = { out: [], in: [] };
        const self = this;
        this.el = pipe2.draws[grIndex].group();
        this.el.attr('id', obj.i);

        // console.log(this.obj);
        const i = 'inputs' in this.obj.func.pfunction.gapi ? this.obj.func.pfunction.gapi.inputs.length : 0;
        const o = 'outputs' in this.obj.func.pfunction.gapi ? this.obj.func.pfunction.gapi.outputs.length : 0;
        const w = Math.max(i, o);

        const h = xr;
        const clas = 's_content';
        const txt = `${this.obj.func.pclass.name}\n${this.obj.func.pfunction.gapi.name}`;
        this.el.rect(xr * w, xr).attr({
            rx: this.r,
            ry: this.r,
            fill: '#ddd',
            'stroke-width': 1,
            opacity: 0.9,
        }).addClass(this.obj.func.styleClasses);
        this.text = this.el.foreignObject(w * xr, h * 2);
        const id = this.text.attr('id');
        this.text.appendChild('div', { id: `${id}_div` });

        document.getElementById(`${id}_div`).innerHTML = `<div>${txt}</div>`;
        document.getElementById(`${id}_div`).className = clas;

        this.x = Math.random() * 5 * xr;
        this.y = Math.random() * 5 * xr;
        this.note = this.el.text('');
        this.cover = this.el.rect((w + 1) * xr, h * 2).attr({opacity:0})
        this.el.move(this.x, this.y);

        this.el.dblclick(() => {
            self.el.remove();
            let removedNodes = [];
            let keys1 = R.mapObjIndexed((x, key, all) => {
                if (x.i == self.obj.i) return key
            }, pipe2.graphs[grIndex].n);

            R.map((x)=>{
                if (x) {
                    removedNodes.push(pipe2.graphs[grIndex].n[parseInt(x)]);
                }
                delete pipe2.graphs[grIndex].n[parseInt(x)];
            }, keys1)

            let keys2 = R.mapObjIndexed((x, key, all) => {
                if (x[0] == self.obj.i || x[2] == self.obj.i) return key
            }, pipe2.graphs[grIndex].e);

            R.map((x)=>{
                delete pipe2.graphs[grIndex].e[parseInt(x)];
            }, keys2)

            pipe2.callbacks.onGraphFunctionRemove(grIndex, removedNodes);

            return proc1();
        });

        this.el.draggable();

        if (self.obj.func.pfunction.gapi.type != 'port') {
            let point = getPort(self.obj, 'in', 0);
            const port_i = self.el.circle(10).center(point.x, point.y).attr({opacity:0.08});
            port_i.mouseover(() => {
                endDrop = [self.obj.i, 0];
            });
            port_i.mouseout(() => {
                endDrop = false;
            });

            point = getPort(self.obj, 'out', 0);
            const port_o = self.el.circle(10).center(point.x, point.y).attr({"opacity":0.08});

            // drag port out impl
            /*
            port_o.draggable().on('beforedrag', function (e) {
                // e.preventDefault()
                // e.stopPropagation()
                // no other events are bound
                const p = e.detail.event;
                // console.log(p, p.offsetX, p.offsetY, draw);

                this.obj = draw.circle(12).center(p.offsetX, p.offsetY).back();
                // drag was completely prevented
            });
            port_o.on('dragend', (e) => {
                // console.log(e);
                const node = self.obj.i;
                startDrop = [node, 0];
                console.log(startDrop, endDrop);
                alert("dragend")
                if (endDrop != false) {
                    // console.log(startDrop, endDrop);
                    const edge = startDrop.concat(endDrop);
                    // console.log(edge);
                    pipe2.graph.e.push(edge);
                    // console.log(pipe2.graph.e);
                    return proc1();
                }
            });

            port_o.on('dragmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                console.log("lore")
                const p = e.detail.event;
                this.obj.center(p.offsetX, p.offsetY);
            });

            */


        }




        R.mapObjIndexed((x, key, all) => {
            // console.log(x, key)
            let point = { x: 0, y: 0 };
/*
            if (self.obj.func.pfunction.gapi.type === 'port') {
                point = getPort(self.obj, 'in', parseInt(key));
            } else {

            }
*/
            point = getPort(self.obj, 'in', 1 + parseInt(key));

            // let point = getPort(self.obj, "in", 1+parseInt(key))


            let port = self.el.circle(10).center(point.x, point.y).attr({"fill-opacity":0.5});
            self.el.text(x.name).attr({ 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'Roboto' }).move(point.x - 8, point.y - 12).transform({ rotation: -30 });


            if (types[x.type] === undefined){
                types[x.type] = []

            }

            types[x.type].push(port)




            port.mouseover(() => {
                self.note.text(x.type);
                const node = self.obj.i;
                endDrop = [node, parseInt(key)+1];
            });
            port.mouseout(() => {
                self.note.text('');
                endDrop = false;
            });
        }, this.obj.func.pfunction.gapi.inputs);

        R.mapObjIndexed((x, key, all) => {
            // console.log(x,self.obj,self.obj.func.pfunction.gapi.type,"outputs", key)
            let point = { x: 0, y: 0 };
/*
            if (self.obj.func.pfunction.gapi.type === 'port') {
                point = getPort(self.obj, 'out', parseInt(key));
            } else {
                point = getPort(self.obj, 'out', 1 + parseInt(key));
            }
*/
            point = getPort(self.obj, 'out', 1 + parseInt(key));

            // console.log(point)
            const port = self.el.circle(10).center(point.x, point.y).attr({"fill-opacity":0.9});
            port.mouseover((e) => {
                self.note.text(x.type);
                const node = self.obj.i;
            });
            port.mouseout((e) => {
                self.note.text('');
            });
            self.el.text(x.name).attr({ 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'Roboto' }).move(point.x + 8, point.y).transform({ rotation: -30 });

            port.draggable().on('beforedrag', function (e) {
                // e.preventDefault()
                // e.stopPropagation()
                // no other events are bound
                console.log(x.type, types)
                R.mapObjIndexed((x1, key1, all1) => {
                    //x1.addClass("welcome")
                    x1.attr({fill:"green"})
                },types[x.type])
                const p = e.detail.event;
                // console.log(p, p.offsetX, p.offsetY, draw);


                self.objDrag = pipe2.draws[grIndex].circle(12).attr({fill:"#fcc"}).center(p.offsetX, p.offsetY).back();
                self.objDrag2 = {x: p.offsetX, y:p.offsetY}
                self.objDrag3 = smoothDrag(undefined, self.objDrag2, self.objDrag2)
                // drag was completely prevented
            });
            port.on('dragend', (e) => {
                // console.log(e);
                R.mapObjIndexed((x1, key1, all1) => {
                    //x1.addClass("welcome")
                    x1.attr({fill:"black"})
                },types[x.type])

                const node = self.obj.i;
                startDrop = [node, parseInt(key)+1];
                // console.log(startDrop, endDrop);
                // console.log(gra)
                self.objDrag.remove()
                self.objDrag3.remove()
                if (endDrop !== false && endDrop !== undefined) {
                    // console.log(startDrop, endDrop);
                    let edge = startDrop.concat(endDrop);

                    // console.log(edge);
                    if (startDrop[0] > 2999) {
                        console.log("pipe2.graphs",pipe2.graphs);
                        pipe2.graphs[grIndex].n[startDrop[0]-1000]= { i: startDrop[0]-1000, id: '5bc59e192817116e84bdd831'}
                        console.log(pipe2.cgraphs[grIndex].n[startDrop[0]].links.out[1])
                        R.mapObjIndexed((x, key, all) => {
                            let k = Object.keys(x)[0]
                            pipe2.graphs[grIndex].e.push([startDrop[0]-1000, startDrop[1], k, x[k]]);
                        }, pipe2.cgraphs[grIndex].n[startDrop[0]].links.out[1])
                        edge[0] = edge[0]-1000
                    }

                    pipe2.graphs[grIndex].e.push(edge);

                    return proc1();
                }
            });

            port.on('dragmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const p = e.detail.event;
                self.objDrag.center(p.offsetX, p.offsetY);
                self.objDrag3 = smoothDrag(self.objDrag3, self.objDrag2, {x: p.offsetX, y: p.offsetY})
            });
        }, this.obj.func.pfunction.gapi.outputs);


        /*
         this.el.draggable(function(nx, ny){
             //console.log(nx)
             return {x:Math.round(nx/self.s)*self.s+s/2, y: Math.round(ny/(2*1.5*self.s))*2*self.s*1.5+s*0.75}
         })
        */
        this.el.on('dragmove', self.onDrag);
    }

    onDrag(e) {
        let matrix = e.target.getAttribute('transform');
        const id = e.target.getAttribute('id');

        matrix = matrix.replace('matrix(', '').replace(')', '').split(',');
        const n = pipe2.rgraphs[grIndex][id];
        // console.log(n)
        n.x = parseInt(matrix[4]);
        n.y = parseInt(matrix[5]);


        R.map((l) => {
            // console.log(l)
            l.redraw({ x: parseInt(matrix[4]), y: parseInt(matrix[5]) }, { x: l.point2.x, y: l.point2.y });

            // l.redraw({x:l.point1.x, y:l.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )
        }, n.links.out);

        R.map((k) => {
            // console.log(k)
            k.redraw(
                { x: k.point1.x, y: k.point1.y },
                { x: parseInt(matrix[4]), y: parseInt(matrix[5]) }
            );
        }, n.links.in);
    }

    redraw(lx, ly) {
        this.el.attr({ transform: `matrix(1,0,0,1,${lx},${ly})` });
        const n = this;
        const matrix = [0, 0, 0, 0, lx, ly];
        this.x = lx
        this.y = ly

        R.map((l) => {
            l.redraw(
                { x: parseInt(matrix[4]), y: parseInt(matrix[5]) },
                { x: l.point2.x, y: l.point2.y }
            );
        }, n.links.out);

        R.map((k) => {
            k.redraw(
                { x: k.point1.x, y: k.point1.y },
                { x: parseInt(matrix[4]), y: parseInt(matrix[5]) }
            );
        }, n.links.in);
    }
}

function smoothDrag(obj,init, target){
    const middle = { x: (init.x + target.x) / 2, y: (init.y + target.y) / 2 };
    const shapness = xr / 4;
    const arrowSize = 6;
    const dir = 1
    let out = {}

    if (obj === undefined){
        out = edges.path().attr({
            fill: 'none',
            stroke: '#555',
            'stroke-width': 1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        });
    } else {
        out = obj

    }
    out.plot([
        ['M', init.x, init.y],
        ['C', init.x, init.y + (shapness * dir), init.x, middle.y, middle.x, middle.y],
        ['C', target.x, middle.y, target.x, target.y - (shapness * dir) - arrowSize, target.x, target.y],
    ])
    return out
}

class GraphVisitor{
    constructor(options){
        // language specific templates
        this.ops = options
        // generated source
        this.genC = ""
        // public variables from constructor arguments (contract addresses)
        this.genConstr1 = []
        // code for constructor arguments (contract addresses)
        this.genConstr2 = []
        // code for constructor function, setting the public variables from arguments
        this.genConstr3 = []
        // _ids for constructor arguments in order (pclass ids)
        this.genConstr4 = {}
        this.genG = []
        // function sources that should be made available - js
        this.funcsources = []
        // function definition + initial variable definition
        this.genF = []
        this.genF1 = []
        // function returns
        this.genF2 = []
        // inputs
        this.in = []
        this.abi = {inputs: [], outputs: []}
        this.pointer = xr;
        this.row = -1
        // outputs
        this.out = []
        // outputs
        this.outtype = []
        // outpout code in function definition
        this.returns = []
        this.outports=[]
        this.maxY = 0
        this.minX = {}
        this.isPayable = false
        this.isNotConstant = false
    }

    renderFunc(funcObj, row){
        let startLineY = xr/2
        let startLineX = xr/2
        let w = Math.max(pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.inputs.length, pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.outputs.length)
        if (this.row < row){
            this.row = row
            this.pointer = startLineX
            this.minX[row] = 30000
        }

        if (row !== 0) {
            let anchor = pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].links.in["1"]
            if (Object.keys(anchor).length > 0){
                // console.log(pipe2.rgraphs[grIndex][Object.keys(anchor[0])[0]].x  + xr*w -2, "<", this.minX[row], "pointer",this.pointer)

                let x = pipe2.rgraphs[grIndex][Object.keys(anchor[0])[0]].x

                /*
                if (x  + xr*w -2 < this.minX[row]) {

                    pipe2.rgraphs[grIndex][parseInt(funcObj.i)].redraw(x, placeY);
                    this.minX[row] = x
                    this.pointer += (1 + w) * xr;
                    return;
                }
                */

                this.pointer = Math.max(this.pointer,x)
                // console.log(this.pointer)
            }
        }

        this.minX[row] = Math.min(this.minX[row], this.pointer)
        let placeY = 2*(row + 1) * xr

        if (pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.name == "PortIn"){
            placeY = startLineY
        }



        pipe2.rgraphs[grIndex][parseInt(funcObj.i)].redraw(this.pointer, placeY);

        if (pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.name == "PortOut"){
            this.outports.push(pipe2.rgraphs[grIndex][parseInt(funcObj.i)])
            this.maxY = Math.max(this.maxY, placeY)
        }



        // console.log(pipe2.cgraphs[grIndex])
        this.pointer += (1 + w) * xr;




    }

    genContainer(grs){
        this.genC += this.ops.file_p0
        this.genC += this.ops.proxy
        this.genC += this.ops.contract_p0
        this.genC += this.ops.contract_p1
    }

    setGraph(g){
        this.row = 0
        this.pointer = xr
        R.map((x)=>{
            x.redraw(x.x, this.maxY)
        },this.outports)
    }

    genGraph(g){
        let cannotBeGenerated = Object.values(g).find((funcObject) => {
            if (!funcObject.func.pclass.type) return false;
            let isSolidity = this.ops.pclassType === visOptions.solidity.pclassType;

            return (
                isSolidity && (
                    funcObject.func.pclass.type != this.ops.pclassType ||
                    funcObject.func.pfunction.gapi.type === 'event'
                )
            );
        });
        if (cannotBeGenerated) {
            this.genF[grIndex] = '';
            this.in = [];
            this.out = [];
            this.genConstr1 = [];
            this.genConstr2 = [];
            this.genConstr3 = [];
            return;
        }
        let ini = this.genF[grIndex]

        // Generating pipeline function definition (inputs + modifiers)
        this.genF[grIndex] = this.ops.intro1 + grIndex+ this.ops.intro11 + this.in.join(", ") + this.ops.function_pp1

        // For js we temporarily define free inputs outside the function
        // TODO: replace with user inputs directly in diagram component
        if (this.ops.intro0) {
            this.genConstr1 = this.genConstr1.concat(
                this.in.map((input) => {
                    return this.ops.intro0 + input + this.ops.intro01;
                })
            );
        }

        // Generating pipeline function definition (returns)
        if (this.outtype.length > 0 && this.ops.function_ret0) {
            this.genF[grIndex] = this.genF[grIndex] + this.ops.function_ret0
            this.genF[grIndex] = this.genF[grIndex] + this.returns.join(",")
            this.genF[grIndex] = this.genF[grIndex] +  this.ops.function_ret1
        }

        // Generating pipeline function common variables
        // Attaching function body
        this.genF[grIndex] = this.genF[grIndex] +  this.ops.function_p2 + ini
        // this.genF1[grIndex] =

        // Generating function return
        this.genF2[grIndex] = ""
        if (this.out.length >0){
            this.genF2[grIndex] += this.ops.function_ret2(this.out, grIndex);
        }

        // Code generation ends here
        // Adding function returns
        this.genF[grIndex] += this.genF2[grIndex]

        // Ending event promise if present
        if (containsEvent[grIndex] && this.ops.function_ret3) {
            this.genF[grIndex] += this.ops.function_ret3;
        }

        // Function end
        this.genF[grIndex] += this.ops.function_ret4

        // For js, we also call the function in place
        if (this.ops.function_ret5) {
            this.genF[grIndex] += this.ops.function_ret5 + this.in.join(", ") + this.ops.function_ret51
        }

        // Fill the abi with other fields from the original abis
        Object.values(g).forEach((funcObject) => {
            funcObject.func.pfunction.gapi.inputs.forEach((input) => {
                let name = `i_${input.name}_${funcObject.i}`;
                this.abi.inputs.forEach((pipedin, i) => {
                    if (pipedin.name === name) {
                        this.abi.inputs[i] = Object.assign(
                            JSON.parse(JSON.stringify(input)), this.abi.inputs[i]
                        );
                    }
                });

            });

        });

        langs['abi'][grIndex] = {
            name: `PipedFunction${grIndex}`,
            type: 'function',
            constant: !this.isNotConstant,
            payable: this.isPayable,
            stateMutability: this.isPayable ? 'payable' : (this.isNotConstant ? 'nonpayable' : 'view'),
            inputs: this.abi.inputs,
            outputs:this.abi.outputs,
        }

        this.in= []
        this.out = []
        this.outtype = []
    }

    genFunc(funcObj, row) {
        this.genF[grIndex] = this.genF[grIndex] || '';

        if (funcObj.func.pfunction.gapi.type == "port") {
            this.genFuncIO(funcObj);
            return;
        }
        if (
            ["function", "event"].indexOf(funcObj.func.pfunction.gapi.type) < 0 &&
            !this.ops.validateFunc(funcObj.func.pclass.type, this.ops.pclassType)
        ) {
            return;
        }

        this.genFuncFunction(funcObj, row);
    }

    prepFuncName(name) {
        return name.replace(/:/g, '').replace(/-/g, '');
    }

    genFuncFunction(funcObj, row) {
        let funcName = this.prepFuncName(funcObj.func.pfunction.gapi.name) + "_" + funcObj.i;

        if (funcObj.func.pfunction.gapi.payable) {
            this.isPayable = true;
        }

        if (!funcObj.func.pfunction.gapi.constant) {
            this.isNotConstant = true;
        }

        let source = funcObj.func.pfunction.source;
        if (!source && this.ops.addSource) {
            source = this.ops.addSource(funcName, funcObj);
        }
        if (source) {
            this.funcsources.push(`const ${funcName} = ${source}`);
        }
        // public variables from constructor arguments (contract addresses)
        if (this.ops.genConstr1) {
            this.genConstr1.push(this.ops.genConstr1 + funcName + " ;");
        }
        // code for constructor arguments (contract addresses)
        if (this.ops.genConstr2) {
            this.genConstr2.push(this.ops.genConstr2 + funcName);
        }
        // code for constructor function, setting the public variables from arguments
        if (this.ops.genConstr3) {
            this.genConstr3.push(this.ops.genConstr3(funcName, funcObj));
        }
        // _ids for constructor arguments in order (pclass ids)
        this.genConstr4[funcName] = funcObj.func._id;

        let f = this.genF[grIndex] || "";
        this.genF[grIndex] = f + "\n";
        if (this.ops.sigFunc1) {
            this.genF[grIndex] += this.ops.sigFunc1 + funcObj.func.pfunction.signature + this.ops.sigFunc2 + "\n";
        }

        let inputset = R.mapObjIndexed((x, key, all) => {
            let o = "i_"+x.name+ "_"+funcObj.i
            // console.log('*********', funcObj.state[parseInt(key)+1])
            if (funcObj.state[parseInt(key)+1]){
                o = funcObj.state[parseInt(key)+1].name
            }
            return o
        }, funcObj.func.pfunction.gapi.inputs
        )

        if (this.ops.inputSig) {
            this.genF[grIndex] += this.ops.inputSig(inputset, funcObj);
        }

        this.genF[grIndex] += this.ops.ansProxy(funcName, inputset, funcObj);
        let outAssem = []
        let outputset = R.map((x)=>{
            // console.log(x)
            let name = (x.name !== undefined)? x.name: ""
            outAssem.push("o_" + name + "_"+ funcObj.i+this.ops.assem)
            return this.ops.outputset(x.type, name, funcObj.i);
        }, funcObj.func.pfunction.gapi.outputs)
        let o = ""
        if (funcObj.func.pfunction.gapi.outputs.length > 0) {
            o = this.ops.restFunc(outputset, outAssem, funcName, funcObj);
        }

        this.genF[grIndex] = this.genF[grIndex] + o + "\n";
    }

    genFuncIO(funcObj) {
        if (funcObj.func.pfunction.gapi.name == "PortIn") {
            let input = this.ops.function_in(funcObj.state.type, funcObj.state.name);
            this.in.push(input);
            this.abi.inputs.push({type: funcObj.state.type, name: input});
        }

        if (funcObj.func.pfunction.gapi.name == "PortOut") {
            this.out.push(funcObj.state.name)
            this.outtype.push(this.ops.function_outtype(funcObj.state.type, funcObj.state.name));
            this.returns.push(this.ops.function_returns(funcObj.state.type, funcObj.state.name));
            this.abi.outputs.push({type: funcObj.state.type, name: funcObj.state.name});
        }
    }

    getGen(){
        let out = ""
        //out = out + this.intro1
        //console.log(this.in)
        out = out + this.genC

        if (this.ops.intro0) out += "\n\n";
        out = out + this.genConstr1.join("\n")+ "\n"
        out = out + this.ops.const1 +this.genConstr2.join(", ") + this.ops.const2
        out = out + this.genConstr3.join("\n") + "\n"
        out = out + this.ops.const3

        // Add helper functions - js
        if (this.funcsources.length) {
            out += "\n" + this.funcsources.join(';\n') + ';';
            this.funcsources = [];
        }

        // Add piped functions
        out += this.genF.join("\n")

        // Constructor arguments in order
        langs["constructor"] = this.genConstr4

        //out = out + this.outro
        out = out + this.ops.contract_p2

        return out
    }


}

function callInternalFunctionSolidity(funcName, inputset, funcObj) {
    let payable = '';
    if (funcObj.func.pfunction.gapi.payable) {
        let weiInput = Object.values(inputset).find(input => input.indexOf(WEI_VALUE) > -1);
        payable = `.value(${weiInput})`;
    }
    return `    answer42 = pipe_proxy.proxy${payable}(${funcName}, input42, 400000);\n`;
}

function setCallFuncSignature(inputset, funcObj) {

    let inputs = '';
    if (Object.values(inputset).length > 0) {
        inputs += ', ';
    }
    if (funcObj.func.pfunction.gapi.payable) {
        inputs += Object.values(inputset).filter(input => input.indexOf(WEI_VALUE) < 0).join(", ");
    } else {
        inputs += Object.values(inputset).join(", ");
    }
    return `input42 = abi.encodeWithSelector(signature42${inputs});\n`;
}

function callInternalFunctionJs(funcName, inputset, funcObj) {
    let result = '';
    if (funcObj.func.pfunction.gapi.type === 'event') {
        return result;
    }
    if (funcObj.func.pclass.deployment.pclassi.openapiid) {
        result += `
    baseUrl = ${DEPLOYMENT_VAR}_${funcName};
`
    }
    result += `    result = await ${funcName}(${Object.values(inputset).join(",")});
`;
    return result;
}

function genFuncReturnDestructuring(outputset, outAssem, funcName, funcObj) {
    let outputs = funcObj.func.pfunction.gapi.outputs;
    if (funcObj.func.pfunction.gapi.type === 'function') {
        return outAssem.map((out, i) => `    const ${out} = result.${outputs[i].name || `${UNNAMED_OUTPUT}_i`};`).join('\n');
    }
    if (funcObj.func.pfunction.gapi.type === 'event') {
        let eventName = funcObj.func.pfunction.gapi.name;
        return `
contract_${funcName}.on("${eventName}", async (${Object.values(outAssem).join(",")}, filterObject) => {
`
    }
}

function addSourceJsFromSolidity(funcName, funcObj) {
    if (funcObj.func.pclass.type  != visOptions.solidity.pclassType) {
        return;
    }
    if (funcObj.func.pfunction.gapi.type === 'event') {
        return;
    }
    let payable = '', functionInputs;
    let gapi = funcObj.func.pfunction.gapi;
    let inputs = gapi.inputs.map((input, i) => input.name || `${UNNAMED_INPUT}_i`);
    let outputs = gapi.outputs.map((output, i) => output.name || `${UNNAMED_OUTPUT}_i`);
    let returnValue = '';
    if (outputs.length === 1) {
        returnValue = ` {${outputs[0]}: output}`;
    } else if (outputs.length > 1) {
        returnValue = ` output`;
    }
    functionInputs = inputs.join(', ');
    if (gapi.payable) {
        let index = inputs.findIndex(input => input.indexOf(WEI_VALUE) > -1);
        payable = `, {value: ${inputs[index]}}`;
        inputs.splice(index, 1);
    }
    return `async function(${functionInputs}) {
    const output = await contract_${funcName}.${gapi.name}(${inputs.join(', ')}${payable});
    return${returnValue};
}`;
}

function buildPClassVarsJs(funcName, funcObj) {
    let pclassi = funcObj.func.pclass.deployment.pclassi;
    if (pclassi.openapiid) {
        return `const ${DEPLOYMENT_VAR}_${funcName} = "http://${pclassi.host}${pclassi.basePath}";\n`;
    }
    const abi = funcObj.func.pclass.pclass.gapi;
    return `
const abi_${funcName} = ${JSON.stringify(abi)};
const ${DEPLOYMENT_VAR}_${funcName} = "${pclassi.address}";
const contract_${funcName} = new ethers.Contract(${DEPLOYMENT_VAR}_${funcName}, abi_${funcName}, signer);
`;
}

var visOptions={
    solidity: {
        type: "source",
        lang: "solidity",
        pclassType: "sol",
        validateFunc: (type, pclassType) => type === pclassType,
        addSource: null,
        "file_p0" : `pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

`,
"proxy": `
interface PipeProxy {
    function proxy(
        address _to,
        bytes input_bytes,
        uint256 gas_value
    )
        payable
        external
        returns (bytes);
}
`,
        "contract_p0": "\ncontract PipedContract",
        "contract_p1": " {\n    PipeProxy public pipe_proxy;\n",
        "contract_p2": "}\n",
        "genConstr1": "    address public ",
        "genConstr2": "address _",
        "genConstr3": (funcName, funcObj) => `${funcName} = _${funcName};`,
        "function_pp1": ") public payable ",
        // function returns from definition
        "function_ret0": " returns (",
        "function_ret1": ")",
        // actual function return
        "function_ret2": (outs) => `return (${outs.join(", ")});\n`,
        // input format
        "function_in": (type, name) => `${type} ${name}`,
        // outputs format
        "function_outtype": (type, name) => `${type} ${name}`,
        "function_returns": (type, name) => `${type} r_${name}`,
        // function end
        "function_ret4": "}",
        "function_p2": ` {\n    bytes4 signature42;\n    bytes memory input42;\n    bytes memory answer42;\n    address tx_sender = msg.sender;\n`,
        "sigFunc1": "signature42 = bytes4(keccak256(\"",
        "sigFunc2": "\"));",
        "inputSig": setCallFuncSignature,
        "ansProxy": callInternalFunctionSolidity,
        "outputset": (type, name, i) => `${type} o_${name}_${i};`,
        "restFunc": (outputset, outAssem) => `${outputset.join("\n")}\nassembly {\n${outAssem.join("\n")}\n}\n`,
        "assem": " := mload(add(answer42, 32))",
        "intro1": "\n\nfunction PipedFunction",
        "intro11": "(",
        "const1": "constructor(address _pipe_proxy, ",
        "const2": `
        ) public {
            pipe_proxy = PipeProxy(_pipe_proxy);
        `,
        "const3": "}\n",
    },
    js: {
        type: "source",
        lang: "javascript",
        pclassType: "js",
        validateFunc: (type, pclassType) => type === pclassType || type === visOptions.solidity.pclassType,
        addSource: addSourceJsFromSolidity,
        "file_p0" : `
let baseUrl;
const httpClient = axios;
const callback = PipedScriptCallback;

// Metamask
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = provider.getSigner();
`,
        "proxy": ``,
        "contract_p0": "",
        "contract_p1": ``,
        "contract_p2": "",
        "genConstr3": buildPClassVarsJs,
        "function_pp1": ") {\n",
        // empty, we don't need to have returns in function definition
        "function_ret0": "",
        "function_ret1": "",
        // actual function return
        "function_ret2": (outs, i) => `
    console.log(${outs.join(", ")});
    PipedScriptCallback('PipedFunction${i}', {${outs.join(", ")}});
`,
        // if an event is present, then we need to close it
        "function_ret3": '});',
        // function end
        "function_ret4": `
})`,
        "function_ret5": "(",
        "function_ret51": ");",
        // input format
        "function_in": (type, name) => `${name}`,
        // outputs format
        "function_outtype": (type, name) => `${name}`,
        "function_returns": (type, name) => ` r_${name}`,
        // empty, we don't need to have common variables for openapi
        "function_p2": `
    let result;
`,
        "sigFunc1": "",
        "sigFunc2": "",
        "inputSig1": "",
        "inputSig2": "",
        "ansProxy": callInternalFunctionJs,
        "outputset": (type, name, i) => `o_${name}_${i};`,
        "restFunc": genFuncReturnDestructuring,
        "assem": "",
        "intro0": `let `,
        "intro01": ` = null;`,
        "intro1": `
(async function PipedFunction`,
        "intro11": "(",
        "const1": "",
        "const2": ``,
        "const3": "",
    },
    graphRender: {
        type: "visual"
    }
}
