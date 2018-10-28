export function randomId() {
    return Math.floor(Math.random() * (10 ** 10));
}

export function pipeFunctionColorClass(abiObj) {
    let colorClass = '';
    if (abiObj.type === 'event') {
        colorClass = 'event';
    } else if (abiObj.type === 'payable') {
        colorClass = 'payable';
    } else if (!abiObj.constant) {
        colorClass = 'nonconstant';
    }
    return colorClass;
}
