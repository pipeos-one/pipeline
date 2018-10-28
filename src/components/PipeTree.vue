<template>
    <v-expansion-panel expand>
    <v-expansion-panel-content
      v-for="(item,i) in items"
      :key="i"
    >
      <div slot="header">{{item.name}}</div>
      <v-list two-line>
        <template v-for="(item, index) in item.functions" v-if="item.abiObj.name">
          <v-subheader
            :key="item._id"
            v-bind:class="[item.styleClasses]"
          >
            <v-btn
                block
                flat
                v-on:click="$emit('item-toggle', item)"
                v-bind:class="[item.styleClasses, 'normaltxt']"
            >
                {{ item.abiObj.name }}
            </v-btn>
          </v-subheader>
        </template>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
    props: ['items']
}
</script>
