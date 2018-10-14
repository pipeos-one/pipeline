<html lang="en">
<head>
  <meta charset="utf-8">

  <title>Pipeline</title>
  <meta name="description" content="The HTML5 Herald">
  <script src="lib/svg.js"></script>

  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="lib/pug.js"></script>
  <script src="lib/rounding.js"></script>
  
  <script src="lib/svg.foreignobject.js"></script>
  <script src="lib/svg.draggable.js"></script>
  <script src="lib/dagre.js"></script>
  <script src="lib/split.js"></script>
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>


  

  <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.3.5/css/swiper.min.css">

  <script src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.3.5/js/swiper.js"></script>

  <script src="lib/tui-code-snippet.js"></script>
  <script src="https://uicdn.toast.com/tui-tree/latest/tui-tree.js"></script>
 
  <link rel="stylesheet" type="text/css" href="lib/tui-tree.css">

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
<div class="swiper-container">
        <!-- Additional required wrapper -->
        <div class="swiper-wrapper">
            <!-- Slides -->
           
            <div class="swiper-slide no-swipe">
                    <button type="button" class="btn btn-outline-dark">
                        <span class="fas fa-paste" aria-hidden="true"></span>
                    </button>
                    <div class="example-3">
                            <div id="one" class="split split-vertical">
                                    <div id="tui-tree-container" class="tui-tree-wrap"></div>
                            </div>
                            <div id="two" class="split split-vertical">
                                    <p>Set</p>
                            </div>
                    </div>
            </div>
            <div class="swiper-slide no-swipe">
                    <div id="draw"></div>
            </div>
            <div class="swiper-slide">Slide 4</div>
            <div class="swiper-slide">Slide 5</div>
            <div class="swiper-slide">Slide 6</div>
            <div class="swiper-slide">Slide 7</div>
            <div class="swiper-slide">Slide 8</div>
            <div class="swiper-slide">Slide 9</div>
            <div class="swiper-slide">Slide 10</div>
            <div class="swiper-slide">Slide 11</div>
        </div>

    
        <!-- If we need navigation buttons -->
        <div class="swiper-button-prev"></div>
        <div class="swiper-button-next"></div>
    
    </div>



            


<script>

/*
require({
  paths: {
    'browser-pug': 'https://unpkg.com/browser-pug@0.1.0/browser-pug'
  }
}, ['browser-pug']);
*/
//var pug = require(['pug']);




function round(x , l){
    let f = (Math.floor(x/l) + 1)*l
    return f;
}









class Manhattan {

    constructor(m1, x1,y1, m2, x2,y2,width){
        //super(x1, y1, x2, y2, width)
        this.ray = 5
        this.offset = 6
        this.init=[x1,y1,x2,y2]
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.m1 = m1;
        this.m2= m2;
        this.mx1 = x1 +m1.e
        this.my1 = y1 +m1.f
        this.mx2 = x2 +m2.e
        this.my2 = y2 +m2.f
        this.width = width;
        this.links = []
        console.log(this)

        
        this.render()
    }

    render(){
        this.element= draw.group()
        graph.edges[this.element.attr("id")] = this
        let path = "";
        let arrow_size = 10
        //let 
        let tol = Math.floor(Math.abs(this.y2 - this.y1 +this.m1.f - this.m2.f)/4 -Math.random()* Math.abs(this.my2 - this.my1)/4)
        let mid = [(this.x1+this.x2+this.m1.e+this.m1.e)/2,(this.y2+this.y1+this.m2.f+this.m2.f+tol)/2  ]
        path += "M" + this.mx1 + "," + this.my1;

        path += " L"+ this.mx1 +"," + (this.my1+this.offset);
        path += " L"+ this.mx1 +"," + mid[1];
        //path += " L"+ mid[0] +"," + mid[1];
        path += " L"+ this.mx2+ "," + mid[1];
        path += " L" + this.mx2+ ","+(this.my2-this.offset-arrow_size );
        path += " L" + this.mx2 +","+ (this.my2-arrow_size);
        console.log(path)
        this.roundpath = roundPathCorners(path, this.ray, false) 
        //console.log(path)


        this.path = this.element.path(this.roundpath).attr({fill:"none","stroke": "#555", 
        "stroke-width": this.width,"stroke-linecap":"round", "stroke-linejoin":"round"})
        this.path.marker('end', arrow_size, arrow_size, function(add) {
            add.path("M0,0 L"+arrow_size+","+arrow_size/2+" 0,"+arrow_size+" z").attr({"stroke-width":0,"stroke-linecap":"round", "stroke-linejoin":"round"})

            this.fill('#555')
        })
    }

