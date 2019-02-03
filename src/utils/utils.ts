export let reverseKeys = (data: any) => {
    return Object.keys(data).reduce(function(obj: any, key: any) {
       obj[data[key]] = key;
       return obj;
    },{});
}
