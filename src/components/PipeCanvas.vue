<template>
    <div id="pipecanvas">
        Canvas
    </div>
</template>

<script>
export default {
    props: ['items'],
    watch: {
        items: function(newItems, oldItems) {
            console.log(newItems, oldItems);
        }
    }
}
</script>
