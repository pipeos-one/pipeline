/* eslint-disable */

import solidityVisitorOptions from './soloptions.js';

const Ramda = require('ramda');

export default class GraphVisitor {
    constructor(options, pipe2, relsize, grIndex, containsEvent, langs){
        // language specific templates
        this.ops = options
        this.pipe2 = pipe2
        this.grIndex = grIndex
        this.containsEvent = containsEvent
        this.langs = langs
        // generated source
        this.genC = ""
        // public variables from constructor arguments (contract addresses)
        this.genConstr1 = []
        // code for constructor arguments (contract addresses)
        this.genConstr2 = []
        // code for constructor function, setting the public variables from arguments
        this.genConstr3 = []
        // _ids for constructor arguments in order (pclass ids)
        this.genConstr4 = {}
        this.genG = []
        // function sources that should be made available - js
        this.funcsources = []
        // function definition + initial variable definition
        this.genF = []
        this.genF1 = []
        // function returns
        this.genF2 = []
        // inputs
        this.in = []
        this.abi = {inputs: [], outputs: []}
        this.pointer = relsize;
        this.relsize = relsize;
        this.row = -1
        // outputs
        this.out = []
        // outputs
        this.outtype = []
        // outpout code in function definition
        this.returns = []
        this.outports=[]
        this.maxY = 0
        this.minX = {}
        this.isPayable = false
        this.isNotConstant = false
    }

