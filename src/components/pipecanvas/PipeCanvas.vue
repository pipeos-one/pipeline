<template>
    <div id="draw"></div>
</template>

<script>
import loadAll from './pipecanvaslib.js';

const ports = [
    {
      "_id": "5bc59e192817116e84bdd830",
      "containerid": "5bc59e192817116e84bdd82f",
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
      "containerid": "5bc59e192817116e84bdd82f",
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
    {
    "_id": "5bc59e192817116e84bdd82f",
    "name": "PipeOS",
    "abi": [
      {
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
      {
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
      }
    ],
    "devdoc": {
      "methods": {},
      "title": "PipeOS Utils."
    },
    "userdoc": {
      "methods": {}
    },
    "bytecode": "",
    "solsource": " ",
    "jssource": "",
    "timestamp": "2018-10-16T08:10:33.614Z"
  }
]
const graph = {"n": [], "e": []}



export default {
    props: ['items', 'containers'],
    watch: {
        items: function(newItems, oldItems) {
            console.log(newItems, oldItems);
        }
    },
    mounted: function () {
        if (this.containers.length > 0 && this.items.length > 0) {
            this.items = this.items.concat(ports)
            this.containers = this.containers.concat(containers)
            loadAll('draw', this.containers, this.items, graph);
        }
    },
    watch: {
        items: function() {
            console.log('watch PipeCanvas')
            console.log('containers', this.containers.length, this.containers)
            console.log('items', this.items.length, this.items)
            let ids = []
            graph.n = this.items.map(item => {
                ids.push(item._id);
                return {
                    i: ids.filter(it => it == item._id).length,
                    id: item._id,
                }
            });
            //graph.n = graph.n.concat(ports);
            
            if (this.containers.length > 0 && this.items.length > 0) {
                loadAll('draw', this.containers, this.items, graph);
            }
        }
    }
}
</script>

<style>
.swiper-container {
    display: initial;
}

#draw {
    width: 100%;
    height: 100%;
    margin: 0px;
    padding: 0px;
    font-family: sans-serif;
}

.s_content {
    color: #111;
    font-family: "Roboto Condensed", sans-serif;
    font-size: 10px;
    display: -webkit-box;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    height: 32;
}

.centred {
    display: block;
    padding-left: 4px;
    font-family: "Roboto Condensed", sans-serif;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
}
</style>
