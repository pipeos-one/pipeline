/* eslint-disable */

import {WEI_VALUE} from '../constants';

function callInternalFunctionSolidity(funcName, inputset, funcObj) {
    let payable = '';
    if (funcObj.func.pfunction.gapi.payable) {
        let weiInput = Object.values(inputset).find(input => input.indexOf(WEI_VALUE) > -1);
        payable = `.value(${weiInput})`;
    }
    return `    answer42 = pipe_proxy.proxy${payable}(${funcName}, input42, 400000);\n`;
}

function setCallFuncSignature(inputset, funcObj) {

    let inputs = '';
    if (Object.values(inputset).length > 0) {
        inputs += ', ';
    }
    if (funcObj.func.pfunction.gapi.payable) {
        inputs += Object.values(inputset).filter(input => input.indexOf(WEI_VALUE) < 0).join(", ");
    } else {
        inputs += Object.values(inputset).join(", ");
    }
    return `input42 = abi.encodeWithSelector(signature42${inputs});\n`;
}


const solidityVisitorOptions = {
    type: "source",
    lang: "solidity",
    pclassType: "sol",
    validateFunc: (type, pclassType) => type === pclassType,
    addSource: null,
    "file_p0" : `pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

`,
"proxy": `
interface PipeProxy {
function proxy(
    address _to,
    bytes input_bytes,
    uint256 gas_value
)
    payable
    external
    returns (bytes);
}
`,
    "contract_p0": "\ncontract PipedContract",
    "contract_p1": " {\n    PipeProxy public pipe_proxy;\n",
    "contract_p2": "}\n",
    "genConstr1": "    address public ",
    "genConstr2": "address _",
    "genConstr3": (funcName, funcObj) => `${funcName} = _${funcName};`,
    "function_pp1": ") public payable ",
    // function returns from definition
    "function_ret0": " returns (",
    "function_ret1": ")",
    // actual function return
    "function_ret2": (outs) => `return (${outs.join(", ")});\n`,
    // input format
    "function_in": (type, name) => `${type} ${name}`,
    // outputs format
    "function_outtype": (type, name) => `${type} ${name}`,
    "function_returns": (type, name) => `${type} r_${name}`,
    // function end
    "function_ret4": "}",
    "function_p2": ` {\n    bytes4 signature42;\n    bytes memory input42;\n    bytes memory answer42;\n    address tx_sender = msg.sender;\n`,
    "sigFunc1": "signature42 = bytes4(keccak256(\"",
    "sigFunc2": "\"));",
    "inputSig": setCallFuncSignature,
    "ansProxy": callInternalFunctionSolidity,
    "outputset": (type, name, i) => `${type} o_${name}_${i};`,
    "restFunc": (outputset, outAssem) => `${outputset.join("\n")}\nassembly {\n${outAssem.join("\n")}\n}\n`,
    "assem": " := mload(add(answer42, 32))",
    "intro1": "\n\nfunction PipedFunction",
    "intro11": "(",
    "const1": "constructor(address _pipe_proxy, ",
    "const2": `
    ) public {
        pipe_proxy = PipeProxy(_pipe_proxy);
    `,
    "const3": "}\n",
};

export default solidityVisitorOptions;
