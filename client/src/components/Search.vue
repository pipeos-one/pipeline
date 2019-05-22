<template>
      <v-autocomplete
        v-model="select"
        :items="items"
        :loading="loading"
        :search-input.sync="search"
        hide-no-data
        hide-details
        item-text="name"
        return-object
        placeholder="Search"
        multiple
        dense
      >
        <template
            slot="selection"
            slot-scope="data"
        >
            <v-chip
                :selected="data.selected"
                close
                class="chip--select-multi"
                @input="remove(data.item)"
            >
                <v-avatar>
                  <img v-if="data.item.icon" :src="data.item.icon">
                  <v-icon v-else-if="data.item.tag">fa-tag</v-icon>
                  <v-icon v-else>fa-circle</v-icon>
                </v-avatar>
                {{ data.item.name }}
            </v-chip>
        </template>
        <template
            slot="item"
            slot-scope="data"
        >
            <template v-if="typeof data.item !== 'object'">
                <v-list-tile-content v-text="data.item"></v-list-tile-content>
            </template>
            <template v-else>
                <v-list-tile-avatar>
                  <img v-if="data.item.icon" :src="data.item.icon">
                  <v-icon v-else-if="data.item.tag">fa-tag</v-icon>
                  <v-icon v-else>fa-circle</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                </v-list-tile-content>
            </template>
        </template>
      </v-autocomplete>
</template>

<script>
import Vue from 'vue';
import Pipeos from '../namespace/namespace';

const tagsApi = Pipeos.pipeserver.api.tag;
const projectApi = Pipeos.pipeserver.api.project;
const functionsApi = Pipeos.pipeserver.api.function;
const pclassApi = Pipeos.pipeserver.api.pclass;

export default {
    props: ['results'],
    data () {
        return {
            loading: false,
            isEditing: false,
            items: [],
            search: null,
            select: null,
            items: [],
        }
    },
    watch: {
        search (val) {
            val && val !== this.select && this.querySelections(val);
            this.$emit('search', val);
        },
        select (selected) {
            this.$emit('select', selected);
        },
    },
    methods: {
        remove (item) {
            const index = this.select.findIndex((it) => {
                return it.name === item.name;
            });
            if (index >= 0) this.select.splice(index, 1);
            this.select = this.select;
            this.$emit('remove', item);
        },
        querySelections (searchText) {
            if (searchText.length < 2) return;
            this.loading = true;
            let items = [];
            const query = `?filter={"where":{"name":{"like":"${searchText}","options":"i"}}}`

            Vue.axios.get(tagsApi + query).then((response) => {
                items = items.concat([{header: 'Tags'}]).concat(response.data.map((tag) => {
                    tag.tag = true;
                    return tag;
                }));
                return items;
            }).then((response) => {
                return Vue.axios.get(projectApi + query);
            }).then((response) => {
                items = items.concat([{header: 'Projects'}]).concat(response.data.map((project) => {
                    project.project = true;
                    return project;
                }));
                this.items = items;
                this.loading = false;
            });
        }
    }
}
</script>
