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
let gndx = 0

let funcs; let gra = {}; let gre;
// const graphs = [{ nodes: {}, edges: {} }];

let draw;
let edges;
let g;
const xr = 32;
let startDrop; let endDrop;


export default class Graphs {
    constructor(domids, functions, graphs){

    }

    addFunction( funcData, grIndex){

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
    g = new dagre.graphlib.Graph();

    g.setGraph({ rankdir: 'TB', align: 'UL' });
    // edgesep: xr, nodesep:xr, ranksep:xr,
    g.setDefaultEdgeLabel(() => ({}));
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
    const m = draw.group();
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
    // console.log(JSON.stringify(pipe2.graph));
    gr = R.clone(pipe2.graph.n);
    gre = R.clone(pipe2.graph.e);

    R.map((x) => {
        x.links = { in: {}, out: {} };
    }, gr);

    // console.log(gr);
    // console.log(gre);


    // bring edges data inside nodes
    R.map((x) => {
        // console.log(x);
        const o = findByI(x[0], gr);
        let s = x[2];
        let s2 = {};
        s2[s] = x[3];
        // console.log(o)

        o.links.out[x[1]] = s2;
        const o2 = findByI(x[2], gr);
        s = x[0];
        s2 = {};
        s2[s] = x[1];
        o2.links.in[x[3]] = s2;
        return x;

    }, gre);


    funcs = pipe2.functions;

    // gr is the nodes + function data
    gr = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), gr); // pipe2.graph.n


    // return true;

    // add ports
    proc4(gr);


    // console.log("grr",gr)

    // gr is the nodes + function data
    gr = R.mapObjIndexed((x, key, all) => R.merge(x, { func: findById(x.id, funcs) }), gr);

    console.log(gr, gre)


    gra = {}
    // re-index
    R.mapObjIndexed((x, key, all) => {
        gra[x.i] = x;
    }, gr);

    //console.log("grrrrra",JSON.stringify(gra))
    console.log("gra",gra)
    //if (window.stop) return true;

    proc2(gra);


    // console.log(funcs)


    const cont = filterWithKeys(
        (key, val) => val.containerid == '5bb54c23cbd77bc8f07afced', funcs,
    );

    // console.log(cont)
}

let render = {};

