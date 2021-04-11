const ObjectProtoString = Object.prototype.toString;

export const isEmpty = obj => obj === undefined || obj === null || obj === "";

export const isFunction = obj => ObjectProtoString.call(obj) === "[object Function]";

export const isBoolean = bool => ObjectProtoString.call(bool) === "[object Boolean]";

export const isString = str => ObjectProtoString.call(str) === "[object String]";