    renderFunc(funcObj, row){
        let startLineY = this.relsize/2
        let startLineX = this.relsize/2
        let w = Math.max(this.pipe2.cgraphs[this.grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.inputs.length, this.pipe2.cgraphs[this.grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.outputs.length)
        if (this.row < row){
            this.row = row
            this.pointer = startLineX
            this.minX[row] = 30000
        }

        if (row !== 0) {
            let anchor = this.pipe2.cgraphs[this.grIndex].n[parseInt(funcObj.i)].links.in["1"]
            if (Object.keys(anchor).length > 0){

                let x = this.pipe2.rgraphs[this.grIndex][Object.keys(anchor[0])[0]].x

                /*
                if (x  + this.relsize * w -2 < this.minX[row]) {

                    this.pipe2.rgraphs[this.grIndex][parseInt(funcObj.i)].redraw(x, placeY);
                    this.minX[row] = x
                    this.pointer += (1 + w) * this.relsize;
                    return;
                }
                */

                this.pointer = Math.max(this.pointer,x)
                // console.log(this.pointer)
            }
        }

        this.minX[row] = Math.min(this.minX[row], this.pointer)
        let placeY = 2*(row + 1) * this.relsize

        if (this.pipe2.cgraphs[this.grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.name == "PortIn"){
            placeY = startLineY
        }

        this.pipe2.rgraphs[this.grIndex][parseInt(funcObj.i)].redraw(this.pointer, placeY);

        if (this.pipe2.cgraphs[this.grIndex].n[parseInt(funcObj.i)].func.pfunction.gapi.name == "PortOut"){
            this.outports.push(this.pipe2.rgraphs[this.grIndex][parseInt(funcObj.i)])
            this.maxY = Math.max(this.maxY, placeY)
        }

        // console.log(this.pipe2.cgraphs[this.grIndex])
        this.pointer += (1 + w) * this.relsize;
    }

    genContainer(grs){
        this.genC += this.ops.file_p0
        this.genC += this.ops.proxy
        this.genC += this.ops.contract_p0
        this.genC += this.ops.contract_p1
    }

    setGraph(g){
        this.row = 0
        this.pointer = this.relsize
        Ramda.map((x)=>{
            x.redraw(x.x, this.maxY)
        },this.outports)
    }

    genGraph(g){
        let cannotBeGenerated = Object.values(g).find((funcObject) => {
            if (!funcObject.func.pclass.type) return false;
            let isSolidity = this.ops.pclassType === solidityVisitorOptions.pclassType;

            return (
                isSolidity && (
                    funcObject.func.pclass.type != this.ops.pclassType ||
                    funcObject.func.pfunction.gapi.type === 'event'
                )
            );
        });
        if (cannotBeGenerated) {
            this.genF[this.grIndex] = '';
            this.in = [];
            this.out = [];
            this.genConstr1 = [];
            this.genConstr2 = [];
            this.genConstr3 = [];
            return;
        }
        let ini = this.genF[this.grIndex]

        // Generating pipeline function definition (inputs + modifiers)
        this.genF[this.grIndex] = this.ops.intro1 + this.grIndex+ this.ops.intro11 + this.in.join(", ") + this.ops.function_pp1

        // For js we temporarily define free inputs outside the function
        // TODO: replace with user inputs directly in diagram component
        if (this.ops.intro0) {
            this.genConstr1 = this.genConstr1.concat(
                this.in.map((input) => {
                    return this.ops.intro0 + input + this.ops.intro01;
                })
            );
        }

        // Generating pipeline function definition (returns)
        if (this.outtype.length > 0 && this.ops.function_ret0) {
            this.genF[this.grIndex] = this.genF[this.grIndex] + this.ops.function_ret0
            this.genF[this.grIndex] = this.genF[this.grIndex] + this.returns.join(",")
            this.genF[this.grIndex] = this.genF[this.grIndex] +  this.ops.function_ret1
        }

        // Generating pipeline function common variables
        // Attaching function body
        this.genF[this.grIndex] = this.genF[this.grIndex] +  this.ops.function_p2 + ini
        // this.genF1[this.grIndex] =

        // Generating function return
        this.genF2[this.grIndex] = ""
        if (this.out.length > 0){
            this.genF2[this.grIndex] += this.ops.function_ret2(this.out, this.grIndex);
        } else {
          this.genF2[this.grIndex] += this.ops.function_ret22(this.grIndex);
        }

        // Code generation ends here
        // Adding function returns
        this.genF[this.grIndex] += this.genF2[this.grIndex]

        // Ending event promise if present
        if (this.containsEvent[this.grIndex] && this.ops.function_ret3) {
            this.genF[this.grIndex] += this.ops.function_ret3;
        }

        // Function end
        this.genF[this.grIndex] += this.ops.function_ret4

        // For js, we also call the function in place
        if (this.ops.function_ret5) {
            this.genF[this.grIndex] += this.ops.function_ret5 + this.in.join(", ") + this.ops.function_ret51
        }

        // Fill the abi with other fields from the original abis
        Object.values(g).forEach((funcObject) => {
            funcObject.func.pfunction.gapi.inputs.forEach((input) => {
                let name = `i_${input.name}_${funcObject.i}`;
                this.abi.inputs.forEach((pipedin, i) => {
                    if (pipedin.name === name) {
                        this.abi.inputs[i] = Object.assign(
                            JSON.parse(JSON.stringify(input)), this.abi.inputs[i]
                        );
                    }
                });

            });
        });

        this.langs['abi'][this.grIndex] = {
            name: `PipedFunction${this.grIndex}`,
            type: 'function',
            constant: !this.isNotConstant,
            payable: this.isPayable,
            stateMutability: this.isPayable ? 'payable' : (this.isNotConstant ? 'nonpayable' : 'view'),
            inputs: this.abi.inputs,
            outputs:this.abi.outputs,
        }

        this.in= []
        this.out = []
        this.outtype = []
    }

    genFunc(funcObj, row) {
        this.genF[this.grIndex] = this.genF[this.grIndex] || '';

        if (funcObj.func.pfunction.gapi.type == "port") {
            this.genFuncIO(funcObj);
            return;
        }
        if (
            ["function", "event"].indexOf(funcObj.func.pfunction.gapi.type) < 0 &&
            !this.ops.validateFunc(funcObj.func.pclass.type, this.ops.pclassType)
        ) {
            return;
        }

        this.genFuncFunction(funcObj, row);
    }

    prepFuncName(name) {
        return name.replace(/:/g, '').replace(/-/g, '');
    }

    genFuncFunction(funcObj, row) {
        let funcName = this.prepFuncName(funcObj.func.pfunction.gapi.name) + "_" + funcObj.i;

        if (funcObj.func.pfunction.gapi.payable) {
            this.isPayable = true;
        }

        if (!funcObj.func.pfunction.gapi.constant) {
            this.isNotConstant = true;
        }

        let source = funcObj.func.pfunction.source;
        if (!source && this.ops.addSource) {
            source = this.ops.addSource(funcName, funcObj);
        }
        if (source) {
            this.funcsources.push(`const ${funcName} = ${source}`);
        }
        // public variables from constructor arguments (contract addresses)
        if (this.ops.genConstr1) {
            this.genConstr1.push(this.ops.genConstr1 + funcName + " ;");
        }
        // code for constructor arguments (contract addresses)
        if (this.ops.genConstr2) {
            this.genConstr2.push(this.ops.genConstr2 + funcName);
        }
        // code for constructor function, setting the public variables from arguments
        if (this.ops.genConstr3) {
            this.genConstr3.push(this.ops.genConstr3(funcName, funcObj));
        }
        // _ids for constructor arguments in order (pclass ids)
        this.genConstr4[funcName] = funcObj.func._id;

        let f = this.genF[this.grIndex] || "";
        this.genF[this.grIndex] = f + "\n";
        if (this.ops.sigFunc1) {
            this.genF[this.grIndex] += this.ops.sigFunc1 + funcObj.func.pfunction.signature + this.ops.sigFunc2 + "\n";
        }

        let inputset = Ramda.mapObjIndexed((x, key, all) => {
            let o = "i_"+x.name+ "_"+funcObj.i
            // console.log('*********', funcObj.state[parseInt(key)+1])
            if (funcObj.state[parseInt(key)+1]){
                o = funcObj.state[parseInt(key)+1].name
            }
            return o
        }, funcObj.func.pfunction.gapi.inputs
        )

        if (this.ops.inputSig) {
            this.genF[this.grIndex] += this.ops.inputSig(inputset, funcObj);
        }

        this.genF[this.grIndex] += this.ops.ansProxy(funcName, inputset, funcObj);
        let outAssem = []
        let outputset = Ramda.map((x)=>{
            // console.log(x)
            let name = (x.name !== undefined)? x.name: ""
            outAssem.push("o_" + name + "_"+ funcObj.i+this.ops.assem)
            return this.ops.outputset(x.type, name, funcObj.i);
        }, funcObj.func.pfunction.gapi.outputs)
        let o = ""
        if (funcObj.func.pfunction.gapi.outputs.length > 0) {
            o = this.ops.restFunc(outputset, outAssem, funcName, funcObj);
        }

        this.genF[this.grIndex] = this.genF[this.grIndex] + o + "\n";
    }

    genFuncIO(funcObj) {
        if (funcObj.func.pfunction.gapi.name == "PortIn") {
            let input = this.ops.function_in(funcObj.state.type, funcObj.state.name);
            this.in.push(input);
            this.abi.inputs.push({type: funcObj.state.type, name: input});
        }

        if (funcObj.func.pfunction.gapi.name == "PortOut") {
            this.out.push(funcObj.state.name)
            this.outtype.push(this.ops.function_outtype(funcObj.state.type, funcObj.state.name));
            this.returns.push(this.ops.function_returns(funcObj.state.type, funcObj.state.name));
            this.abi.outputs.push({type: funcObj.state.type, name: funcObj.state.name});
        }
    }

    getGen(){
        let out = ""
        //out = out + this.intro1
        //console.log(this.in)
        out = out + this.genC

        if (this.ops.intro0) out += "\n\n";
        out = out + this.genConstr1.join("\n")+ "\n"
        out = out + this.ops.const1 +this.genConstr2.join(", ") + this.ops.const2
        out = out + this.genConstr3.join("\n") + "\n"
        out = out + this.ops.const3

        // Add helper functions - js
        if (this.funcsources.length) {
            out += "\n" + this.funcsources.join(';\n') + ';';
            this.funcsources = [];
        }

        // Add piped functions
        out += this.genF.join("\n")

        // Constructor arguments in order
        this.langs["constructor"] = this.genConstr4

        //out = out + this.outro
        out = out + this.ops.contract_p2

        return out
    }
}
