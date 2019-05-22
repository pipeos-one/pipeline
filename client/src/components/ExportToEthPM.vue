<template>
    <v-container>
        <v-flex xs12>
            <v-text-field
                v-model="name"
                outline
                type="text"
                label="package name"
                placeholder="Package Name"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="version"
                outline
                persistent-hint
                height="60%"
                type="text"
                label="version"
                placeholder="1.0.0"
                hint="1.0.0"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="license"
                outline
                height="60%"
                type="text"
                label="license"
                hint="MIT"
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
                persistent-hint
                height="60%"
                type="text"
                label="authors"
                placeholder="Name1 <name1@email.com>,Name2 <name2@email.com>"
                hint="Name1 <@email.com>,Name2 <@email.com>"
                :rules=rulesSimple
            ></v-text-field>
            <v-text-field
                v-model="keywords"
                outline
                persistent-hint
                height="60%"
                type="text"
                label="keywords"
                placeholder="keyword1,keyword2"
                hint="keyword1,keyword2"
                :rules=rulesSimple
            ></v-text-field>
        </v-flex>
        <v-btn
            v-if="!error && !result"
            flat round
            class="black--text normaltxt"
            @click="exportToEthpm"
        >
            <v-icon left>fa-upload</v-icon>
        </v-btn>
        <v-btn
            v-if="error"
            flat round
            class="black--text normaltxt"
            @click="retryEthpm"
        >
            <v-icon left>fa-upload</v-icon> Retry!
        </v-btn>
        <p v-if="result">{{result}}</p>
        <p v-if="error">{{error}}</p>
    </v-container>
</template>

<script>

export default {
    props: ['result', 'error'],
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
        },
        retryEthpm: function() {
            this.$emit('retry');
        }
    }
}
</script>
