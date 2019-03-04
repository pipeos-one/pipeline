<template>
    <v-container>
        <v-flex xs12>
            <v-text-field
                v-model="name"
                outline
                height="60%"
                type="text"
                label="package name"
                placeholder="package name"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="version"
                outline
                height="60%"
                type="text"
                label="version"
                placeholder="1.0.0"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="license"
                outline
                height="60%"
                type="text"
                label="license"
                placeholder="MIT"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="description"
                outline
                height="60%"
                type="text"
                label="description"
                placeholder="This package contains..."
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="authors"
                outline
                height="60%"
                type="text"
                label="keywords"
                placeholder="Name1 <name1@email.com>,Name2 <name2@email.com>"
                hint="Comma separated author names"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="keywords"
                outline
                height="60%"
                type="text"
                label="keywords"
                placeholder="keyword1,keyword2"
                hint="Comma separated strings"
                :rules=rulesSimple
            ></v-text-field>
        </v-flex>
        <v-btn
            flat round
            class="black--text normaltxt"
            @click="exportToEthpm"
        >
            <v-icon left>fa-upload</v-icon>
        </v-btn>
        <p v-if="result">{{result}}</p>
    </v-container>
</template>

<script>

export default {
    props: ['result'],
    data: () => ({
        name: null,
        version: '1.0.0',
        authors: null,
        license: 'MIT',
        description: null,
        keywords: null,
        rulesSimple: [v => (v != null && v != '') || 'Field cannot be empty'],
    }),
    methods: {
        exportToEthpm: function() {
            let ppackage = {
                package: {
                    package_name: this.name,
                    version: this.version,
                    meta: {
                        authors: this.authors.split(','),
                        license: this.license,
                        description: this.description,
                        keywords: this.keywords.split(','),
                    },
                }
            };
            this.$emit('export', ppackage);
        }
    }
}
</script>
