<template>
    <div id="draw"></div>
</template>

<script>
import loadAll from './pipecanvaslib.js';

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
            graph.n = this.items.map((item, index) => {
                return {
                    i: index,
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
