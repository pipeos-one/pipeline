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

export function pfunctionColorClass(gapi) {
    let colorClass = '';
    if (gapi.type === 'event') {
        colorClass = 'event';
    } else if (gapi.payable) {
        colorClass = 'payable';
    } else if (!gapi.constant) {
        colorClass = 'nonconstant';
    } else {
      colorClass = 'constant';
    }
    return colorClass;
};

export const colorMap = {
    event: '#C9DEBB',
    payable: '#CDE0F2',
    nonconstant: '#E9DEDE',
    constant: 'rgb(240, 239, 245)',
};

export function pfunctionColor(gapi) {
    const colorClass = pfunctionColorClass(gapi);
    return colorMap[colorClass];
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
