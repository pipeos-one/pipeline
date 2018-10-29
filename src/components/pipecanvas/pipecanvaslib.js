/* eslint-disable */
import SVG from 'svg.js';
import 'svg.draggable.js';
import './svg.foreignobject';
import dagre from 'dagre';
import $ from 'jquery';

const R = require('ramda');

// import {contracts, functions, graphh} from './graphs.js';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    const fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null) {
        result = [];
    }

    return result;
}

const ports = [
    {
        _id: '5bc59e192817116e84bdd830',
        containerid: '5bc59d5d2817116e84bdd82e',
        container: { name: 'PipeOS' },
        abiObj: {
            constant: true,
            inputs: [
                {
                    name: 'in',
                    type: '*',
                },
            ],
            name: 'PortOut',
            outputs: [],
            payable: false,
            stateMutability: 'view',
            type: 'port',
        },
        signature: 'PortOut(*)',
        timestamp: '2018-10-16T08:10:33.614Z',
    },
    {
        _id: '5bc59e192817116e84bdd831',
        containerid: '5bc59d5d2817116e84bdd82e',
        container: { name: 'PipeOS' },
        abiObj: {
            constant: true,
            inputs: [],
            name: 'PortIn',
            outputs: [
                {
                    name: 'out',
                    type: '*',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'port',
        },
        signature: 'PortIn()',
        timestamp: '2018-10-16T08:10:33.614Z',
    },
];

const containers = [
    {
        _id: '5bc59d5d2817116e84bdd82e',
        name: 'PipeOS',
        abi: [{
            constant: true, inputs: [{ name: 'in', type: '*' }], name: 'PortOut', outputs: [], payable: false, stateMutability: 'view', type: 'port',
        }, {
            constant: true, inputs: [], name: 'PortIn', outputs: [{ name: 'out', type: '*' }], payable: false, stateMutability: 'view', type: 'port',
        }],
        devdoc: { methods: {}, title: 'PipeOS Utils.' },
        userdoc: { methods: {} },
        bytecode: '',
        solsource: ' ',
        jssource: '',
        timestamp: '2018-10-16T08:10:33.614Z',
    },
];

let pipe2 = {};
let grIndex = 0
let langs ={}

let funcs; let gra = {}; let gre;
// const graphs = [{ nodes: {}, edges: {} }];

let draw;
let edges;
let g;
const xr = 32;
let startDrop; let endDrop;

const graph = {"n": [], "e": []};

export default class Graphs {

    constructor(functions, callbacks){
        console.log("constr", functions)
        pipe2.functions = functions.concat(ports.map(port => {
            port.container = containers[0];
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
        };
    }

    getGraphs() {
        return pipe2.graphs;
    }
    getPipe(){
        return pipe2;
    }

    addGraph(domid) {
        console.log("addGr", domid)
        pipe2.domids.push(domid)
        pipe2.draws.push(SVG(domid))
        pipe2.incNodes.push(0)
        pipe2.graphs.push({n:{}, e:[]})
        pipe2.rgraphs.push({})
        pipe2.cgraphs.push({})

    }

    addFunction( funcData, grIndex1){
        console.log("add", funcData, grIndex1)
        console.log("gr", pipe2)
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
        console.log(ndx)
    }

    deleteGraph(index) {
        delete pipe2.draws[index]

    }

    getSource(lang) {
        //console.log('getSource', langs[lang])
        return langs[lang]
    }
}




// Expects functions as an array of pipefunction objects, each with a `container` key for the pipecontainer.
const loadAll = function loadAll(domids, functions, graphs) {
    pipe2.functions = functions.concat(ports.map(port => {
        port.container = containers[0];
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
    /*
    g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: 'TB', align: 'UL' });
    // edgesep: xr, nodesep:xr, ranksep:xr,
    g.setDefaultEdgeLabel(() => ({}));
    */
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
    console.log(pipe2.graphs[grIndex]);
    pipe2.cgraphs[grIndex]= R.clone(pipe2.graphs[grIndex]);
    //gre = R.clone(pipe2.graphs[grIndex].e);

    R.map((x) => {
        x.links = { in: {}, out: {} };
        x.state ={}
    }, pipe2.cgraphs[grIndex].n);

    console.log(pipe2.graphs[grIndex]);
    // console.log(gre);


    // bring edges data inside nodes
    R.map((x) => {
        console.log(JSON.stringify(pipe2.cgraphs[grIndex].n));
        //const o = findByI(x[0], pipe2.graphs[grIndex].n);
        let o = pipe2.cgraphs[grIndex].n[x[0]]
        console.log(o,x);
        let s = x[2];
        let s2 = {};
        s2[s] = x[3];
        // console.log(o)

        o.links.out[x[1]] = s2;
        //const o2 = findByI(x[2], pipe2.graphs[grIndex].n);
        let o2 = pipe2.cgraphs[grIndex].n[x[2]]
        s = x[0];
        s2 = {};
        s2[s] = x[1];
        o2.links.in[x[3]] = s2;
        return x;

    }, pipe2.graphs[grIndex].e);


    funcs = pipe2.functions;

    // gr is the nodes + function data
    pipe2.cgraphs[grIndex].n = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), pipe2.cgraphs[grIndex].n); // pipe2.graph.n


    // return true;

    // add ports
    proc4(pipe2.cgraphs[grIndex].n);


    // console.log("grr",gr)

    // gr is the nodes + function data
    pipe2.cgraphs[grIndex].n = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), pipe2.cgraphs[grIndex].n);

    console.log(pipe2.cgraphs[grIndex])


    gra = {}
    // re-index
    R.mapObjIndexed((x, key, all) => {
        gra[x.i] = x;
    }, pipe2.cgraphs[grIndex].n);

    pipe2.cgraphs[grIndex].n = gra

    //console.log("grrrrra",JSON.stringify(gra))
    console.log("gra",gra)
    //if (window.stop) return true;

    proc2(pipe2.cgraphs[grIndex].n);


    // console.log(funcs)


    const cont = filterWithKeys(
        (key, val) => val.containerid == '5bb54c23cbd77bc8f07afced', funcs,
    );

    // console.log(cont)
}

let render = {};

function proc2(gr) {
    //render = {};
    console.log(grIndex, pipe2.draws[grIndex])
    pipe2.draws[grIndex].clear();
    edges = pipe2.draws[grIndex].group();
    menu();

    // proc4(gr)
    // console.log(gr)
    // return true;



    // console.log("gr",gr)
    //console.log("grrrrr",JSON.stringify(gr))

    // draw nodes
    R.mapObjIndexed((x, key, all) => {
    //console.log("grrrrra",JSON.stringify(x))
    // graph.nodes[x.i] ={ render:new FuncBox( x ), links: { in: R.repeat("", x.func.abiObj.inputs.length), out:R.repeat("", "outputs" in x.func.abiObj? x.func.abiObj.outputs.length: [])}}
        //x.state = {}
        pipe2.rgraphs[grIndex][x.i] = new FuncBox(x);
        //gra[x.i] = x;
        let outl = 0;
        if (x.func.abiObj.outputs !== undefined) {
            outl = x.func.abiObj.outputs.length;
        }
        //const w = Math.max(x.func.abiObj.inputs.length, outl);
        //g.setNode(x.i, { label: x.i, width: w * xr, height: xr });
    // gra[x.i] = {links: x.links, func: x.func}
    }, gr);

    //console.log("grrrrr",JSON.stringify(gr))

    //console.log("grrrrra",JSON.stringify(gra))
    // console.log("gra",gra)


    // return true

    proc_e(gr);

    pipe2.cgraphs[grIndex].n = gr




    // console.log(render)

    //dagre.layout(g);
    // return true

    // redraw from dagre
    // proc3()

    let visitors = [ new GraphVisitor(visOptions.graphRender), new GraphVisitor(visOptions.solidity)]

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
            if (x1.func.abiObj.name == 'PortIn') n[key1] = true;
            if (x1.func.abiObj.inputs.length === 0) n[key1] = true;
        }, pg)
        console.log("pg",pg)
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
        if (x.func.abiObj.name == 'PortIn') n[key] = true;
    }, pg)

    let visitors = [ new GraphVisitor(visOptions.graphRender), new GraphVisitor(visOptions.solidity)]

    

    //console.log(n)
    proc_d(pg, [{}], 0, {}, n, visitors);
