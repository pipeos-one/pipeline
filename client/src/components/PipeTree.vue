<template>
    <v-expansion-panel>
        <v-expansion-panel-content
          v-for="(item,i) in items"
          :key="i"
        >
            <template slot="actions">
                <v-icon class="treeIcon" small>fa-sort-down</v-icon>
            </template>
            <template slot="header">
                <div>
                    <v-tooltip top v-if="loadToRemix">
                        <v-btn
                            v-on:click.stop="$emit('load-remix', item)"
                            flat icon small
                            slot="activator"
                        >
                            <v-icon light small>fa-upload</v-icon>
                        </v-btn>
                        <span>Load contract to Remix</span>
                    </v-tooltip>

                    <v-btn v-if="removeItem"
                        v-on:click.stop="$emit('remove-item', item)"
                        flat icon small
                    >
                        <v-icon light small>fa-times</v-icon>
                    </v-btn>

                    <v-tooltip right v-if="loadToTree">
                        <span
                            slot="activator"
                            class="text-xs-left caption font-weight-medium"
                            v-on:click.stop="$emit('item-toggle', item)"
                            style="padding-left:5px;"
                        >
                            {{item.name || 'NoName'}}
                        </span>
                        <p>Load to workspace</p>
                        <template
                            v-if="item.devdoc"
                        >
                            <p v-if="item.devdoc.title">{{item.devdoc.title}}</p>
                            <p v-if="item.devdoc.author">{{item.devdoc.author}}</p>
                        </template>
                    </v-tooltip>
                    <span class="text-xs-left caption font-weight-medium" v-if="!loadToTree" style="padding-left:5px;">{{item.name || 'NoName'}}</span>
                </div>
            </template>
            <v-list dense>
                <template v-for="(item, index) in item.functions" v-if="item.pfunction.gapi.name">
                    <v-tooltip right max-width="250">
                        <v-list-tile
                            :key="item._id"
                            slot="activator"
                            v-bind:class="[item.styleClasses]"
                            @click="$emit('subitem-toggle', item)"
                        >
                            <v-list-tile-content>
                              <v-list-tile-title class="caption" v-html="item.pfunction.gapi.name"></v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                      <p class="text-sm-left" v-if="item.pfunction.natspec">{{item.pfunction.natspec.notice}}</p>
                      <template
                          v-if="item.pfunction.natspec"
                      >
                          <template
                              v-for="(param, index) in Object.keys(item.pfunction.natspec.params || {})">
                              <p class="text-sm-left">{{param}}: {{item.pfunction.natspec.params[param]}}</p>
                          </template>
                          <p class="text-sm-left" v-if="item.pfunction.natspec.return">Returns: {{item.pfunction.natspec.return}}</p>
                      </template>
                    </v-tooltip>
                </template>
            </v-list>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script>
export default {
    props: ['items', 'loadToRemix', 'loadToTree', 'removeItem'],
}
</script>

<style>
.compressed {
    margin: 0;
    padding: 0;
}
.treeIcon {
    font-size: 16px !important;
}
.v-expansion-panel__header {
  padding-top: 0px!important;
  padding-bottom: 0px!important;
  padding-right: 10px!important;
}
</style>
