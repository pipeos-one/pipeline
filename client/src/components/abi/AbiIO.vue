<template>
    <div>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field
                    v-if="!destructured"
                    v-model="inputValue"
                    full-width outline
                    :type="inputType"
                    :label="abi.name"
                    :placeholder="abi.type"
                    :hint="abi.type"
                    :error="error"
                    :error-messages="errorMessages"
                    :rules="rules"
                    :append-outer-icon="abi.components ? 'fa-chevron-down' : ''"
                    @click:append-outer="destructure"
                    @change="inputValueChanged"
                ></v-text-field>
                <v-card v-else>
                    <v-layout row wrap>
                        <v-flex xs2 offset-xs10 class="text-xs-right">
                            <v-btn flat icon @click="destructure">
                                <v-icon>fa-chevron-up</v-icon>
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <AbiIO
                        v-for="(component, i) in components"
                        :key="'component_' + i"
                        :abi="component"
                        :validator="validator"
                        v-on:value-changed="internalInputChanged(...arguments, i)"
                    />
                </v-card>
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import {JsonArrayToString} from '../../utils/utils';

const rules = {
    address: (value) => value.length === 22,
}

export default {
    name: 'AbiIO',
    props: ['abi', 'validator'],
    data() {
        return {
            inputType: 'text',
            error: false,
            errorMessages: [],
            rules: [],
            destructured: false,
            inputValue: '',
            components: [],
        }
    },
    created() {
        this.setIO();
    },
    watch: {
        abi: function() {
            this.setIO();
        },
    },
    methods: {
        setIO: function() {
            this.components = this.abi.components || [];
            this.setComponentsValuesFromAbi();
            this.setInputValue();
        },
        setComponentsValuesFromAbi: function() {
            let components = this.abi.components;
            if (!components || !this.abi.value) return;

            components.forEach((comp, i) => {
                components[i].value = this.abi.value[comp.name];
            });
            this.components = components;
        },
        setInputValue: function() {
            if (this.components.length) {
                this.inputValue = JsonArrayToString(
                    [this.getObjectFromComponents(this.components)]
                );
            } else if (typeof this.abi.value === 'object') {
                this.inputValue = JsonArrayToString([this.abi.value]);
            } else {
                this.inputValue = this.abi.value;
            }
        },
        getObjectFromComponents: function() {
            let obj = {};
            this.components.forEach(comp => {
                obj[comp.name] = comp.value;
            });
            return obj;
        },
        destructure: function() {
            this.destructured = !this.destructured;
        },
        inputValueChanged: function(value) {
            try {
                value = JSON.parse(value);
            }
            catch(e){};
            this.$emit('value-changed', value);
        },
        internalInputChanged: function(value, index) {
            this.components[index].value = this.validator(
                value,
                this.components[index].type,
                this.components[index].components,
            );
            this.setInputValue();
            this.$emit('value-changed', this.getObjectFromComponents());
        }
    },
}
</script>