*/
    R.map( (x)=>{
        if (x.ops.type == "source") {
            console.log(x.getGen())
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

        let o1 = {}
        o1[x[2]] = x[3]
        let o2 = {}
        o2[x[0]] = x[1]

        gr[x[0]].links.out[x[1]] = o1;
        gr[x[0]].links.in[x[3]] = o2;

        // console.log(n1.obj.i,   n2.obj.i)
        //g.setEdge(n1.i, n2.i);
    }, pipe2.cgraphs[grIndex].e);
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
    console.log("proc_D grf: ", grf, next)
    if (Object.keys(next).length == 0) return
    tabl[row] = {}
    //if (incre == 1) console.clear()
    // console.log('proc_d', grf, tabl, row, known, next);

    if (Object.keys(grf).length == 0) return;
    const next1 = {};
    incre = incre+1;

    R.mapObjIndexed((x, key, all) => {
        // console.log(x, parseInt(key));
        known[parseInt(key)] = next[parseInt(key)] //? next[parseInt(key)] : true;
        let knowIn = true;
        R.mapObjIndexed((x1, key1, all1) => {
            //console.log(x1, key1, all1);
            const n1 = Object.keys(x1)[0];
            console.log(x1, n1, key1, all1, known);
            if ((known[n1] === undefined || known[n1] === false) && parseInt(key1) > 0 || grf[parseInt(key)].func.abiObj.type == 'port') {
                knowIn = false;
                // known[x1] = false
                //known[key] = false;
                // alert(x1,known[key1])
            }
        }, grf[parseInt(key)].links.in);
        if (!grf[parseInt(key)].func.abiObj.outputs) {
            grf[parseInt(key)].func.abiObj.outputs = [];
        }
        if (
            grf[parseInt(key)].func.abiObj.inputs.length == 0 || (
                knowIn && grf[parseInt(key)].func.abiObj.outputs.length != 0) || (
                    known[parseInt(key)] &&
                    grf[parseInt(key)].func.abiObj.outputs.length == 0
                )
            ) {
            R.mapObjIndexed((x2, key2, all2) => {
                // console.log("next", x2, key2, all2)
                next1[Object.keys(x2)[0]] = true;
            }, grf[parseInt(key)].links.out);

            if (next1[parseInt(key)] !== true) {
                R.map( (x)=>{
                    if (x.ops.type == "source") {
                        x.genFunc(grf[parseInt(key)])
                    }
                    if (x.ops.type == "visual") {
                        x.renderFunc(grf[parseInt(key)], row)
                    }
    
                },vis)
            }
            


            // all.splice(key,1)
            delete all[parseInt(key)];
            delete next[parseInt(key)]
        }
    }, next);

    //console.log(tabl, known, grf, Object.assign(next,next1));
    // console.log('proc_d2', grf); if (incre < 5)

    proc_d(grf, tabl, row + 1, known, next1, vis);
}


