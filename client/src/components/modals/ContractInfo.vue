<template>
  <v-layout row wrap class="text-xs-left">
    <v-flex xs10 offset-xs1>
      <p>
        <v-icon small @click="clipboardCopy(container.name)">fa-copy</v-icon>
        <span class="subheading font-weight-bold"> Name: </span>
        {{container.name}}
      </p>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <p>
        <span class="subheading font-weight-bold">Deployment on chain ID: {{container.deployment.pclassi.chain_id}}</span>
      </p>
      <p>
        <v-icon small @click="clipboardCopy(container.deployment.pclassi.address)">fa-copy</v-icon>
        <span class="font-weight-bold"> Address: </span>
        {{container.deployment.pclassi.address}}
      </p>
      <v-divider></v-divider>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <p>
        <v-icon small @click="clipboardCopy(JSON.stringify(container.pclass.gapi))">fa-copy</v-icon>
        <span class="subheading font-weight-bold"> ABI: </span>
      </p>
      <v-textarea
        readonly
        name="abi"
        :value="JSON.stringify(container.pclass.gapi)"
      ></v-textarea>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <p>
        <v-icon small @click="clipboardCopy(JSON.stringify(container.pclass.natspec))">fa-copy</v-icon>
        <span class="subheading font-weight-bold"> Natspec: </span>
      </p>
      <v-textarea
        readonly
        name="abi"
        :value="JSON.stringify(container.pclass.natspec)"
      ></v-textarea>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <p>
        <v-icon small @click="clipboardCopy(JSON.stringify(container.pclass.compiler))">fa-copy</v-icon>
        <span class="subheading font-weight-bold"> Compiler: </span>
      </p>
      <v-textarea
        readonly
        name="abi"
        :value="JSON.stringify(container.pclass.compiler)"
      ></v-textarea>
    </v-flex>
    <v-flex xs10 offset-xs1>
      <p>
        <v-icon small @click="clipboardCopy(JSON.stringify(container.pclass.runtime_bytecode))">fa-copy</v-icon>
        <span class="subheading font-weight-bold"> Runtime Bytecode: </span>
      </p>
      <v-textarea
        readonly
        name="abi"
        :value="JSON.stringify(container.pclass.runtime_bytecode)"
      ></v-textarea>
    </v-flex>
  </v-layout>
</template>

<script>
import {clipboardCopy} from '../../utils/utils.js';

export default {
    props: ['container'],
    methods: {
        clipboardCopy,
    },
};
</script>

<style>
.source-txtar {
    height: 150px;
    width: 90%;
    font-family: Monaco,Menlo,"Ubuntu Mono",Consolas,source-code-pro,monospace;
    font-size: 12px;
}
</style>
