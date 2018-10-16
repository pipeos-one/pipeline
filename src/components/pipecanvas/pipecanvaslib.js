const R = require('ramda');

import SVG from 'svg.js';
import 'svg.draggable.js';
import './svg.foreignobject';
import dagre from 'dagre';
import $ from 'jquery';

// import {contracts, functions, graphh} from './graphs.js';

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

var pipe2={};

var funcs, gra, gre;
var graph = {nodes:{}, edges:{}}, temp={}, onPort = false, portIn={};

const ports = [
    {
      "_id": "5bc59e192817116e84bdd830",
      "containerid": "5bc59d5d2817116e84bdd82e",
      "container": {name: "PipeOS"},
      "abiObj": {
        "constant": true,
        "inputs": [
          {
            "name": "in",
            "type": "*"
          }
        ],
        "name": "PortOut",
        "outputs": [],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
      },
      "signature": "PortOut(*)",
      "timestamp": "2018-10-16T08:10:33.614Z"
    },
    {
      "_id": "5bc59e192817116e84bdd831",
      "containerid": "5bc59d5d2817116e84bdd82e",
      "container": {name: "PipeOS"},
      "abiObj": {
        "constant": true,
        "inputs": [],
        "name": "PortIn",
        "outputs": [
          {
            "name": "out",
            "type": "*"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "port"
      },
      "signature": "PortIn()",
      "timestamp": "2018-10-16T08:10:33.614Z"
    }
]

const containers = [
    {"_id":"5bc59d5d2817116e84bdd82e","name":"PipeOS","abi":[{"constant":true,"inputs":[{"name":"in","type":"*"}],"name":"PortOut","outputs":[],"payable":false,"stateMutability":"view","type":"port"},{"constant":true,"inputs":[],"name":"PortIn","outputs":[{"name":"out","type":"*"}],"payable":false,"stateMutability":"view","type":"port"}],"devdoc":{"methods":{},"title":"PipeOS Utils."},"userdoc":{"methods":{}},"bytecode":"","solsource":" ","jssource":"","timestamp":"2018-10-16T08:10:33.614Z"}
]

var draw;
var edges;
var g;
var graphn
var xr =32
var startDrop, endDrop

const loadAll = function loadAll(domid, contracts, functions, graph) {
    pipe2.contracts = contracts.concat(containers)
    pipe2.functions = functions.concat(ports)
    pipe2.graph = graph
    console.log('pipecanvaslib.pipe2.contracts', pipe2.contracts)
    console.log('pipecanvaslib.pipe2.functions', pipe2.functions)
    console.log('pipecanvaslib.pipe2.graph', JSON.stringify(pipe2.graph))

    //return true;
    if (draw == undefined) {
        draw = SVG(domid)
        edges = draw.group()
    }
    g = new dagre.graphlib.Graph();

    g.setGraph({rankdir:"TB", align:"UL"});
    // edgesep: xr, nodesep:xr, ranksep:xr,
    g.setDefaultEdgeLabel(function() { return {}; });
    proc1();
}

function find2(idVal, obj3){
    //console.log(obj3)
    if (obj3 && "_id" in obj3 && obj3._id == idVal) return obj3;
    return false
}

function getById(id, objArray){
    //console.log(objArray)
    return R.map(find2,objArray)
}

const findById = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq("_id")), R.nthArg(1)]
);

const findBy = R.converge(
  R.find,
  [R.pipe(R.nthArg(1), R.propEq(R.nthArg(0))), R.nthArg(2)]
);

const findByI = R.converge(
  R.find,
  [R.pipe(R.nthArg(0), R.propEq("i")), R.nthArg(1)]
);


const filterWithKeys = (pred, obj) => R.pipe(
  R.toPairs,
  R.filter(R.apply(pred)),
  R.fromPairs
)(obj);

var gr

