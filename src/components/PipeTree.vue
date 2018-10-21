<template>
    <v-expansion-panel>
    <v-expansion-panel-content
      v-for="(item,i) in items"
      :key="i"
    >
      <div slot="header">{{item.name}}</div>
      <v-list two-line>
        <template v-for="(item, index) in item.functions">
          <v-subheader
            :key="item._id"
          >
            <v-btn
                block
                flat
                v-on:click="$emit('item-toggle', item)"
            >
                {{ item.abiObj ? item.abiObj.name : '' }}
            </v-btn>
          </v-subheader>

          <v-divider
            :inset="true"
            :key="index"
          ></v-divider>
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
