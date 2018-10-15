<template>
    <div id="draw"></div>
</template>

<script>
import loadAll from './pipecanvaslib.js';

// const graph = {
//     "_id": "5bae6999e4a589fae995349",
//     "n": [
//         {
//             "i": 2003,
//             "id": "5bba0aed32268e682b134b04"
//         },
//         {
//             "i": 2006,
//             "id": "5bba0aed32268e682b134b04"
//         },
//         {
//             "i": 2008,
//             "id": "5bba0aa845adbae4ce4c1171"
//         },
//         {
//             "i": 2011,
//             "id": "5bba0aa845adbae4ce4c116f"
//         }
//     ],
//     "e": [
//         [ 2006,1,2003,1],
//         [2006,1,2003,3],
//         [2011, 1, 2006,1 ]
//
//     ]
//
// }
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
            loadAll('draw', this.containers, this.items, graph);
        }
    },
    watch: {
        items: function() {
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