function getPort(funcObj, io, ndx){
    //console.log(funcObj, io, ndx)
    let y = 0
    if (io == "out") {
        y = xr
    }
    if (ndx == 0 && funcObj.func.abiObj.type != "port") {
        if (io == "out") return {x: -10, y: 15}
        return {x: -10, y: xr-15}
    }


    // funcObj.links[io][ndx-1] &&
    if (funcObj.func.abiObj.type != "port"){
        return {x: ((ndx)*xr - 0.5*xr), y: y}
    }
    if ((ndx) in funcObj.links[io]) {
        return {x: ((ndx)*xr + 0.5*xr), y: y}
    }

}

function proc1(){

    //let obj1 =  findById("5bb54c23cbd77bc8f07afced",pipe2.contracts)
    console.log(JSON.stringify(pipe2.graph))
    gr = R.clone(pipe2.graph.n)
    gre = R.clone(pipe2.graph.e)

    R.map(function(x){
        x.links = {in:{}, out:{}}
    },gr)

    console.log(gr)
    console.log(gre)


    //bring edges data inside nodes
    R.map(function(x){
        console.log(x)
        let o = findByI( x[0], gr)
        let s = x[2]
        let s2 = {}
        s2[s] = x[3]
        //console.log(o)

        o.links.out[x[1]]= s2
        let o2  = findByI(x[2],gr)
        s = x[0]
        s2 = {}
        s2[s] = x[1]
        o2.links.in[x[3]]= s2
        return x

        //o2.links.in[x[2]][s] = x[1]
    }, gre)








    // bring container data inside functions
    funcs = R.map(function(x){
        //console.log(x)
        return R.merge(x,{container: findById(x.containerid,pipe2.contracts)})

        },pipe2.functions)

    // gr is the nodes + function data
    gr = R.mapObjIndexed(function(x, key, all){
        //console.log(x)
        return R.merge(x,{func: findById(x.id,funcs)})

        },gr)  // pipe2.graph.n


    //return true;

    proc4(gr)

    //console.log("grr",gr)

    // gr is the nodes + function data
    gr = R.mapObjIndexed(function(x, key, all){
        //console.log(x)
        return R.merge(x,{func: findById(x.id,funcs)})

    },gr)

    gra = {}


    // re-index
    R.mapObjIndexed(function(x, key, all){
        gra[x.i] = x
    },gr)

    //console.log("grrrrra",gra)

    proc2(gra)











    //console.log(funcs)





    let cont = filterWithKeys(
  (key, val) => val.containerid == "5bb54c23cbd77bc8f07afced", funcs)

    //console.log(cont)


}

var gra


function proc2(gr){

    draw.clear()
    edges = draw.group()

    //proc4(gr)
    //console.log(gr)
    //return true;
    gra={}







    //console.log("gr",gr)

    //draw nodes
    R.mapObjIndexed(function(x, key, all){
        //console.log(x)
        //graph.nodes[x.i] ={ render:new FuncBox( x ), links: { in: R.repeat("", x.func.abiObj.inputs.length), out:R.repeat("", "outputs" in x.func.abiObj? x.func.abiObj.outputs.length: [])}}

        x.render = new FuncBox( x )
        gra[x.i] = x
        let outl = 0
        if (x.func.abiObj.outputs != undefined ) {
            outl = x.func.abiObj.outputs.length
        }
        let w = Math.max(x.func.abiObj.inputs.length, outl)
        g.setNode(x.i,    { label: x.i,  width: w*xr, height: xr });
        //gra[x.i] = {links: x.links, func: x.func}

    }, gr)



    //console.log("gra",gra)




    //return true

    proc_e(gra)

    //console.log(pipe2.graph.e)

    dagre.layout(g);
    //return true
    proc3()

    //let pg = clone(gra)

    //proc_d(pg, [{}], 0, {})

}

function clone(obj){
    let out ={}
    R.mapObjIndexed(function(x, key, all){
        out[key]= x
    },obj)
    return out
}

