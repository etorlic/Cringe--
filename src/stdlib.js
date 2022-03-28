// STANDARD LIBRARY
//
// Cringe-- comes with a lot of predefined entities. Some are constants, some
// are types, and some are functions. Each are defined in this module, and
// exported in a single object

import { Type, Variable, Function } from "./core.js"

function makeConstant(name, type, value) {
  return Object.assign(new Variable(name, true), { type, value })
}

function makeFunction(name, type) {
  return Object.assign(new Function(name), { type })
}

// const floatsType = new ArrayType(Type.FLOAT)
// const floatFloatType = new FunctionType([Type.FLOAT], Type.FLOAT)
// const floatFloatFloatType = new FunctionType([Type.FLOAT, Type.FLOAT], Type.FLOAT)
// const stringToIntsType = new FunctionType([Type.STRING], floatsType)

export const contents = Object.freeze({
  int: Type.INT,
  double: Type.DOUBLE,
  boolean: Type.BOOLEAN,
  char: Type.CHAR,
  string: Type.STRING,
  void: Type.VOID,
//   π: makeConstant("π", Type.FLOAT, Math.PI),
//   print: makeFunction("retweet", Type.ANY),
//   sin: makeFunction("sin", floatFloatType),
//   cos: makeFunction("cos", floatFloatType),
//   exp: makeFunction("exp", floatFloatType),
//   ln: makeFunction("ln", floatFloatType),
//   hypot: makeFunction("hypot", floatFloatFloatType),
//   bytes: makeFunction("bytes", stringToIntsType),
//   codepoints: makeFunction("codepoints", stringToIntsType),
})