export default function introspect(func) {
    if (typeof func !== 'function') {
        throw new Error('NOT_A_FUNCTION');
    }
    // First match everything inside the function argument parens.
    let args = func.toString().match(/function\s*.*?\(([^)]*)\)/);
    if (!args) {
        console.log(func, args, func.toString());
        throw new Error('NO ARGS FOUND');
    }
    args = args[1];

    // Split the arguments string into an array comma delimited.
    return args.split(',').map((arg) => {
        // Ensure no inline comments are parsed and trim the whitespace.
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter((arg) => {
        // Ensure no undefined values are added.
        return arg;
    });
}