function proc_d(grf, tabl, row, known){
    console.log("proc_d",grf);
    let pointer = xr
    if (grf.length == 0) return

    R.mapObjIndexed(function(x, key, all){
        console.log(x)
        known[key] = true
        let knowIn = true
        R.mapObjIndexed(function(x1, key1, all1){
            console.log(x1,key1)
            if (known[x1] == undefined || known[x1] == false) {
                knowIn = false;
                known[x1] = false
                //alert(x1,known[key1])
            }
        },x.links.in)
        if (x.func.abiObj.inputs.length==0 || knowIn){
            tabl[row][key]= pointer

            gra[key].render.redraw(pointer, (row+1)*xr)
            pointer = pointer + (1+Math.max(x.func.abiObj.inputs.length, x.func.abiObj.outputs.length))*xr
            delete all[key]

        }
    }, grf)

    console.log(tabl,known,grf)

    //proc_d(grf, tabl, row+1, known)


    console.log(tabl,known)



}

function proc_e(gr){
    //graph.nodes = pipe2.graph.n
    graph.nodes = gr
    // console.log(gr)
    // console.log(gre)


    R.mapObjIndexed(function(x, key, all){
        //x.ndx = key
        //console.log(x,graph.nodes)
        //console.log(graph.nodes, x[0], x[2])
        let n1 = graph.nodes[x[0]]
        let n2 = graph.nodes[x[2]]
        //console.log(n1, n2)
        //console.log(getPort(n1,"out", x[1]), getPort(n2, "in", x[3]))
        //alert("j")
        //console.log(n1,n2,x)

        let link = new Smooth( n1, n2, x[1], x[3])
        n1.render.links.out.push(link)
        n2.render.links.in.push(link)

        graph.nodes[x[0]].links.out[x[1]] = x[2]
        graph.nodes[x[0]].links.in[x[3]] = x[0]

        //console.log(n1.obj.i,   n2.obj.i)
        g.setEdge(n1.i,   n2.i);
    }, gre)


}

function proc3(){

    // redraw from dagre
    let n = g.nodes()
    R.map(function(x){
        let t = gra[x].render
        //console.log(t)
        let o = g.node(x)
        //console.log(o)
        t.redraw(o.x, o.y)
    }, n)



}

// add new nodes for ports
function proc4(gr){
    //console.log(pipe2.graph.e)
    //return true
    //console.log(gr)
    let inc = 3000
    R.map(function(x){
        R.mapObjIndexed(function(x1, key, all){
            //console.log(x1)
            //console.log(x.links.in[key], key)
            if (x.links.in[parseInt(key)+1] == undefined){
                inc++
                //let t = {i: inc, func: {abiObj: {inputs:[],outputs:[{ name: "out", type:x1.type}], name:"PortIn"}, container:{name:"PipeOS"}}, links:{in:{},out:{0:x.i}}}
                let t = {i: inc, id: "5bc59e192817116e84bdd831", links:{in:{},out:{0:x.i}}}
                gr[inc] =t
                /*

                graph.nodes[inc] ={ render:new FuncBox( t ), links: { in: R.repeat("", t.func.abiObj.inputs.length), out:R.repeat("", "outputs" in t.func.abiObj? t.func.abiObj.outputs.length: [])}}

*/
                let int = {}
                int[inc]=0
                x.links.in[key] =int
                gre.push([inc,0,x.i,parseInt(key)+1])
                //alert(key)
            }
        },x.func.abiObj.inputs)

        R.mapObjIndexed(function(x2, key, all){
            if (x.links.out[parseInt(key)+1] == undefined){
                inc++

                //t ={i: inc, func: {abiObj: {inputs:[{ name: "in", type:x2.type}],outputs:[], name:"PortOut"}, container:{name:"PipeOS"}}, links:{in:{0:x.i},out:{}}}
                let t = {i: inc, id: "5bc59e192817116e84bdd830", links:{in:{0:x.i},out:{}}}
                gr[inc] = t
                //console.log(pipe2.graph.e)
                let int = {}
                int[inc]=0
                x.links.out[key] =int
                gre.push([x.i,parseInt(key)+1, inc,0])
                //alert(key)
            }
        },x.func.abiObj.outputs)

    }, gr)
    //console.log(gr)

    //proc_e()


}


