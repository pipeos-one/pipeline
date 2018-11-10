import {PipeFunction, PipeContainer, PipeDeployed} from '../models';

export interface GetContainerFunctionsDeployed {
    pipecontainers: PipeContainer[];
    pipedeployments: PipeDeployed[];
    pipefunctions: PipeFunction[];
}
