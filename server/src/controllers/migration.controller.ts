import * as fs from 'fs';
const csv = require('fast-csv');

import {
    param,
    get,
    getFilterSchemaFor,
    getWhereSchemaFor,
    requestBody,
} from '@loopback/rest';
import {
  repository,
} from '@loopback/repository';
import {PClass, PClassI, PFunction, Project, Tag, SolClass} from '../models';
import {MigrationPClassRepository} from '../repositories/migration.repository';
import {PClassController, PClassIController, PFunctionController, ProjectController, TagController} from '../controllers';
import {CHAINID_TO_BIP122, chainIdToBip122Uri} from '../utils/chain';

export class MigrationController {
    constructor(
        @repository(MigrationPClassRepository)
        public migrationRepository : MigrationPClassRepository,
    ) {}

    @get('/migration/project', {
        responses: {
            '200': {
                description: 'Project migration',
            },
        },
    })
    async migrateProject(): Promise<void> {
        const filepath = `${process.cwd()}/src/data/contracts_ordered.csv`;

        var stream = fs.createReadStream(filepath);
        let self = this;
        let errorCount = 0;
        let dataCount = 0;

        var csvStream = csv({headers: true, ignoreEmpty: true, delimiter: ','})
            .on("data", async function(data: any, index: any) {
                dataCount ++;
                console.log('dataCount', dataCount);
                this.pause();
                await self.saveData(data);
                this.resume();
            })
            .on("end", function() {
                console.log("-----done");
            })
            .on('error', function(err: any) {
                errorCount ++;
                console.log('------err ', err);
                console.log('------errorCount', errorCount);
            });

        stream.pipe(csvStream);
    }

    async saveData(data: any): Promise<void> {
        let pclassInserted;
        let pclassRepository = await this.migrationRepository.pclass;
        let pclassController = new PClassController(pclassRepository);

        const prepData: any = this.prepareData(data);
        const pclass = this.toPClass(prepData);

        pclassInserted = await pclassController.createFunctions(pclass)
            .catch(console.log);

        if (!pclassInserted && prepData.compiler) {
            // It means there was no ABI to compare
            // Try to see if there are pclasses with same name & compiler version
            let alreadyInserted = await pclassController.find({where: {and: [{name: pclass.name}, {'pclass.compiler.version': {like: prepData.compiler.version}}]}});
            if (!alreadyInserted || !alreadyInserted.length) return;
            pclassInserted = alreadyInserted[0];
            console.log('-- alreadyInserted  yes');
        };

        let pclassi = this.toPClassi(prepData);
        pclassi.pclassid = (<PClass>pclassInserted)._id;
        await pclassController.addPClassI(pclassi);
    }

    prepareData(data: any): Promise<any> {
        let prepData: any = {};
        let json: any = {}, abi: any;
        try {
            json = JSON.parse(data.json).result[0];
            try {
                abi = JSON.parse(json.ABI);
            } catch(e) {
                console.log('No abi');
            }
        } catch(e) {
            console.log('No json');
        }

        prepData.address = data.Address;
        prepData.name = json.ContractName || data.ContractName;
        prepData.abi = abi || data.abi;
        prepData.chain = data.chain;
        prepData.args = json.ConstructorArguments;
        prepData.source = json.SourceCode || data.sol;
        prepData.swarm = json.SwarmSource;
        prepData.project = data.project;
        prepData.tag = data.tag;
        prepData.compiler = {
            name: 'solc',
            version: json.CompilerVersion || data.Compiler,
        }

        if (json.OptimizationUsed) {
            prepData.compiler.settings = {
                optimizer: {
                    enabled: json.OptimizationUsed === "1",
                    runs: json.Runs,
                }
            }
        }

        return prepData;
    }

    toPClass(data: any): PClass {
        let pclass: any = {
            name: data.name,
            type: 'sol',
            pclass: {
                name: data.name,
            },
            tags: [],
            chainids: [],
        };

        if (data.tag) {
            pclass.tags.push(data.tag);
        }
        if (data.project) {
            pclass.tags.push(data.project);
            pclass.project = data.project;
        }
        if (data.chain) {
            pclass.chainids.push(data.chain);
        }

        pclass.pclass.gapi = data.abi;
        pclass.pclass.compiler = data.compiler;

        if (data.source) {
            pclass.pclass.sources = [{
                relative_path: `${data.name}.sol`,
                source: data.source,
            }];
            pclass.pclass.flatsource = data.source;
            if (data.swarm) {
                let swarm = data.swarm.split('://');
                pclass.pclass.sources[0].storage = {
                    hash: swarm[1],
                    type: 'swarm',
                    protocol: swarm[0],
                }
            }
        }

        return pclass;
    }

    toPClassi(data: any): PClassI {
        let pclassi: any = {
            pclassi: {
                instance_name: data.name,
                address: data.address,
                compiler: data.compiler,
                constructorArgs: data.args,
                chainid: data.chain,
                genesis_hash: CHAINID_TO_BIP122[data.chain],
                bip122_uri: chainIdToBip122Uri(data.chain),
            }
        }
        return pclassi;
    }
}