function proc3() {
    // redraw from dagre
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
    let out = { i: i, id: '5bc59e192817116e84bdd831', links: { in: {}, out: { 1: o1 } } , state: state1};

    out = R.merge(out, {func: findById(out.id, pipe2.functions)})
    //out.func.abiObj.outputs[0] = {name: state1.name, type: state1.type}
    console.log('addPortFunc', out.state)
    return out

}

// add new nodes for ports
function proc4(gr) {
    // console.log(pipe2.graph.e)
    // return true
    // console.log(gr)
    let incr = 3000;
    R.map((x) => {
        if (x.func.abiObj.type == "port") return
        R.mapObjIndexed((x1, key, all) => {
            // console.log(x1)
            // console.log(x.links.in[parseInt(key) + 1], key)
            if (x.links.in[parseInt(key) + 1] === undefined) {
                incr++;
                // console.log(key)
                let o1 = {}
                o1[x.i] = parseInt(key) + 1
                // let t = {i: inc, func: {abiObj: {inputs:[],outputs:[{ name: "out", type:x1.type}], name:"PortIn"}, container:{name:"PipeOS"}}, links:{in:{},out:{0:x.i}}}
                let name = (x1.name !== undefined)? x1.name : ""
                let state1 = {name: "i_"+name+"_"+x.i, type: x1.type, value: undefined}
                const t = addPortFunc(incr, o1, state1)
                //const t = { i: incr, id: '5bc59e192817116e84bdd831', links: { in: {}, out: { 1: o1 } } , state: state};
                gr[incr] = t;
                /*

                graph.nodes[inc] ={ render:new FuncBox( t ), links: { in: R.repeat("", t.func.abiObj.inputs.length), out:R.repeat("", "outputs" in t.func.abiObj? t.func.abiObj.outputs.length: [])}}

*/
                const int = {};
                int[incr] = 1;
                x.links.in[parseInt(key)+1] = int;
                pipe2.cgraphs[grIndex].e.push([incr, 1, x.i, parseInt(key) + 1]);
                // alert(key)
            }
        }, x.func.abiObj.inputs);

        R.mapObjIndexed((x2, key, all) => {
            // console.log(x.links.out[parseInt(key) + 1], key)
            if (x.links.out[parseInt(key) + 1] === undefined) {
                incr++;
                // console.log(key)
                // t ={i: inc, func: {abiObj: {inputs:[{ name: "in", type:x2.type}],outputs:[], name:"PortOut"}, container:{name:"PipeOS"}}, links:{in:{0:x.i},out:{}}}
                let o1 = {}
                o1[x.i] = parseInt(key) + 1
                let name = (x2.name !== undefined)? x2.name : ""
                let state = {name: "o_"+name+"_"+x.i, type: x2.type, value: undefined}
                const t = { i: incr, id: '5bc59e192817116e84bdd830', links: { in: { 1: o1}, out: {}  }, state: state};
                gr[incr] = t;
                // console.log(pipe2.graph.e)
                const int = {};
                int[incr] = 1;
                x.links.out[parseInt(key)+1] = int;
                pipe2.cgraphs[grIndex].e.push([x.i, parseInt(key) + 1, incr, 1]);
                // alert(key)
            }
        }, x.func.abiObj.outputs);
    }, gr);
    //console.log(JSON.stringify(gr))
    //console.log(JSON.stringify(gre))

    //console.log(gr, gre)

    // proc_e()
}


