export const getWeb3 = async () => {
    let web3Instance;
    if (window.ethereum) {
        // eslint-disable-next-line
        web3Instance = new Web3(ethereum);
        try {
            // eslint-disable-next-line
            await ethereum.enable();
        } catch (error) {
            console.log('User rejected dApp connection');
        }
    }

    if (!web3Instance && window.web3) {
        // eslint-disable-next-line
        web3Instance = new Web3(web3.currentProvider);
    }

    if (!web3Instance) {
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
        return null;
    }
    return web3Instance;
};

const MIN_WIDTH = 800;
export function getPageSize(noOfPages, {width, height}) {
  let pagewidth = width;
  if (width > MIN_WIDTH) {
    pagewidth = width / noOfPages;
  }
  return {
    minWidth: pagewidth,
    minHeight: height,
    maxWidth: pagewidth,
    width: pagewidth,
    height: height,
  };
}

export function getSignatureString(fgapi) {
  const inputTypes = (fgapi.inputs || []).map((input) => input.type);
  return `${fgapi.name || ''}(${inputTypes.join(',')})`;
}

export function gapiStripTemporary(gapi) {
  const newgapi = JSON.parse(JSON.stringify(gapi));
  newgapi.inputs = newgapi.inputs.filter(io => !io.temporary);
  newgapi.outputs = newgapi.outputs.filter(io => !io.temporary);
  return newgapi;
}

export function gapiStripPayable(gapi) {
  const newgapi = JSON.parse(JSON.stringify(gapi));
  newgapi.inputs = newgapi.inputs.filter(io => !io.payable);
  newgapi.outputs = newgapi.outputs.filter(io => !io.payable);
  return newgapi;
}
