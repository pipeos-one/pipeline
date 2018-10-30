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
            <v-tooltip right>
                <v-btn
                    block
                    flat
                    slot="activator"
                    v-on:click="$emit('item-toggle', item)"
                    v-bind:class="[item.styleClasses, 'normaltxt']"
                >
                    {{ item.abiObj.name }}
                </v-btn>
                <p class="text-sm-left" v-if="item.userdoc">{{item.userdoc.notice}}</p>
                <template
                    v-if="item.devdoc"
                >
                    <template
                        v-for="(param, index) in Object.keys(item.devdoc.params)">
                        <p class="text-sm-left">{{param}}: {{item.devdoc.params[param]}}</p>
                    </template>
                    <p class="text-sm-left" v-if="item.devdoc.return">Returns: {{item.devdoc.return}}</p>
                </template>
              </v-tooltip>
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
