// STANDARD LIBRARY
//
// Cringe-- comes with a lot of predefined entities. Some are constants, some
// are types, and some are functions. Each are defined in this module, and
// exported in a single object

import { Type, Function } from "./core.js"

function makeFunction(name, type) {
  return Object.assign(new Function(name), { type })
}

export const contents = Object.freeze({
  int: Type.INT,
  double: Type.DOUBLE,
  boolean: Type.BOOLEAN,
  char: Type.CHAR,
  string: Type.STRING,
  void: Type.VOID,
  print: makeFunction("retweet", Type.ANY),
})
