<template>
    <div :id="id" class="fullheight"></div>
</template>

<script>
export default {
    props: ['id'],
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
}

.s_content {
    color: #111;
    font-family: "Roboto Condensed", sans-serif;
    font-size: 10px;
    padding-left: 4px;
    text-align: left;
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
    font-family: "Roboto Condensed", sans-serif;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: default;
}

.welcome{
    fill: "green";
    stroke: "green";
    stroke-width: 3;
}
</style>