class Smooth {
    constructor( point1, point2, diff1, diff2){
        this.point1 = point1.render
        this.point2 = point2.render
        this.id1 = point1.i
        this.id2 = point2.i
        this.port1 = diff1
        this.port2 = diff2
        this.diff1 = getPort(point1,"out", diff1)
        let dff2 = getPort(point2, "in", diff2)
        this.diff2 = {x:dff2.x, y: dff2.y-6}
        this.dir = 1


        this.draw()
    }

    draw(){
        //console.log(this)
        let arrow_size = 6
        //if(this.point1.y > this.point2.y){ this.dir = -1 }
        let shapness = xr/4

        let p1 = {x: this.point1.x +this.diff1.x, y: this.point1.y + this.diff1.y}
        let p2 = {x: this.point2.x +this.diff2.x, y: this.point2.y + this.diff2.y}
        let middle = {x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2}
        let self = this



        if (!this.element) {
            //console.log(edges)
            this.element = edges.group()
            this.path = this.element.path()

            this.path.marker('end', arrow_size, arrow_size, function(add) {
            add.path("M0,0 L"+arrow_size+","+arrow_size/2+" 0,"+arrow_size+" z").attr({"stroke-width":0,"stroke-linecap":"round", "stroke-linejoin":"round"})
            })

            this.mid = this.element.circle(6).cx(middle.x).cy(middle.y)
            this.element.dblclick(function() {
                self.remove()

            })
        }




        //console.log(this)
        this.path.plot([
            [ "M", p1.x, p1.y],
            [ "C", p1.x, p1.y+(shapness*this.dir), p1.x, middle.y, middle.x, middle.y],
            [ "C", p2.x, middle.y, p2.x, p2.y-(shapness*this.dir)-arrow_size, p2.x, p2.y]
        ]).attr({fill:"none","stroke": "#555",
        "stroke-width": 1,"stroke-linecap":"round", "stroke-linejoin":"round"})

        this.mid.cx(middle.x).cy(middle.y)


    }

    redraw( point1, point2){
        this.point1 = point1
        this.point2 = point2

        this.draw()
    }

    remove(){
        this.element.remove()
        console.log(pipe2.graph.e)
        console.log([this.id1, this.port1, this.id2, this.port2])
        let ndx =pipe2.graph.e.indexOf([this.id1, this.port1, this.id2, this.port2])
        console.log(ndx)
        if (ndx > -1) {
            pipe2.graph.e.splice(ndx, 1);
        }
        console.log(pipe2.graph.e)
        proc2()
    }
}






