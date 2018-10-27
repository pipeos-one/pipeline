import {RemixExtension} from '../plugins/remix';

const pipeserverIp = `${process.env.VUE_APP_PIPESERVER_IP}:${process.env.VUE_APP_PIPESERVER_PORT}`;

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
    remix: new RemixExtension(),
};

export default Pipeos;
