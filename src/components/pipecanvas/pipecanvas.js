<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Pipeline</title>
  <meta name="description" content="The HTML5 Herald">
  <script src="lib/svg.js"></script>

  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>

  
  
  <script src="lib/svg.foreignobject.js"></script>
  <script src="lib/svg.draggable.js"></script>
  <script src="lib/dagre.js"></script>



  




  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <script src="lib/ramda.js"></script>

  <style>
      html,body,#draw,#four, #three, .example-2 {
          width: 100%;
          height: 100%;
          margin: 0px;
          padding: 0px;
          font-family: sans-serif;
      }

      #help, #help2 {
          display: none;
          position: absolute;
          top: 20%;
          margin: 20%;
      }

       .split {
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .gutter {
    background-color: #eee;
    background-repeat: no-repeat;
    background-position: 50%;
  }
  .gutter.gutter-horizontal {
    background-image: url('grips/vertical.png');
    cursor: ew-resize;
  }
  .gutter.gutter-vertical {
    background-image: url('grips/horizontal.png');
    cursor: ns-resize;
  }
  .split.split-horizontal, .gutter.gutter-horizontal {
    height: 100%;
    float: left;
  }


  .s_content {
        color: #111;
        font-family: "Roboto Condensed", sans-serif;
        

        font-size: 10px;
        /*position: relative; */

        display: -webkit-box;
/*display: -ms-flexbox;
display: flex;*/
/* overflow: hidden; */
-webkit-box-align: center;
-ms-flex-align: center;
align-items: center;
-webkit-box-pack: center;
-ms-flex-pack: center;
justify-content: center;
/*margin: 12px 1px;*/
height: 32;
/* calc(100% - 24px); */
        
    }

    .centred {
        /* position: absolute; */


        display: block;

padding-left: 4px;

font-family: "Roboto Condensed", sans-serif;
/*color: #a7a7a7;*/
white-space: pre;
overflow: hidden;
text-overflow: ellipsis;
cursor: default;
        
  
    }


html, body, .swiper-container {
        height: 100%;
        margin: 0;
        padding: 0;
        font-family: sans-serif;
    }
.swiper-container {
    width: 100%;

}

.swiper-slide {
    width: 85%;
}
.swiper-slide:nth-child(2n+1) {
    width: 15%;
}
  
  
  </style>

</head>

<body onload="">


    <!-- init() Slider main container
     <div class="swiper-slide">
                <div id="browse"></div>

            </div>
    
    -->
<div >

                    <div id="draw"></div>

        </div>





            


<script>







var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
     result = [];
  return result;
}

var pipe2={}
draw = SVG("draw")
var edges = draw.group(), funcs, gra, gre
graph = {nodes:{}, edges:{}}, temp={}, onPort = false, portIn={}
var g= new dagre.graphlib.Graph();
g.setGraph({rankdir:"TB", align:"UL"});
// edgesep: xr, nodesep:xr, ranksep:xr, 
g.setDefaultEdgeLabel(function() { return {}; });
var graphn
var xr =32
var startDrop, endDrop

//menu()


function load(file, key, cb){
    $.getJSON(file, {},
        function (data, textStatus, jqXHR) {
            pipe2[key] = data
            if (cb) cb()
        }
    );
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
    gr = R.clone(pipe2.graph.n)
    gre = R.clone(pipe2.graph.e)
    console.clear()
    
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
    console.log(gr)
    console.log(gre)


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
        //console.log(x)
        R.mapObjIndexed(function(x1, key, all){
            //console.log(x1)
            //console.log(x.links.in[key], key)
            if (x.links.in[parseInt(key)+1] == undefined){
                inc++
                //let t = {i: inc, func: {abiObj: {inputs:[],outputs:[{ name: "out", type:x1.type}], name:"PortIn"}, container:{name:"PipeOS"}}, links:{in:{},out:{0:x.i}}}
                let t = {i: inc, id: "5bb70817738d090ce531e760", links:{in:{},out:{0:x.i}}}
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
                t = {i: inc, id: "5bb70817738d090ce531e761", links:{in:{0:x.i},out:{}}}
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
        //console.log(this.obj)
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
/*
        for (let i in this.links.out){
            let l = this.links.out[i]
            //let l = graph.nodes[id].links.in[i]
            //console.log(de.movementX)  // de.movementX
            //l.redraw(l.x1, l.y1, l.init[2] + parseInt(matrix[4]), l.init[3] + parseInt(matrix[5]) )
            l.redraw({x:matrix[4], y:matrix[5]}, {x:l.point2.x,y: l.point2.y }   )
            // + parseInt(matrix[4])
        }

        for (let i in this.links.in){
            let k = this.links.in[i]
            //let l = graph.nodes[id].links.in[i]
            //console.log(de.movementX)  // de.movementX
            //l.redraw(l.x1, l.y1, l.init[2] + parseInt(matrix[4]), l.init[3] + parseInt(matrix[5]) )
            k.redraw( {x:k.point1.x,y: k.point1.y}, {x:matrix[4], y:matrix[5]}    )
        }
*/
        //console.log("N",n)
        R.map(function(l){
            l.redraw({x: parseInt(matrix[4]), y:parseInt(matrix[5])}, {x:l.point2.x  , y: l.point2.y }   )
        }, n.links.out)

        R.map(function(k){
            k.redraw({x:k.point1.x, y:k.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )
        }, n.links.in)
    }
}





load("json/containers.json", "contracts", function(){
    load("json/functions.json", "functions", function(){
        load("json/graph.json", "graph", proc1)
    })
})
//load("json/functions.json", "functions")
//load("json/graph.json", "graph", proc1)


//console.log(d)
/*
R.pipe(
  cssQuery('.tui-tree-text'),
  R.forEach(setStyle({ color:'red' })),
)(document)
*/
//menu()

//proc()
</script>
  
</body>
</html>