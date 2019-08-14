/* eslint-disable */

import solidityVisitorOptions from './soloptions.js';
import {
  DEPLOYMENT_VAR,
  UNNAMED_INPUT,
  UNNAMED_OUTPUT,
  WEI_VALUE,
} from '../constants';

function callInternalFunctionJs(funcName, inputset, funcObj) {
    let result = '';
    if (funcObj.func.pfunction.gapi.type === 'event') {
        return result;
    }
    if (funcObj.func.pclass.deployment.pclassi.openapiid) {
        result += `
    baseUrl = ${DEPLOYMENT_VAR}_${funcName};
`
    }
    result += `    result = await ${funcName}(${Object.values(inputset).join(",")});
`;
    return result;
}

function genFuncReturnDestructuring(outputset, outAssem, funcName, funcObj) {
    let outputs = funcObj.func.pfunction.gapi.outputs;
    if (funcObj.func.pfunction.gapi.type === 'function') {
        return outAssem.map((out, i) => `    const ${out} = result.${outputs[i].name || `${UNNAMED_OUTPUT}_i`};`).join('\n');
    }
    if (funcObj.func.pfunction.gapi.type === 'event') {
        let eventName = funcObj.func.pfunction.gapi.name;
        return `
contract_${funcName}.on("${eventName}", async (${Object.values(outAssem).join(",")}, filterObject) => {
`
    }
}

function addSourceJsFromSolidity(funcName, funcObj) {
    if (funcObj.func.pclass.type  != solidityVisitorOptions.pclassType) {
        return;
    }
    if (funcObj.func.pfunction.gapi.type === 'event') {
        return;
    }
    let payable = '', functionInputs;
    let gapi = funcObj.func.pfunction.gapi;
    let inputs = gapi.inputs.map((input, i) => input.name || `${UNNAMED_INPUT}_i`);
    let outputs = gapi.outputs.map((output, i) => output.name || `${UNNAMED_OUTPUT}_i`);
    let returnValue = '';
    if (outputs.length === 1) {
        returnValue = ` {${outputs[0]}: output}`;
    } else if (outputs.length > 1) {
        returnValue = ` output`;
    }
    functionInputs = inputs.join(', ');
    if (gapi.payable) {
        let index = inputs.findIndex(input => input.indexOf(WEI_VALUE) > -1);
        payable = `, {value: ${inputs[index]}}`;
        inputs.splice(index, 1);
    }
    return `async function(${functionInputs}) {
    const output = await contract_${funcName}.${gapi.name}(${inputs.join(', ')}${payable});
    return${returnValue};
}`;
}

function buildPClassVarsJs(funcName, funcObj) {
    let pclassi = funcObj.func.pclass.deployment.pclassi;
    if (pclassi.openapiid) {
        return `const ${DEPLOYMENT_VAR}_${funcName} = "http://${pclassi.host}${pclassi.basePath}";\n`;
    }
    const abi = funcObj.func.pclass.pclass.gapi;
    return `
const abi_${funcName} = ${JSON.stringify(abi)};
const ${DEPLOYMENT_VAR}_${funcName} = "${pclassi.address}";
const contract_${funcName} = new ethers.Contract(${DEPLOYMENT_VAR}_${funcName}, abi_${funcName}, signer);
`;
}

const jsVisitorOptions = {
        type: "source",
        lang: "javascript",
        pclassType: "js",
        validateFunc: (type, pclassType) => type === pclassType || type === solidityVisitorOptions.pclassType,
        addSource: addSourceJsFromSolidity,
        "file_p0" : `
let baseUrl;
const httpClient = axios;
const callback = PipedScriptCallback;

// Metamask
const provider = new ethers.providers.Web3Provider(web3.currentProvider);
const signer = provider.getSigner();
`,
        "proxy": ``,
        "contract_p0": "",
        "contract_p1": ``,
        "contract_p2": "",
        "genConstr3": buildPClassVarsJs,
        "function_pp1": ") {\n",
        // empty, we don't need to have returns in function definition
        "function_ret0": "",
        "function_ret1": "",
        // actual function return
        "function_ret2": (outs, i) => `
    console.log(${outs.join(", ")});
    PipedScriptCallback('PipedFunction${i}', {${outs.join(", ")}});
`,
        // if an event is present, then we need to close it
        "function_ret3": '});',
        // function end
        "function_ret4": `
})`,
        "function_ret5": "(",
        "function_ret51": ");",
        // input format
        "function_in": (type, name) => `${name}`,
        // outputs format
        "function_outtype": (type, name) => `${name}`,
        "function_returns": (type, name) => ` r_${name}`,
        // empty, we don't need to have common variables for openapi
        "function_p2": `
    let result;
`,
        "sigFunc1": "",
        "sigFunc2": "",
        "inputSig1": "",
        "inputSig2": "",
        "ansProxy": callInternalFunctionJs,
        "outputset": (type, name, i) => `o_${name}_${i};`,
        "restFunc": genFuncReturnDestructuring,
        "assem": "",
        "intro0": `let `,
        "intro01": ` = null;`,
        "intro1": `
(async function PipedFunction`,
        "intro11": "(",
        "const1": "",
        "const2": ``,
        "const3": "",
};

export default jsVisitorOptions;
