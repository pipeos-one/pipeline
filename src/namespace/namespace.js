import {RemixExtension} from '../plugins/remix';

const pipeserverIp = process.env.VUE_APP_PIPESERVER_IP;

const Pipeos = {
    pipeserver: {
        host: pipeserverIp,
        api: {
            json: `${pipeserverIp}/json`,
            container: `${pipeserverIp}/pipecontainer`,
            function: `${pipeserverIp}/pipefunction`,
            deployed: `${pipeserverIp}/pipedeployed`,
            tag: `${pipeserverIp}/tag`,
        },
    },
    contracts: {
        PipeProxy: {
            '3': '0x97dc6bbd4f1cd2bd24e341bf01ca9b8bb433da46',
            '4': '0x07ed1484f787e702a50aaef193ed1c6f5bd677cb',
            '42': '0x7f4a8db89e96110a48f299043084c69aa190c58c',
        },
    },
    remix: new RemixExtension(),
};

export default Pipeos;
