// OPTIMIZER
//
// This module exports a single function to perform machine-independent
// optimizations on the analyzed semantic graph.
//
// The only optimizations supported here are:
//
//   - assignments to self (x = x) turn into no-ops
//   - constant folding
//   - some strength reductions (+0, -0, *0, *1, etc.)
//   - turn references to built-ins true and false to be literals
//   - remove all disjuncts in || list after literal true
//   - remove all conjuncts in && list after literal false
//   - while-false becomes a no-op
//   - repeat-0 is a no-op
//   - for-loop over empty array is a no-op
//   - for-loop with low > high is a no-op
//   - if-true and if-false reduce to only the taken arm
//
// The optimizer also replaces token references with their actual values,
// since the original token line and column numbers are no longer needed.
// This simplifies code generation.

import * as core from "./core.js"

export default function optimize(node) {
  return optimizers[node.constructor.name](node)
}

const optimizers = {
  /* c8 ignore next 3 */
  Program(p) {
    p.statements = optimize(p.statements)
    return p
  },
  VariableDeclaration(d) {
    d.variable = optimize(d.variable)
    d.initializer = optimize(d.initializer)
    return d
  },
  FunctionDeclaration(d) {
    d.params = optimize(d.params)
    if (d.block) d.block = optimize(d.block)
    return d
  },
  FuncParam(d) {
    return d
  },
  Variable(v) {
    return v
  },
  Function(f) {
    return f
  },
  Assignment(s) {
    s.source = optimize(s.source)
    s.target = optimize(s.target)
    if (s.source === s.target) {
      return []
    }
    return s
  },
  BreakStatement(s) {
    return s
  },
  ReturnStatement(s) {
    s.value = optimize(s.value)
    return s
  },
  PrintStatement(s) {
    s.argument = optimize(s.argument)
    return s
  },
  If(s) {
    s.condition = optimize(s.condition)
    s.block = optimize(s.block)
    if (s.elseifs) {
      s.elseifs = optimize(s.elseifs)
    }
    if (s.elseStatement) {
      s.elseStatement = optimize(s.elseStatement)
    }
    if (s.condition.constructor === Boolean) {
      return s.condition ? s.block : s.elseifs ? s.elseifs : s.elseStatement
    }
    /* c8 ignore next */
    return s
  },
  ElseIf(s) {
    s.condition = optimize(s.condition)
    s.block = optimize(s.block)
    if (s.condition.constructor === Boolean) {
      return s.condition ? s.block : undefined
    }
    /* c8 ignore next */
    return s
  },
  Else(s) {
    s.block = optimize(s.block)
    return s
  },
  WhileStatement(s) {
    s.test = optimize(s.test)
    if (s.test === false) {
      return []
    }
    s.body = optimize(s.body)
    return s
  },
  Conditional(e) {
    e.test = optimize(e.test)
    e.consequent = optimize(e.consequent)
    e.alternate = optimize(e.alternate)
    if (e.test.constructor === Boolean) {
      return e.test ? e.consequent : e.alternate
    }
    return e
  },
  BinaryExpression(e) {
    e.op = optimize(e.op)
    e.left = optimize(e.left)
    e.right = optimize(e.right)
    if (e.op === "&&") {
      // Optimize boolean constants in && and ||
      if (e.left === true) return e.right
      else if (e.right === true) return e.left
    } else if (e.op === "||") {
      if (e.left === false) return e.right
      else if (e.right === false) return e.left
    } else if ([Number, BigInt].includes(e.left.constructor)) {
      // Numeric constant folding when left operand is constant
      if ([Number, BigInt].includes(e.right.constructor)) {
        if (e.op === "+") return e.left + e.right
        else if (e.op === "-") return e.left - e.right
        else if (e.op === "*") return e.left * e.right
        else if (e.op === "/") return e.left / e.right
        else if (e.op === "**") return e.left ** e.right
        else if (e.op === "<") return e.left < e.right
        else if (e.op === "<=") return e.left <= e.right
        else if (e.op === "==") return e.left === e.right
        else if (e.op === "!=") return e.left !== e.right
        else if (e.op === ">=") return e.left >= e.right
        else if (e.op === ">") return e.left > e.right
      } else if (e.left === 0 && e.op === "+") return e.right
      else if (e.left === 1 && e.op === "*") return e.right
      else if (e.left === 0 && e.op === "-")
        return new core.UnaryExpression("-", e.right)
      else if (e.left === 1 && e.op === "**") return 1
      else if (e.left === 0 && ["*", "/"].includes(e.op)) return 0
    } else if (e.right.constructor === Number) {
      // Numeric constant folding when right operand is constant
      if (["+", "-"].includes(e.op) && e.right === 0) return e.left
      else if (["*", "/"].includes(e.op) && e.right === 1) return e.left
      else if (e.op === "*" && e.right === 0) return 0
      else if (e.op === "**" && e.right === 0) return 1
    }
    return e
  },
  UnaryExpression(e) {
    e.op = optimize(e.op)
    e.operand = optimize(e.operand)
    if (e.operand.constructor === Number) {
      if (e.op === "-") {
        return -e.operand
      }
    }
    return e
  },
  SubscriptExpression(e) {
    e.array = optimize(e.array)
    e.index = optimize(e.index)
    return e
  },
  CringeArray(e) {
    e.values = optimize(e.values)
    return e
  },
  MemberExpression(e) {
    e.object = optimize(e.object)
    return e
  },
  Call(c) {
    c.callee = optimize(c.callee)
    c.args = optimize(c.args)
    return c
  },
  BigInt(e) {
    return e
  },
  Number(e) {
    return e
  },
  Boolean(e) {
    return e
  },
  String(e) {
    return e
  },
  /* c8 ignore next 3 */
  Token(t) {
    return t.value ?? t.lexeme
  },
  Array(a) {
    // Flatmap since each element can be an array
    return a.flatMap(optimize)
  },
}
