<template>
      <v-autocomplete
        v-model="select"
        ref="searchAutocomplete"
        :items="items"
        :loading="loading"
        :search-input.sync="search"
        hide-no-data
        hide-details
        item-text="name"
        return-object
        placeholder="Search"
        dense
      >
        <template
            slot="selection"
            slot-scope="data"
        >
            <v-chip
                :selected="data.selected"
                close small
                class="chip--select-multi"
                @input="remove(data.item)"
            >
                <v-avatar size="24px">
                  <img v-if="data.item.icon" :src="`/img/project_icons/${data.item.icon}`" height="24px">
                  <v-icon v-else-if="data.item.tag" small>fa-tag</v-icon>
                  <v-icon v-else small>fa-circle</v-icon>
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
                <v-list-tile-avatar size="24px">
                  <img v-if="data.item.icon" :src="`/img/project_icons/${data.item.icon}`" height="24px">
                  <v-icon v-else-if="data.item.tag" small>fa-tag</v-icon>
                  <v-icon v-else small>fa-circle</v-icon>
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
import {debounce} from '../utils/utils';

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
            searchQueryIsDirty: false,
            isCalculating: false,
            searchCache: null,
        }
    },
    watch: {
        search (val) {
            if (this.select) return;
            // We want the search input to maintain value when user does not
            // select something and clicks outside the autocomplete
            if (this.search === null) {
                this.search = this.searchCache;

                this.forceInputValue();
                setTimeout(this.forceInputValue, 200);
                setTimeout(this.forceInputValue, 500);
                return;
            }
            if (this.search !== this.searchCache) {
                this.searchQueryIsDirty = true;
                this.debouncedSearch();
            }
        },
        select (selected) {
            this.search = '';
            this.searchCache = '';
            this.emitQuery();
        },
    },
    methods: {
        emitQuery() {
            this.$emit('query', {
                search: this.search,
                select: this.select ? [this.select] : [],
            });
        },
        forceInputValue() {
            this.$refs.searchAutocomplete.$refs.input.value = this.searchCache;
        },
        debouncedSearch: debounce(function() {
            this.isCalculating = true;
            setTimeout(function () {
                this.isCalculating = false;
                this.searchQueryIsDirty = false;
                this.searchCache = this.search;
                this.search && this.search !== this.select && this.querySelections(this.search);
                this.emitQuery();
            }.bind(this), 1000);
        }, 1000),
        remove (item) {
            // const index = this.select.findIndex((it) => {
            //     return it.name === item.name;
            // });
            // if (index >= 0) this.select.splice(index, 1);
            // this.select = this.select;

            this.select = '';
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

<style>
.v-list__tile__avatar {
    min-width: 24px;
}
</style>
