export const reverseKeys = (data: any) => {
    return Object.keys(data).reduce(function(obj: any, key: any) {
       obj[data[key]] = key;
       return obj;
    },{});
}

export const range = (start: number=0, end: number, step: number=1) => {
    const length: number = end - start;
    return Array.from({ length }, (_, i) => i * step + start);
}
