<template>
    <v-container>
        <v-layout row wrap>
            <v-flex xs4 v-if="!destructured">
                <v-btn
                    block depressed large
                    :color="funcColor"
                    @click="runFunction"
                >
                    {{abi.name}}
                </v-btn>
            </v-flex>
            <v-flex xs7 offset-xs1>
                <v-text-field
                    v-if="!destructured && abi.inputs.length"
                    v-model="functionArgs"
                    outline
                    height="60%"
                    type="text"
                    :placeholder="inputsStr(abi.inputs)"
                    :hint="inputsStr(abi.inputs)"
                    :error="error"
                    :error-messages="errorMessages"
                    :rules="rules"
                    :append-outer-icon="abi.inputs.length > 1 || abi.inputs[0].type == 'tuple' ? 'fa-chevron-down' : ''"
                    @click:append-outer="destructure"
                    @change="argsValueChanged"
                ></v-text-field>
            </v-flex>
        </v-layout>
        <div v-if="destructured">
            <v-layout row wrap>
                <v-flex xs4>
                    <v-btn
                        block depressed large
                        :color="funcColor"
                        @click="runFunction"
                    >
                        {{abi.name}}
                    </v-btn>
                </v-flex>
                <v-flex xs2 offset-xs6 class="text-xs-right">
                    <v-btn flat icon @click="destructure">
                        <v-icon>fa-chevron-up</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
            <AbiIO
                v-for="(input, i) in inputs"
                :key="`input_${i}`"
                :abi="input"
                :validator="validateArg"
                v-on:value-changed="internalInputChanged(...arguments, i)"
            />
        </div>
        <v-layout row wrap>
            <v-flex xs12
                align-start
                class="text-xs-left"
                :id="'output_' + abi.name"
            >
            </v-flex>
        </v-layout>
        <v-divider></v-divider>
    </v-container>
</template>

<script>
import AbiIO from './AbiIO';
import {pfunctionColorClass, JsonArrayToString} from '../../utils/utils';

const colors = {payable: '#CDE0F2', nonconstant: '#E9DEDE'};

export default {
    props: ['abi'],
    components: {
        AbiIO,
    },
    data() {
        return {
            error: false,
            errorMessages: [],
            rules: [],
            destructured: false,
            functionArgs: '',
            inputs: [],
            outputs: [],
            funcColor: '',
            outputValues: null,
        }
    },
    created() {
        this.setData();
    },
    watch: {
        abi: function() {
            this.setData();
        },
    },
    methods: {
        setData: function() {
            this.inputs = this.abi.inputs;
            this.outputs = this.abi.outputs;
            this.funcColor = colors[pfunctionColorClass(this.abi)];
        },
        destructure: function() {
            this.destructured = !this.destructured;
        },
        inputsStr: function(inputs) {
            return inputs.map(input => `${input.type} ${input.name}`).join(',');
        },
        validateArg(value, type, components=[], self) {
            if (type.indexOf('int') > -1) {
                value = parseInt(value);
                if (value === NaN) {
                    this.errorMessages.push(`Argument number ${i} should be ${input.type}`);
                    if (self) {
                        self.errorMessages = this.errorMessages;
                    }
                }
                return value;
            }

            if (type === 'tuple') {
                components.forEach(comp => {
                    if (value[comp.name] === undefined) {
                        this.errorMessages.push(`Missing field: ${comp.name}`);
                    }
                });
                try {
                    JSON.stringify(value);
                }
                catch(e) {
                    this.errorMessages.push(`Value does not have a valid JSON format`);
                }
                if (self) {
                    self.errorMessages = this.errorMessages;
                }
            }
            return value;
        },
        stringToObjectArray: function() {
            let args = [];

            this.error = false;
            this.errorMessages = [];

            try {
                args = JSON.parse(`[${this.functionArgs}]`);
            }
            catch(e) {
                this.errorMessages.push('Use quotes around strings and addresses, make sure object keys have quotes');
            }
            return args;
        },
        setInputsFromString: function() {
            let args = this.stringToObjectArray();
            let inputs = this.inputs;

            if (args.length != inputs.length) {
                this.errorMessages.push(`Number of comma separated values should be ${inputs.length}`);
            }
            inputs.forEach((input, i) => {
                inputs[i].value = this.validateArg(args[i], input.type, input.components);
            });
            this.inputs = inputs;
        },
        argsValueChanged: function(value) {
            this.setInputsFromString();
        },
        inputsToString: function() {
            this.functionArgs = JsonArrayToString(this.inputs.map(arg => arg.value));
        },
        internalInputChanged: function(value, index) {
            let inputs = this.inputs;
            inputs[index].value = value;
            this.inputs = inputs;

            this.inputsToString();
        },
        runFunction: function() {
            this.setInputsFromString();
            if (this.errorMessages.length == 0) {
                let args = [];
                this.inputs.forEach(input => {
                    if (typeof input.value === 'object') {
                        input.value = JsonArrayToString([input.value]);
                    }
                    if (typeof input.value === 'string' && input.type != 'tuple') {
                        input.value = `"${input.value}"`;
                    }
                    args.push(input);
                });
                this.$emit('value-changed', args);
            }
        },
    }
}
</script>