class Smooth {
    constructor(point1, point2, diff1, diff2) {
        this.point1 = point1;
        this.point2 = point2;
        this.id1 = point1.i;
        this.id2 = point2.i;
        this.port1 = diff1;
        this.port2 = diff2;
        console.log(point1, point2)
        let state = {name: "o_"+point1.obj.func.abiObj.outputs[diff1-1].name+"_"+point1.obj.i, type: point1.obj.func.abiObj.outputs[diff1-1].type, value: undefined}
        point2.obj.state[diff2] = state
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
        R.mapObjIndexed((x, key, all) => {
            // console.log(self.id1, self.port1, self.id2, self.port2, key);
            if (x[0] == self.id1 && x[1] == self.port1 && x[2] == self.id2 && x[3] == self.port2) {
                // delete pipe2.graph.e[parseInt(key)]
                pipe2.graphs[grIndex].e.splice(parseInt(key), 1);
            }
            // pipe2.graph.e.splice(ndx, 1);
        }, pipe2.graphs[grIndex].e);

        // console.log(pipe2.graph.e);

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
        const i = 'inputs' in this.obj.func.abiObj ? this.obj.func.abiObj.inputs.length : 0;
        const o = 'outputs' in this.obj.func.abiObj ? this.obj.func.abiObj.outputs.length : 0;
        const w = Math.max(i, o);

        const h = xr;
        const clas = 's_content';
        const txt = `${this.obj.func.container.name}\n${this.obj.func.abiObj.name}`;
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
        $(`#${id}_div`).html(`<div >${txt}</div>`).addClass(clas);
        this.x = Math.random() * 5 * xr;
        this.y = Math.random() * 5 * xr;
        this.note = this.el.text('');
        this.el.move(this.x, this.y);

        this.el.dblclick(() => {
            self.el.remove();
            R.mapObjIndexed((x, key, all) => {
                if (x.i == self.obj.i) delete pipe2.graphs[grIndex].n[key];
            }, pipe2.graphs[grIndex].n);

            R.mapObjIndexed((x, key, all) => {
                if (x[0] == self.obj.i || x[2] == self.obj.i) delete pipe2.graphs[grIndex].e[parseInt(key)];
            }, pipe2.graphs[grIndex].e);

            return proc1();
        });

        this.el.draggable();

        if (self.obj.func.abiObj.type != 'port') {
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
            if (self.obj.func.abiObj.type === 'port') {
                point = getPort(self.obj, 'in', parseInt(key));
            } else {

            }
*/
            point = getPort(self.obj, 'in', 1 + parseInt(key));

            // let point = getPort(self.obj, "in", 1+parseInt(key))

            const port = self.el.circle(10).center(point.x, point.y).attr({"fill-opacity":0.5});
            self.el.text(x.name).attr({ 'text-anchor': 'middle', 'font-size': 8, 'font-family': 'Roboto' }).move(point.x - 8, point.y - 12).transform({ rotation: -30 });
            port.mouseover(() => {
                self.note.text(x.type);
                const node = self.obj.i;
                endDrop = [node, parseInt(key)+1];
            });
            port.mouseout(() => {
                self.note.text('');
                endDrop = false;
            });
        }, this.obj.func.abiObj.inputs);