    redraw(m1, m2){
        //this.element.remove()

        this.m1 = m1
        this.m2 = m2
        this.mx1 = this.x1 +m1.e
        this.my1 = this.y1 +m1.f
        this.mx2 = this.x2 +m2.e
        this.my2 = this.y2 +m2.f

        let ray = 5
        let offset = 20
        let path = "";
        let tol = Math.floor(-Math.abs(this.my2-this.my1)/4 +Math.random()* Math.abs(this.my2-this.my1)/4)
        //console.log(tol)
        //console.log(this.y2,this.y1,tol, this.y2+this.y1+tol)

        let mid = [(this.mx1+this.mx2+tol)/2,(this.my2+this.my1+tol)/2  ]
        path += "M" + this.mx1 + "," + this.my1;

        if (dir == "TB") {
            path += " L"+ this.mx1 +"," + (this.y1+this.offset );
            path += " L"+ this.mx1 +"," + mid[1];
            //path += " L"+ mid[0] +"," + mid[1];
            path += " L"+ this.mx2+ "," + mid[1];
            path += " L" + this.mx2+ ","+(this.my2-this.offset-5 );
            path += " L" + this.mx2 +","+ (this.my2-5);
        } else {
            path += " L"+ (this.mx1+this.offset) +"," + (this.my1 );
            path += " L"+  mid[0] +"," + (this.my1 );
            //path += " L"+ mid[0] +"," + mid[1];
            path += " L"+ mid[0] + "," + this.my2;
            path += " L" + (this.mx2 -this.offset-5 )+ ","+(this.my2 );
            path += " L" + (this.mx2-5) +","+ (this.my2);
        }

        
        //console.log(path)
        this.roundpath = roundPathCorners(path, this.ray, false) 

        this.path.plot(this.roundpath)



        //this.renderu()
    }

    remove(){
        this.element.remove()
    }


}



function proc(){
    g.setGraph({rankdir: "LR", align: "UL", nodesep: 30, ranksep:30});
    let t = {}
    dagre.layout(g);
    //draw.clear()
    menu()
   

console.log(g.nodes())
    let ns = g.nodes()
    for (let i in ns) {
        if (  ns[i] != "undefined") {
            t = graph.nodes[ns[i]]
            console.log(t)
            t.redraw(g.node(ns[i]).x,g.node(ns[i]).y)
        }
    }

}

//var tui = require(["tui-tree"])
var Tree = tui.Tree;
var g, dir, graph, draw, x, y, temp={}, portIn=[], links
var pug = require(["pug"])
//console.log("data1")
$.getJSON("json/contracts_source.json",
    function (data) {
        //console.log("data")
        R.map(function(item){
            $("#browse").html($("#browse").html()+item.name+" <br>")
        } , data)
    }
)



function init(){

    
var container = document.getElementById('tui-tree-container');

var mySwiper = new Swiper ('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,
    slidesPerView: "auto",
        noSwiping: true,
        noSwipingClass: "no-swipe",


    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

  })

Split(['#one', '#two'], {
    sizes: [75, 25],
    minSize: 100,
    direction: 'vertical'
});
/*
g= new dagre.graphlib.Graph();
g.setDefaultEdgeLabel(function() { return {}; });
*/

x = 30, y=  x*1.5
r = 5, sh = null, links={out:[],in:[]}

dir = "TB"
//graph = {nodes:{}, edges:{}}, temp={}, onPort = false, portIn={}


var P = {funcs:[], env:{}}



var kids = R.compose(R.map(R.zipObj(['text'])), R.toPairs ) //R.keys, );

var ABIkids = R.compose(R.map(R.zipObj(['text'])), R.toPairs ) 

/*
var pattern = draw.pattern(x+1, 2*(y+1), function(add) {
    add.line(3,1,3, 5)
    add.line(0, 1, 6 ,1)
    add.attr({"stroke-width":.3})
})
pattern.move(x/2+1, y/2+1)

draw.rect("100%","100%").attr({ fill: pattern })
*/
//menu()

$.getJSON("json/abis.json", {},
    function (data, textStatus, jqXHR) {
        //console.log(data)
        //console.log(ABIkids(data))
        var data2 = [
            {text: 'Contracts', children: ABIkids(data)},
            {text: 'R', children: kids(R)},
        ];

        var instance = new Tree(container, {
            data: data2,
            nodeDefaultState: 'opened'
        });

        $(".tui-tree-text").click(function(e){
            console.log(e)
            //console.log(e.currentTarget.textContent)
            let $el = $(e.currentTarget)
            let f = getParamNames(R[e.currentTarget.textContent])
            new Box3( x, 4,3, {label: e.currentTarget.textContent, ports:{ins:f, outs:["out"], func:{js:R[e.currentTarget.textContent]}}})
        })
    }
);



}



