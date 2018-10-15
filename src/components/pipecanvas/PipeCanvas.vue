<template>
    <div id="draw">
        Canvas
    </div>
</template>

<script>
import loadAll from './pipecanvaslib.js';

export default {
    props: ['items'],
    watch: {
        items: function(newItems, oldItems) {
            console.log(newItems, oldItems);
        }
    },
    mounted: function () {
      // this.$nextTick(function () {
      //   // Code that will run only after the
      //   // entire view has been rendered
      // })
      console.log('loadAll', loadAll)
      console.log(document.getElementById('draw'))
      //loadAll();
    }
}
</script>

<style>
    /* html,body,#draw,#four, #three, .example-2 {
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
 */

</style>