        R.mapObjIndexed((x, key, all) => {
            // console.log(x,self.obj,self.obj.func.abiObj.type,"outputs", key)
            let point = { x: 0, y: 0 };
/*
            if (self.obj.func.abiObj.type === 'port') {
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
                const p = e.detail.event;
                // console.log(p, p.offsetX, p.offsetY, draw);

                this.obj = pipe2.draws[grIndex].circle(12).center(p.offsetX, p.offsetY).back();
                // drag was completely prevented
            });
            port.on('dragend', (e) => {
                // console.log(e);
                const node = self.obj.i;
                startDrop = [node, parseInt(key)+1];
                console.log(startDrop, endDrop);
                console.log(gra)
                if (endDrop != false) {
                    // console.log(startDrop, endDrop);
                    const edge = startDrop.concat(endDrop);
                    // console.log(edge);
                    if (startDrop[0] > 2999) {
                        pipe2.graph.n.push({ i: startDrop[0], id: '5bc59e192817116e84bdd831'})
                    }
                    pipe2.graphs[grIndex].e.push(edge);
                    // console.log(pipe2.graph.e);
                    return proc1();
                }
            });

            port.on('dragmove', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const p = e.detail.event;
                this.obj.center(p.offsetX, p.offsetY);
            });
        }, this.obj.func.abiObj.outputs);


        /*
         this.el.draggable(function(nx, ny){
             //console.log(nx)
             return {x:Math.round(nx/self.s)*self.s+s/2, y: Math.round(ny/(2*1.5*self.s))*2*self.s*1.5+s*0.75}
         })
        */
        this.el.on('dragmove', self.onDrag);
    }

    onDrag(e) {
        let matrix = $(e.target).attr('transform');

        const id = $(e.target).attr('id');
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

class GraphVisitor{
    constructor(options){
        this.ops = options
        this.genC = ""
        this.genConstr1 = []
        this.genConstr2 = []
        this.genConstr3 = []
        this.genConstr4 = []
        this.genG = []
        this.genF = []
        this.genF1 = []
        this.genF2 = []
        this.in = []
        this.pointer = xr;
        this.row = 0
        this.out = []
        this.outtype = []
    }

    renderFunc(funcObj, row){
        console.log(funcObj)

        if (row != 0) {
            //console.log("o--",funcObj.i,Object.keys(pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].links.in[1]))
            //this.pointer = render[Object.keys(gr[parseInt(funcObj.i)].links.in[1][0])]
            //alert(this.pointer)
        }

        if (this.row < row){
            this.row = row
            this.pointer = xr
        }

        //tabl[row][parseInt(key)] = this.pointer;
        console.log(grIndex, funcObj.i, pipe2.rgraphs[grIndex][parseInt(funcObj.i)])
        pipe2.rgraphs[grIndex][parseInt(funcObj.i)].redraw(this.pointer, 2*(row + 1) * xr);
        console.log(pipe2.cgraphs[grIndex])
        this.pointer += (1 + Math.max(pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.abiObj.inputs.length, pipe2.cgraphs[grIndex].n[parseInt(funcObj.i)].func.abiObj.outputs.length)) * xr;


    }

    genContainer(grs){
        this.genC = this.genC + this.ops.file_p0
        this.genC = this.genC + this.ops.proxy
        this.genC = this.genC + this.ops.contract_p0
        this.genC = this.genC + this.ops.contract_p1

    }

    setGraph(g){
        this.row = 0
        this.pointer = xr
    }

    genGraph(g){
        let ini = this.genF[grIndex] 
        
        this.genF[grIndex] = this.ops.intro1 + grIndex+ this.ops.intro11 + this.in.join(",") + this.ops.function_pp1 + " public "
        
        


        if (this.outtype.length >0){
            this.genF[grIndex] = this.genF[grIndex] + this.ops.function_ret0
            this.genF[grIndex] = this.genF[grIndex] + this.outtype.join(",")
            this.genF[grIndex] = this.genF[grIndex] +  this.ops.function_ret1
        }


        

        this.genF[grIndex] = this.genF[grIndex] +  this.ops.function_p2 + ini
        // this.genF1[grIndex] = 

        this.genF2[grIndex] = ""
        if (this.out.length >0){
            this.genF2[grIndex] = "return ("
            this.genF2[grIndex] = this.genF2[grIndex] + this.out.join(",")
            this.genF2[grIndex] = this.genF2[grIndex]+ ");\n"
        }

        this.genF[grIndex] = this.genF[grIndex] + this.genF2[grIndex] + "}"

        this.in= []
        this.out = []
        this.outtype = []


    }

    genFunc(funcObj, row){
        console.log(funcObj)
        if (funcObj.func.abiObj.type == "function") {
            this.genConstr1.push("address public "+ funcObj.func.abiObj.name+"_"+funcObj.i+ " ;")
            this.genConstr2.push("address _"+funcObj.func.abiObj.name+"_"+funcObj.i)
            this.genConstr3.push(funcObj.func.abiObj.name+"_"+funcObj.i+ " = _" + funcObj.func.abiObj.name+"_"+funcObj.i+ ";")
            this.genConstr4.push(funcObj.func._id)
            let f = this.genF[grIndex]? this.genF[grIndex]: ""
            this.genF[grIndex] = f+ "\n"+ this.ops.sigFunc1 + funcObj.func.signature + this.ops.sigFunc2 + "\n"
            let inputset = R.mapObjIndexed((x, key, all) => {
                let o = "i_"+x.name+ "_"+funcObj.i
                console.log('*********', funcObj.state[parseInt(key)+1])
                if (funcObj.state[parseInt(key)+1]){
                    o = funcObj.state[parseInt(key)+1].name
                }
                return o
            }, funcObj.func.abiObj.inputs
            )
            this.genF[grIndex] = this.genF[grIndex] + this.ops.inputSig1 + Object.values(inputset).join(",")+this.ops.inputSig2+"\n";
            this.genF[grIndex] = this.genF[grIndex] + this.ops.ansProxy1 +funcObj.func.abiObj.name +"_"+ funcObj.i+ this.ops.ansProxy2+"\n";
            let outAssem = []
            let outputset = R.map((x)=>{
                console.log(x)
                let name = (x.name !== undefined)? x.name: ""
                outAssem.push("o_" + name + "_"+ funcObj.i+this.ops.assem)
                return x.type+" o_" +   name + "_"+funcObj.i+ ";"
            }, funcObj.func.abiObj.outputs)
            let o = ""
            if (funcObj.func.abiObj.outputs.length >0){
                o = outputset.join("\n") +this.ops.restFunc1+ outAssem.join("\n")+ this.ops.restFunc2
            }

            this.genF[grIndex] = this.genF[grIndex] + o + "\n";
        }

        if (funcObj.func.abiObj.type == "port") {
            if (funcObj.func.abiObj.name == "PortIn") {
                this.in.push(funcObj.state.type+" "+funcObj.state.name)
            }

            if (funcObj.func.abiObj.name == "PortOut") {
                this.out.push(funcObj.state.name)
            }

            if (funcObj.func.abiObj.name == "PortOut") {
                this.outtype.push(funcObj.state.type+" "+ funcObj.state.name)
            }

        }

        // funcObj.func.abiObj.name

    }

    getGen(){
        let out = ""
        //out = out + this.intro1
        //console.log(this.in)
        out = out + this.genC

        out = out + this.genConstr1.join("\n")+ "\n"
        out = out + this.ops.const1 +this.genConstr2.join(", ") + this.ops.const2
        out = out + this.genConstr3.join("\n") + "\n"
        out = out + this.ops.const3
        //out = out + this.intro2
        out =  out + this.genF.join("\n")

        langs["constructor"] = this.genConstr4


        

        //out = out + this.outro
        out = out + this.ops.contract_p2

        return out
    }


}

var visOptions={
    solidity: {
        type: "source",
        lang: "solidity",
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
        "import_p1": "\";\n",
        "interface_p0": "\ninterface ",
        "contract_p0": "\ncontract PipedContract",
        "contract_p1": " {\n    PipeProxy public pipe_proxy;\n",
        "contract_p2": "}\n",
        "member_p0": ";\n",
        "function_p0": "\n    function ",
        "function_pp0": "(  ",
        "function_pp1": ")",
        "function_p1": " payable public ",
        "function_p2": " ) payable public  ",
        "function_ret0": " returns (",
        "function_ret1": ")",
        "function_p2": " {\n    bytes4 signature42;\n    bytes memory input42;\n    bytes memory answer42;\n    uint wei_value = msg.value;\n    address tx_sender = msg.sender;\n",
        "function_p3": "    }\n",
        "comma": ",",
        "sigFunc1": "signature42 = bytes4(keccak256(\"",
        "sigFunc2": "\"));",
        "inputSig1": "input42 = abi.encodeWithSelector(signature42,",
        "inputSig2": ");",
        "ansProxy1": "answer42 = pipe_proxy.proxy(",
        "ansProxy2": ", input42, 400000);",
        "restFunc1": "\nassembly {\n",
        "restFunc2": "\n}\n",
        "assem": " := mload(add(answer42, 32))",

        intro1: "\n\nfunction PipedFunction",
        intro11: "(",
        intro2: `) payable public {
        bytes4 signature42;
        bytes memory input42;
        bytes memory answer42;
        uint wei_value = msg.value;
        address tx_sender = msg.sender;
        `,
        "const1": "constructor(address _pipe_proxy, ",
        "const2": `
        ) public {
            pipe_proxy = PipeProxy(_pipe_proxy);
        `,
        "const3": "}\n",

        "part1": ""
    },

    graphRender: {
        type: "visual"
    }
}
