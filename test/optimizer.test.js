import assert from "assert/strict"
import optimize from "../src/optimizer.js"
import * as core from "../src/core.js"

// Make some test cases easier to read
const x = new core.Variable("x", false)
const return1p1 = new core.ReturnStatement(new core.BinaryExpression("+", 1, 1))
const return2 = new core.ReturnStatement(2)
const returnX = new core.ReturnStatement(x)
const onePlusTwo = new core.BinaryExpression("+", 1, 2)
const identity = Object.assign(new core.Function("id"), { body: returnX })
const intFun = (body) => new core.FunctionDeclaration("f", [], "int", body)
const callIdentity = (args) => new core.Call(identity, args)
const or = (...d) => d.reduce((x, y) => new core.BinaryExpression("||", x, y))
const and = (...c) => c.reduce((x, y) => new core.BinaryExpression("&&", x, y))
const less = (x, y) => new core.BinaryExpression("<", x, y)
const eq = (x, y) => new core.BinaryExpression("==", x, y)
const times = (x, y) => new core.BinaryExpression("*", x, y)
const neg = (x) => new core.UnaryExpression("-", x)
const array = (...elements) => new core.CringeArray(elements)
const sub = (a, e) => new core.SubscriptExpression(a, e)
const unwrapElse = (o, e) => new core.BinaryExpression("??", o, e)
const conditional = (x, y, z) => new core.Conditional(x, y, z)
const some = (x) => new core.UnaryExpression("some", x)

const tests = [
  ["folds +", new core.BinaryExpression("+", 5, 8), 13],
  ["folds -", new core.BinaryExpression("-", 5n, 8n), -3n],
  ["folds *", new core.BinaryExpression("*", 5, 8), 40],
  ["folds /", new core.BinaryExpression("/", 5, 8), 0.625],
  ["folds **", new core.BinaryExpression("**", 5, 8), 390625],
  ["folds <", new core.BinaryExpression("<", 5, 8), true],
  ["folds <=", new core.BinaryExpression("<=", 5, 8), true],
  ["folds ==", new core.BinaryExpression("==", 5, 8), false],
  ["folds !=", new core.BinaryExpression("!=", 5, 8), true],
  ["folds >=", new core.BinaryExpression(">=", 5, 8), false],
  ["folds >", new core.BinaryExpression(">", 5, 8), false],
  ["optimizes +0", new core.BinaryExpression("+", x, 0), x],
  ["optimizes -0", new core.BinaryExpression("-", x, 0), x],
  ["optimizes *1", new core.BinaryExpression("*", x, 1), x],
  ["optimizes /1", new core.BinaryExpression("/", x, 1), x],
  ["optimizes *0", new core.BinaryExpression("*", x, 0), 0],
  ["optimizes 0*", new core.BinaryExpression("*", 0, x), 0],
  ["optimizes 0/", new core.BinaryExpression("/", 0, x), 0],
  ["optimizes 0+", new core.BinaryExpression("+", 0, x), x],
  ["optimizes 0-", new core.BinaryExpression("-", 0, x), neg(x)],
  ["optimizes 1*", new core.BinaryExpression("*", 1, x), x],
  ["folds negation", new core.UnaryExpression("-", 8), -8],
  ["optimizes 1**", new core.BinaryExpression("**", 1, x), 1],
  ["optimizes **0", new core.BinaryExpression("**", x, 0), 1],
  ["removes left false from ||", or(false, less(x, 1)), less(x, 1)],
  ["removes right false from ||", or(less(x, 1), false), less(x, 1)],
  ["removes left true from &&", and(true, less(x, 1)), less(x, 1)],
  ["removes right true from &&", and(less(x, 1), true), less(x, 1)],
  ["removes x=x", new core.Assignment("x", "x"), []],
  [
    "optimizes if-true",
    new core.If(true, [new core.BreakStatement()], []),
    [new core.BreakStatement()],
  ],
  [
    "optimizes if-false",
    new core.If(false, [], [new core.BreakStatement()]),
    [new core.BreakStatement()],
  ],
  [
    "optimizes if-else",
    new core.If(false, [], undefined, [new core.BreakStatement()]),
    [new core.BreakStatement()],
  ],
  [
    "optimize else-if-true",
    new core.ElseIf(true, [new core.BreakStatement()]),
    [new core.BreakStatement()],
  ],
  [
    "optimize else-if-false",
    new core.ElseIf(false, [new core.BreakStatement()]),
  ],
  [
    "optimize else",
    new core.Else(new core.Assignment("x", "x")),
    new core.Else([]),
  ],
  [
    "optimizes while-false",
    [new core.WhileStatement(false, [new core.BreakStatement()])],
    [],
  ],
  [
    "optimizes print argument",
    [new core.PrintStatement(1 + 2)],
    [new core.PrintStatement(3)],
  ],
  ["optimizes left conditional true", conditional(true, 55, 89), 55],
  ["optimizes left conditional false", conditional(false, 55, 89), 89],
  ["optimizes in functions", intFun(return1p1), intFun(return2)],
  ["optimizes in subscripts", sub(x, onePlusTwo), sub(x, 3)],
  ["optimizes in array literals", array(0, onePlusTwo, 9), array(0, 3, 9)],
  ["optimizes in arguments", callIdentity([times(3, 5)]), callIdentity([15])],
  [
    "passes through nonoptimizable constructs",
    ...Array(2).fill([
      new core.VariableDeclaration("x", true, "z"),
      new core.Assignment(x, new core.BinaryExpression("*", x, "z")),
      new core.Assignment(x, new core.UnaryExpression("not", x)),
      new core.Call(identity, new core.MemberExpression(x, "f")),
      new core.VariableDeclaration("r", false, "x"),
      new core.WhileStatement(true, [new core.BreakStatement()]),
      new core.PrintStatement(3),
      new core.Else(new core.Assignment("x", 3)),
      conditional(x, 1, 2),
    ]),
  ],
]

describe("The optimizer", () => {
  for (const [scenario, before, after] of tests) {
    it(`${scenario}`, () => {
      assert.deepEqual(optimize(before), after)
    })
  }
})