class FuncBox{
    constructor(obj){
        //console.log(obj)
        this.obj = obj
        this.r = 5
        this.id = obj.i

        this.links={out:[],in:[]}
        var self = this
        this.el = draw.group()
        this.el.attr("id", obj.i)
        this.note = this.el.text("")
        console.log(this.obj)
        let i = "inputs" in this.obj.func.abiObj? this.obj.func.abiObj.inputs.length: 0
        let o = "outputs" in this.obj.func.abiObj? this.obj.func.abiObj.outputs.length: 0
        let w = Math.max(i , o)

        let h = xr
        let clas = "s_content"
        let txt= this.obj.func.container.name +"\n" + this.obj.func.abiObj.name
        this.el.rect(xr*w, xr).attr({rx: this.r, ry: this.r, fill:"#ddd", "stroke-width":1,"opacity":0.4})
        this.text = this.el.foreignObject(w*xr, h*2)
        let id = this.text.attr("id")
        this.text.appendChild("div", {id: id+"_div"})
        $("#"+id+"_div").html('<div class="centred">'+txt+'</div>').addClass(clas)
        this.x = Math.random()*5*xr
        this.y = Math.random()*5*xr
        this.el.move(this.x, this.y)

        this.el.dblclick(function() {
            self.el.remove()
        })

        this.el.draggable()


        R.mapObjIndexed(function(x, key, all){
            //console.log(x, key)
            let point = {x:0,y:0}
            if (self.obj.func.abiObj.type == "port") {
                point = getPort(self.obj,"in", parseInt(key))
            } else {
                point = getPort(self.obj,"in", 1+parseInt(key))
            }

            //let point = getPort(self.obj, "in", 1+parseInt(key))

            let port = self.el.circle(10).center(point.x, point.y)
            self.el.text(x.name).attr({"text-anchor":"middle", "font-size":8, "font-family": "Roboto"}).move(point.x-8, point.y-12).transform({ rotation: -30 })
            port.mouseover(function(e){
                self.note.text(x.type)
                let node = self.obj.i
                endDrop = [node , parseInt(key)]
            })
            port.mouseout(function(e){
                self.note.text("")
                endDrop= false
            })
        }, this.obj.func.abiObj.inputs)

        R.mapObjIndexed(function(x, key, all){
            //console.log(x,self.obj,self.obj.func.abiObj.type,"outputs", key)
            let point = {x:0,y:0}

            if (self.obj.func.abiObj.type == "port") {
                point = getPort(self.obj,"out", parseInt(key))
            } else {
                point = getPort(self.obj,"out", 1+parseInt(key))
            }

            //console.log(point)
            let port = self.el.circle(10).center(point.x, point.y)
            port.mouseover(function(e){
                self.note.text(x.type)
                let node = self.obj.i
            })
            port.mouseout(function(e){
                self.note.text("")
            })
            self.el.text(x.name).attr({"text-anchor":"middle", "font-size":8, "font-family": "Roboto"}).move(point.x+8, point.y).transform({ rotation: -30 })

            port.draggable().on('beforedrag', function(e){
                //e.preventDefault()
                //e.stopPropagation()
                // no other events are bound
                let p = e.detail.event
                this.obj = draw.circle(12).center(p.layerX,p.layerY).back()
                // drag was completely prevented
            })
            port.on("dragend", function(e){
                console.log(e)
                let node = self.obj.i
                startDrop = [node, parseInt(key)]
                console.log(startDrop, endDrop)
                if (endDrop != false){
                    console.log(startDrop, endDrop)
                    let edge = startDrop.concat(endDrop)
                    console.log(edge)
                    pipe2.graph.e.push(edge)
                    console.log(pipe2.graph.e)
                    proc1()
                }
            })

            port.on("dragmove", function(e){
                e.preventDefault()
                e.stopPropagation()
                let p = e.detail.event
                this.obj.center(p.layerX,p.layerY)
            })
        }, this.obj.func.abiObj.outputs)



/*
         this.el.draggable(function(nx, ny){
             //console.log(nx)
             return {x:Math.round(nx/self.s)*self.s+s/2, y: Math.round(ny/(2*1.5*self.s))*2*self.s*1.5+s*0.75}
         })
        */
        this.el.on("dragmove",self.onDrag)


    }

    onDrag(e){
        let matrix = $(e.target).attr("transform")

        let id = $(e.target).attr("id")
        matrix = matrix.replace("matrix(","").replace(")","").split(",")
        let n = graph.nodes[id]
        //console.log(n)
        n.render.x  = parseInt(matrix[4])
        n.render.y  = parseInt(matrix[5])



        R.map(function(l){
            //console.log(l)
            l.redraw({x: parseInt(matrix[4]), y:parseInt(matrix[5])}, {x:l.point2.x  , y: l.point2.y }   )

            //l.redraw({x:l.point1.x, y:l.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )

        }, n.render.links.out)

        R.map(function(k){
            //console.log(k)
            k.redraw({x:k.point1.x, y:k.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )
        }, n.render.links.in)


    }

    redraw( lx, ly){
        this.el.attr({transform: "matrix(1,0,0,1,"+(lx)+","+(ly)+")"})
        let n = this
        let matrix = [0,0,0,0,lx,ly]

        R.map(function(l){
            l.redraw({x: parseInt(matrix[4]), y:parseInt(matrix[5])}, {x:l.point2.x  , y: l.point2.y }   )
        }, n.links.out)

        R.map(function(k){
            k.redraw({x:k.point1.x, y:k.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )
        }, n.links.in)
    }
}

export default loadAll;