class Box3 {
    coord(outs, ndx){
        console.log(this.anchors.out[parseInt(ndx)],outs,ndx)
        let a = this.anchors[outs? "out" : "in"][parseInt(ndx)]
        return {x: a.cx(), y: a.cy()}
    }
    constructor(s, x1, y1, obj){
        this.el = draw.group().addClass("node")
        this.id = this.el.attr("id")
        let txt = obj.label
        this.links ={in:[],out:[]}
        graph.nodes[this.id] = this
        
        let h = s * 1.5
        
        this.s = s
        let sx = s * x1
        let sy = s * y1
        this.init = [sx, sy]
        let r = 5
        let rp = 12
        let strokeW =2
        let clas = "s_content"
        let bg = "#fff"
        //let h = s
        let w = Math.max(1, obj.ports.ins.length, obj.ports.outs.length) * s
        console.log(this.id, txt)
        g.setNode(this.id,    { label: txt,  width: w, height: h });
        
        this.border = this.el.rect(w, h).attr({rx:r, ry:r, fill:"#fff", "stroke-width":2,"opacity":0.8})
        this.text = this.el.foreignObject(w+20, h-20).dmove(0,10)
        let id = this.text.attr("id")
        this.text.appendChild("div", {id: id+"_div"})
        $("#"+id+"_div").html('<div class="centred">'+txt+'</div>').addClass(clas)
        this.el.move(sx , sy)
        
       
        let self = this
        let in2 
        this.ports = this.el.group()
        this.ins = this.ports.group()
        this.anchors = {in:[], out:[]}
        for (var in1 in obj.ports.ins){
            in2 = this.ins.circle(rp).center(parseInt(in1)*s  + s/2,  h*0 + rp/2- strokeW ).attr({stroke:bg, "stroke-width":strokeW})
            in2.on("mouseover", function(e){
                onPort = true
                portIn = $(e.target)
            })
            in2.on("mouseout", function(e){
                onPort = false
            })
            in2.attr({"data-node-id": this.id, "data-port": in1})
            this.anchors.in.push(in2)
            console.log(obj.ports.ins[in1])


            this.ins.text(obj.ports.ins[in1].name).attr({"text-anchor":"middle", "font-size":10, "font-family": "Roboto"}).move(parseInt(in1)*s  + s/2,  h*0 - rp/2- x/3)
        }
        this.outs = this.ports.group()
        let port1

        this.pfunc = this.outs.circle(rp).center(0-strokeW*2,  h*1 - rp+strokeW).attr({"data-node-id": this.id,stroke:bg, "stroke-width":strokeW, "data-port": 0})
        this.porting(this.pfunc)
        this.anchors.out.push(this.pfunc)


        for (var out1 in obj.ports.outs){
            port1 = this.outs.circle(rp).center(parseInt(out1)*s + s/2, + h*1 - rp/2+strokeW).attr({stroke:bg, "stroke-width":strokeW})
            this.porting(port1)
            this.anchors.out.push(port1)
            port1.attr({"data-node-id": this.id, "data-port": 1+ parseInt(out1)})

            this.ins.text(obj.ports.outs[out1].name).attr({"text-anchor":"middle", "font-size":10, "font-family": "Roboto"}).move(parseInt(out1)*s  + s/2,  h*1 - rp/2 + x/3)
        }

        

        this.el.dblclick(function() {
            self.el.remove()
        })
        

         this.el.draggable(function(nx, ny){
             //console.log(nx)
             return {x:Math.round(nx/self.s)*self.s+s/2, y: Math.round(ny/(2*1.5*self.s))*2*self.s*1.5+s*0.75}
         })
         this.el.on("dragmove",self.onDrag)


        //this.resize = this.el.circle(10).move(x-15, y-15).addClass("resizeHandleOverlay")
        /*
        this.resize.draggable().on("dragmove", function(e){
            console.log(e.detail.p)
            let dim = e.detail.p
            self.border.width(dim.x+15)
            self.border.height(dim.y+15)
            self.text.width(dim.x+5)
            self.text.height(dim.y+5)
        })
        */
    }

       

