<template>
    <v-expansion-panel expand>
    <v-expansion-panel-content
      v-for="(item,i) in items"
      :key="i"
    >
      <div slot="header">
        <v-layout row wrap>
            <v-flex xs2>
                <v-tooltip top>
                    <v-btn
                        v-if="loadToRemix"
                        v-on:click.stop="$emit('load-remix', item)"
                        flat icon
                        slot="activator"
                    >
                        <v-icon light small>fa-upload</v-icon>
                    </v-btn>
                    <span>Load contract to Remix</span>
                </v-tooltip>
            </v-flex>
            <v-flex xs7>
                <v-tooltip right>
                    <v-btn
                        flat
                        v-on:click.stop="$emit('item-toggle', item)"
                        v-bind:class="[item.styleClasses, 'normaltxt']"
                        slot="activator"
                    >
                    {{item.name || 'NoName'}}
                    </v-btn>
                    <p>Load to Tree on the right</p>
                    <template
                        v-if="item.devdoc"
                    >
                        <p v-if="item.devdoc.title">{{item.devdoc.title}}</p>
                        <p v-if="item.devdoc.author">{{item.devdoc.author}}</p>
                    </template>
                </v-tooltip>
            </v-flex>
        </v-layout>
      </div>
      <v-list two-line>
        <template v-for="(item, index) in item.functions" v-if="item.abiObj.name">
            <v-tooltip right max-width="300">
              <v-subheader
                :key="item._id"
                v-bind:class="[item.styleClasses]"
                slot="activator"
              >
                <v-btn
                    block
                    flat
                    v-on:click="$emit('subitem-toggle', item)"
                    v-bind:class="[item.styleClasses, 'normaltxt']"
                >
                    {{ item.abiObj.name }}
                </v-btn>
              </v-subheader>
              <p class="text-sm-left" v-if="item.userdoc">{{item.userdoc.notice}}</p>
              <template
                  v-if="item.devdoc"
              >
                  <template
                      v-for="(param, index) in Object.keys(item.devdoc.params || {})">
                      <p class="text-sm-left">{{param}}: {{item.devdoc.params[param]}}</p>
                  </template>
                  <p class="text-sm-left" v-if="item.devdoc.return">Returns: {{item.devdoc.return}}</p>
              </template>
            </v-tooltip>
        </template>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
    props: ['items', 'loadToRemix'],
}
</script>
