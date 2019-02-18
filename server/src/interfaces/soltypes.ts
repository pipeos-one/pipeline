import {range} from '../utils/utils';

export type Boolean = 'bool';
export type Address = 'address';
export type Function = 'function';
export type Tuple = 'tuple';

export type SignedInteger = 'int8' | 'int16' | 'int24' | 'int32' | 'int40' | 'int48' | 'int56' | 'int64' | 'int72' | 'int80' | 'int88' | 'int96' | 'int104' | 'int112' | 'int120' | 'int128' | 'int136' | 'int144' | 'int152' | 'int160' | 'int168' | 'int176' | 'int184' | 'int192' | 'int200' | 'int208' | 'int216' | 'int224' | 'int232' | 'int240' | 'int248' | 'int256' | 'int';
export type UnsignedInteger = 'uint8' | 'uint16' | 'uint24' | 'uint32' | 'uint40' | 'uint48' | 'uint56' | 'uint64' | 'uint72' | 'uint80' | 'uint88' | 'uint96' | 'uint104' | 'uint112' | 'uint120' | 'uint128' | 'uint136' | 'uint144' | 'uint152' | 'uint160' | 'uint168' | 'uint176' | 'uint184' | 'uint192' | 'uint200' | 'uint208' | 'uint216' | 'uint224' | 'uint232' | 'uint240' | 'uint248' | 'uint256' | 'uint';
export type Integer = SignedInteger | UnsignedInteger;

// TODO fixed point number types for sizes - ufixedMxN, ufixed128x18
export type FixedPointNumber = 'fixed' | 'ufixed';

export type FixedSizeByteArray = 'byte' | 'bytes1' | 'bytes2' | 'bytes3' | 'bytes4' | 'bytes5' | 'bytes6' | 'bytes7' | 'bytes8' | 'bytes9' | 'bytes10' | 'bytes11' | 'bytes12' | 'bytes13' | 'bytes14' | 'bytes15' | 'bytes16' | 'bytes17' | 'bytes18' | 'bytes19' | 'bytes20' | 'bytes21' | 'bytes22' | 'bytes23' | 'bytes24' | 'bytes25' | 'bytes26' | 'bytes27' | 'bytes28' | 'bytes29' | 'bytes30' | 'bytes31' | 'bytes32';

export type SignedIntegerArray = 'int[]' | 'int[][]';
export type UnsignedIntegerArray = 'uint[]' | 'uint[][]';
export type IntegerArray = SignedIntegerArray | UnsignedIntegerArray;
export type TupleArray = Tuple[];

export type Bytes = 'bytes';
export type String = 'string';

export type Array = IntegerArray | TupleArray | Bytes | String;

export type Enum = UnsignedInteger;

export type ValueType = Boolean | Address | Function | Integer | FixedPointNumber | FixedSizeByteArray;

export type ElementaryType = ValueType | Array | Tuple;
export type UserDefinedType =  Enum;

export type SolType = ElementaryType | UserDefinedType;

export const getSolSizedType = (type: string, maxSize: number, stepSize: number) => {
    let start: number = stepSize;  // Solidity sizes don't start with 0
    let end: number = maxSize / stepSize + start;
    return range(start, end, stepSize).map((step: number) => `${type}${step}`);
}

// export const buildOrTypeOptions = (ttype, subtypes: any[]) => {
//     console.log('subtypes', subtypes);
//     let firstType = subtypes.shift();
//     return subtypes.reduce((accumulator, value) => {
//         console.log(accumulator, value);
//         return accumulator | value;
//     }, firstType);
// }