    porting(port){
        let self = this
        port.draggable().on('beforedrag', function(e){
            let ev = e.detail.event
            console.log(e)
            //e.preventDefault()
            let el = $(e.detail.handler.el)
            let p = e.detail.event
            //let point = new SVG.Point(el.attr("cx"),el.attr("cy"))
            console.log(e.detail.handler.p)
            //point.transform(e.detail.handler.m)
            //console.log(point)
            //console.log(el.x, el.y, ev.layerX, ev.layerY, 1)
            //console.log(e.detail.handler)
            //let link =  new Manhattan(self.el.transform(), p.layerX, p.layerY, new SVG.Matrix(),ev.layerX, ev.layerY, 1)
            let m1 = self.el.transform()
            //let m2 = new SVG.Matrix()
            console.log(m1, el, ev)
            let link =  new Smooth({x:m1.e, y:m1.f},{x:m1.e+port.cx(), y:m1.f+port.cy()}, {x:port.cx(), y:port.cy()} , {x:0, y:0})  // {x:ev.clientX, y:ev.clientY}
            let id = el.id
            console.log(el.attr("id"))
            temp[id] = link
            el.attr({"data-temp-link": link.element.attr("id")})
            // no other events are bound
            // drag was completely prevented
            }).on('dragmove', this.dragPort).on('dragend', this.linkIt)
    }
    
        

    

    linkIt(e){
        console.log(e)
        console.log("link")
        let link = temp[$(e.target).attr("data-temp-link")]
        let source = graph.nodes[$(e.target).attr("data-node-id")]
        
        if (onPort){
            let tg = graph.nodes[$(portIn).attr("data-node-id")]
            let sp = $(e.target).attr("data-port")
            let tp = $(portIn).attr("data-port")
            link.remove()
            g.setEdge($(e.target).attr("data-node-id"),  $(portIn).attr("data-node-id"));
            makeLink(source.id, tg.id, sp, tp)

            //link.redraw(link.init[0],link.init[1], portIn.attr("cx"), portIn.attr("cy"))
        } else {
            link.remove()
        }
    }

    redraw(lx, ly){
        this.el.attr({transform: "matrix(1,0,0,1,"+(lx)+","+(ly)+")"})

        let matrix = [0,0,0,0,lx,ly]

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

            // k.init[2]+
        }


    }

    help(el, div, port1){
        el.on("mouseover", function(e){
                e.stopPropagation()
                let ele = $("#"+div)
                ele.show()
                if (port1) { 
                    onPort = true
                    portIn = $(e.target)
                }
            })
        el.on("mouseout", function(e){
            e.stopPropagation()
            console.log(e)
            let ele = $("#"+div)
            ele.hide()
            onPort = false
        })

       
    }
    onDrag(e){
        //console.log(e.detail.event.movementX,e.detail.event.movementY,e.target)
        let de = e.detail.event
        let id = $(e.target).attr("id")
       
        let matrix = $(e.target).attr("transform")
        matrix = matrix.replace("matrix(","").replace(")","").split(",")
        //console.log(nodes[id])
        for (let i in graph.nodes[id].links.out){
            let l = graph.nodes[id].links.out[i]
            //let l = graph.nodes[id].links.in[i]
            //console.log(de.movementX)  // de.movementX
            //l.redraw(l.x1, l.y1, l.init[2] + parseInt(matrix[4]), l.init[3] + parseInt(matrix[5]) )
            l.redraw({x: parseInt(matrix[4]), y:parseInt(matrix[5])}, {x:l.point2.x  , y: l.point2.y }   )
            // + parseInt(matrix[4])
        }

        for (let i in graph.nodes[id].links.in){
            let k = graph.nodes[id].links.in[i]
            //let l = graph.nodes[id].links.in[i]
            console.log(matrix)  // de.movementX
            //l.redraw(l.x1, l.y1, l.init[2] + parseInt(matrix[4]), l.init[3] + parseInt(matrix[5]) )
            k.redraw({x:k.point1.x, y:k.point1.y},{x: parseInt(matrix[4]), y:parseInt(matrix[5])}    )

            // k.init[2]+
        }
    }

    dragPort(e){
        e.preventDefault()
        let ev = e.detail.event
        let el = $(e.target).attr("id")
        let link = temp[$(e.target).attr("data-temp-link")]

        //console.log(draw.parent().offsetLeft, draw.parent().offsetTop)
        link.redraw({x:link.point1.x,y:link.point1.y},{x: ev.clientX+2 - $("#draw").parent().offset().left, y:ev.clientY-6 })

    }

    
/*
    move1(x1, y1){
        this.el.transform({ a:1, b: 0, c: 0, d: 1, e: 0, f: 0})
        this.text.center(x1,y1)
        this.border.center(x1,y1)
    }
    */
}



//var link = new Smooth({x:100,y:100}, {x:200, y:200}, {x: 30, y:40}, {x:20, y:5})