function proc2(gr) {
    render = {};
    draw.clear();
    edges = draw.group();
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

        render[x.i] = new FuncBox(x);
        //gra[x.i] = x;
        let outl = 0;
        if (x.func.abiObj.outputs != undefined) {
            outl = x.func.abiObj.outputs.length;
        }
        const w = Math.max(x.func.abiObj.inputs.length, outl);
        g.setNode(x.i, { label: x.i, width: w * xr, height: xr });
    // gra[x.i] = {links: x.links, func: x.func}
    }, gr);

    //console.log("grrrrr",JSON.stringify(gr))

    //console.log("grrrrra",JSON.stringify(gra))
    // console.log("gra",gra)


    // return true

    proc_e(gr);

    // console.log(render)

    dagre.layout(g);
    // return true

    // redraw from dagre
    // proc3()

    const pg = clone(gr);
    incre = 1;
    let n={}

    R.mapObjIndexed((x, key, all) => {
        if (x.func.abiObj.name == 'PortIn') n[key] = true;
    }, pg)

    let visitors = [ new GraphVisitor(visOptions.graphRender), new GraphVisitor(visOptions.solidity)]

    //console.log(n)
    proc_d(pg, [{}], 0, {}, n, visitors);

    R.map( (x)=>{
        if (x.ops.type == "source") {
            console.log(x.getGen())
        }
    },visitors)
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
        const n1 = render[x[0]];
        const n2 = render[x[2]];
        // console.log(n1, n2)
        // console.log(getPort(n1,"out", x[1]), getPort(n2, "in", x[3]))
        // alert("j")
        // console.log(n1,n2,x)

        const link = new Smooth(n1, n2, x[1], x[3]);
        render[x[0]].links.out.push(link);
        render[x[2]].links.in.push(link);

        let o1 = {}
        o1[x[2]] = x[3]
        let o2 = {}
        o2[x[0]] = x[1]

        gr[x[0]].links.out[x[1]] = o1;
        gr[x[0]].links.in[x[3]] = o2;

        // console.log(n1.obj.i,   n2.obj.i)
        g.setEdge(n1.i, n2.i);
    }, gre);
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
    // console.log("proc_D grf: ", JSON.stringify(grf))
    if (Object.keys(next).length == 0) return
    tabl[row] = {}
    //if (incre == 1) console.clear()
    // console.log('proc_d', grf, tabl, row, known, next);

    if (Object.keys(grf).length == 0) return;
    const next1 = {};
    incre = incre+1;

    R.mapObjIndexed((x, key, all) => {
        // console.log(x, parseInt(key));
        known[parseInt(key)] = next[parseInt(key)] ? next[parseInt(key)] : true;
        let knowIn = true;
        R.mapObjIndexed((x1, key1, all1) => {
            //console.log(x1, key1, all1);
            const n1 = Object.keys(x1)[0];
            // console.log(x1, n1, key1, all1);
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


            R.map( (x)=>{
                if (x.ops.type == "source") {
                    x.genFunc(grf[parseInt(key)])
                }
                if (x.ops.type == "visual") {
                    x.renderFunc(grf[parseInt(key)], row)
                }

            },vis)


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
                let state = {name: x1.name+"_"+x.i, type: x1.type, value: undefined}
                const t = { i: incr, id: '5bc59e192817116e84bdd831', links: { in: {}, out: { 1: o1 } } , state: state};
                gr[incr] = t;
                /*

                graph.nodes[inc] ={ render:new FuncBox( t ), links: { in: R.repeat("", t.func.abiObj.inputs.length), out:R.repeat("", "outputs" in t.func.abiObj? t.func.abiObj.outputs.length: [])}}

*/
                const int = {};
                int[incr] = 1;
                x.links.in[parseInt(key)+1] = int;
                gre.push([incr, 1, x.i, parseInt(key) + 1]);
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
                let state = {name: x2.name+"_"+x.i, type: x2.type, value: undefined}
                const t = { i: incr, id: '5bc59e192817116e84bdd830', links: { in: { 1: o1}, out: {}  }, state: state};
                gr[incr] = t;
                // console.log(pipe2.graph.e)
                const int = {};
                int[incr] = 1;
                x.links.out[parseInt(key)+1] = int;
                gre.push([x.i, parseInt(key) + 1, incr, 1]);
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
                pipe2.graph.e.splice(parseInt(key), 1);
            }
            // pipe2.graph.e.splice(ndx, 1);
        }, pipe2.graph.e);

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
        this.el = draw.group();
        this.el.attr('id', obj.i);
        this.note = this.el.text('');
        // console.log(this.obj);
        const i = 'inputs' in this.obj.func.abiObj ? this.obj.func.abiObj.inputs.length : 0;
        const o = 'outputs' in this.obj.func.abiObj ? this.obj.func.abiObj.outputs.length : 0;
        const w = Math.max(i, o);

        const h = xr;
        const clas = 's_content';
        const txt = `${this.obj.func.container.name}\n${this.obj.func.abiObj.name}`;
        this.el.rect(xr * w, xr).attr({
            rx: this.r, ry: this.r, fill: '#ddd', 'stroke-width': 1, opacity: 0.4,
        });
        this.text = this.el.foreignObject(w * xr, h * 2);
        const id = this.text.attr('id');
        this.text.appendChild('div', { id: `${id}_div` });
        $(`#${id}_div`).html(`<div >${txt}</div>`).addClass(clas);
        this.x = Math.random() * 5 * xr;
        this.y = Math.random() * 5 * xr;
        this.el.move(this.x, this.y);

        this.el.dblclick(() => {
            self.el.remove();
            R.mapObjIndexed((x, key, all) => {
                if (x.i == self.obj.i) delete pipe2.graph.n[key];
            }, pipe2.graph.n);

            R.mapObjIndexed((x, key, all) => {
                if (x[0] == self.obj.i || x[2] == self.obj.i) delete pipe2.graph.e[parseInt(key)];
            }, pipe2.graph.e);

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
            const port_o = self.el.circle(10).center(point.x, point.y).attr({opacity:0.08});

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

            const port = self.el.circle(10).center(point.x, point.y);
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
            const port = self.el.circle(10).center(point.x, point.y);
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

                this.obj = draw.circle(12).center(p.offsetX, p.offsetY).back();
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
                    pipe2.graph.e.push(edge);
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
        const n = render[id];
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
        this.gen = ""
        this.intro1 = options.intro1
        this.intro2 = options.intro2
        this.outro = options.function_p3
        this.in = []
        this.pointer = xr;
        this.row = 0
        this.out = []
    }

    renderFunc(funcObj, row){
        console.log(funcObj)

        if (row != 0) {
            console.log("o--",funcObj.i,Object.keys(gr[parseInt(funcObj.i)].links.in[1]))
            //this.pointer = render[Object.keys(gr[parseInt(funcObj.i)].links.in[1][0])]
            //alert(this.pointer)
        }

        if (this.row < row){
            this.row = row
            this.pointer = xr
        }

        //tabl[row][parseInt(key)] = this.pointer;

        render[parseInt(funcObj.i)].redraw(this.pointer, 2*(row + 1) * xr);
        this.pointer += (1 + Math.max(gr[parseInt(funcObj.i)].func.abiObj.inputs.length, gr[parseInt(funcObj.i)].func.abiObj.outputs.length)) * xr;


    }

    genFunc(funcObj, row){
        console.log(funcObj)
        if (funcObj.func.abiObj.type == "function") {
            this.gen = this.gen +"\n"+ this.ops.sigFunc1 + funcObj.func.signature + this.ops.sigFunc2 + "\n"
            let inputset = R.map((x)=> {
                return x.name+"_"+funcObj.i
            }, funcObj.func.abiObj.inputs
            )
            this.gen = this.gen + this.ops.inputSig1 + inputset.join(",")+this.ops.inputSig2+"\n";
            this.gen = this.gen + this.ops.ansProxy1 +funcObj.func.abiObj.name + this.ops.ansProxy2+"\n";
            let outAssem = []
            let outputset = R.map((x)=>{
                console.log(x)
                outAssem.push(x.name + "_" + funcObj.i+this.ops.assem)
                return x.type+" " + x.name + "_" + funcObj.i+ ";"
            }, funcObj.func.abiObj.outputs)

            this.gen = this.gen + outputset.join("\n") +this.ops.restFunc1+ outAssem.join("\n")+ this.ops.restFunc2+"\n";
        }

        if (funcObj.func.abiObj.type == "port") {
            if (funcObj.func.abiObj.name == "PortIn") {
                this.in.push(funcObj.state.type+" "+funcObj.state.name)
            }

            if (funcObj.func.abiObj.name == "PortOut") {
                this.out.push(funcObj.state.name)
            }

        }

        // funcObj.func.abiObj.name

    }

    getGen(){
        let out = ""
        out = out + this.intro1
        console.log(this.in)
        out = out + this.in.join(",")
        out = out + this.intro2
        out = out + this.gen
        if (this.out.length >0){
            out = out+ "return ("
            out = out + this.out.join(",")
            out = out+ ");\n"
        }

        out = out + this.outro

        return out
    }


}

var visOptions={
    solidity: {
        type: "source",
        "file_p0" : "pragma solidity ^0.4.24;\npragma experimental ABIEncoderV2;\n\n",
        "proxy": "\ncontract SethProxy {\n    function proxyCallInternal(address _to, bytes input_bytes, uint256 output_size) payable public returns (bytes);\n}\n",
        "import_p0": "//import \"",
        "import_p1": "\";\n",
        "interface_p0": "\ninterface ",
        "contract_p0": "\ncontract ",
        "contract_p1": " {\n    SethProxy public seth_proxy;\n",
        "contract_p2": "}\n",
        "member_p0": ";\n",
        "function_p0": "\n    function ",
        "function_pp0": "(  ",
        "function_pp1": ")",
        "function_p1": " payable public ",
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
        "ansProxy2": ", input42, 32);",
        "restFunc1": "\nassembly {\n",
        "restFunc2": "\n}\n",
        "assem": " := mload(add(answer42, 32))",

        intro1: "\n\nfunction PipedFunction1(",
        intro2: ") payable public {\nbytes4 signature42;\nbytes memory input42;\nbytes memory answer42;\nuint wei_value = msg.value;\naddress tx_sender = msg.sender;\n",



        "part1": ""
    },

    graphRender: {
        type: "visual"
    }
}