function menu(){
    let pro = draw.circle(25).center(0,0).attr({"fill":"#ddd"})
    pro.on("click", function(){
        dir = "TB"
        proc2()
    })

    let pro2 = draw.circle(25).center(40,0).attr({"fill":"#ddd"})
    pro2.on("click", function(){
        dir = "TB"
        proc3()
    })

}



var makeLink = function(n1, n2, p1, p2){
    console.log(n1,n2,p1,p2)
    let c1 = graph.nodes[n1].coord(true, p1)
    let c2 = graph.nodes[n2].coord(false, p2)
    console.log(c1,c2)
    let pp1 = graph.nodes[n1].anchors.out[p1]
    //let m1 = graph.nodes[n1].transform()
    let m1 = new SVG.Matrix(graph.nodes[n1].el)
    let tp1 = new SVG.Point(pp1.cx(), pp1.cy()).transform(m1)
    let pp2 = graph.nodes[n2].anchors.in[p2]
    //let m2 = graph.nodes[n2].transform()
    let m2 = new SVG.Matrix(graph.nodes[n2].el)
    let tp2 = new SVG.Point(pp2.cx(), pp2.cy()).transform(m2)
    console.log(m1, c1.x, c1.y, m2, c2.x, c2.y)
    //let link = new Manhattan(m1, c1.x, c1.y, m2, c2.x, c2.y, 1)
    let link = new Smooth({x:m1.e, y: m1.f},  {x: m2.e, y:m2.f},{x: c1.x,y: c1.y}, {x:c2.x,y: c2.y}, 1)
    g.setEdge(n1,   n2);
    graph.nodes[n1].links.out.push(link)
    graph.nodes[n2].links.in.push(link)
    return link
}



function proc(){
    g.setGraph({rankdir: "TB", align: "UL", nodesep: x, ranksep:1.5*x});
    let t = {}
    dagre.layout(g);
    //draw.clear()
    
   
    
    g.nodes().forEach(function(v) {
        //console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
        // kbacon: {"label":"Kevin Bacon","width":121,"height":100,"x":264,"y":350}
        console.log(v)
        if (  v != undefined) {
            t = graph.nodes[v]
            console.log(v)
            t.redraw(g.node(v).x,g.node(v).y)
            
        }
        
    });
/*
console.log(g.nodes())
    let ns = g.nodes()
    for (let i in ns) {
        if (  ns[i] != "undefined") {
            t = graph.nodes[ns[i]]
            console.log(t)
            t.redraw(g.node(ns[i]).x,g.node(ns[i]).y)
        }
    }
*/
}

//proc()



//console.log(kids(R))


var prt = function(x1){
    return "printtt "+(x1*2)
}

var toSource = function(g1){
    console.log(g1)
    let ports = {in:[], out:[]}
    let gb = graphBox(g1, ports)
    console.log("gb",gb)


}

var graphBox = function(g1, ports){
    let out = {in:[], out:[]}
    console.log(g1)
    R.mapObjIndexed(function(num, key, obj){
        console.log(obj[key].links.out, out)
        if (obj[key].links.out.length>0){
            out.out.concat(obj[key].links.out)
        }
        if (obj[key].links.in.length>0){
            out.in.concat(obj[key].links.in)
        }
        out.out = out.out.concat(obj[key].links.out)
        out.in = out.in.concat(obj[key].links.in)
        console.log(out)
    }, g1.nodes)
    return out

}

var toSources= function(){
    //let src = pug.render("|vai \n= prt("+x1+")", {authenticated: true})
    //console.log(src)

    
    //console.log(graph)
    
    let graphs = [graph]
    R.map(toSource, graphs)


}










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
    console.log(funcObj, io, ndx)
    let y = 0
    if (io == "out") {
        y = xr
    }
    if (ndx == 0 && funcObj.func.abiObj.type != "port") {
        if (io == "out") return {x: -10, y: 15}
        return {x: -10, y: xr-15}
    }

    if (funcObj.links[io][ndx-1] && funcObj.func.abiObj.type != "port"){
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
        console.log(n1,n2,x)

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
            if (x.links.in[key+1] == undefined){
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
            if (x.links.out[key+1] == undefined){
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
        console.log(this)
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
            console.log(x, key)
            let point = getPort(self.obj, "in", 1+parseInt(key))
            
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
            console.log(x,self.obj,self.obj.func.abiObj.type,"outputs", key)

            if (self.obj.func.abiObj.type == "port") {
                let point = getPort(self.obj,"out", parseInt(key))
            } else {
                let point = getPort(self.obj,"out", 1+parseInt(key))
            }
            
            console.log(point)
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