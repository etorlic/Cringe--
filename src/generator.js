// CODE GENERATOR: Cringe-- -> JavaScript
//
// Invoke generate(program) with the program node to get back the JavaScript
// translation as a string.

import { If, Type } from "./core.js"
import * as stdlib from "./stdlib.js"

export default function generate(program) {
  const output = []

  const standardFunctions = new Map([
    [stdlib.contents.print, (x) => `console.log(${x})`],
  ])

  // Variable and function names in JS will be suffixed with _1, _2, _3,
  // etc. This is because "switch", for example, is a legal name in Carlos,
  // but not in JS. So, the Carlos variable "switch" must become something
  // like "switch_1". We handle this by mapping each name to its suffix.
  const targetName = ((mapping) => {
    return (entity) => {
      if (!mapping.has(entity)) {
        mapping.set(entity, mapping.size + 1)
      }
      return `${entity.name ?? entity.lexeme}_${mapping.get(entity)}`
    }
  })(new Map())

  function gen(node) {
    return generators[node.constructor.name](node)
  }

  const generators = {
    // Key idea: when generating an expression, just return the JS string; when
    // generating a statement, write lines of translated JS to the output array.
    Program(p) {
      gen(p.statements)
    },
    VariableDeclaration(d) {
      // We don't care about const vs. let in the generated code! The analyzer has
      // already checked that we never updated a const, so let is always fine.
      output.push(`let ${gen(d.variable)} = ${gen(d.initializer)};`)
    },
    FunctionDeclaration(d) {
      output.push(`function ${gen(d.value)} (${gen(d.params).join(", ")}) {`)
      gen(d.block)
      output.push("}")
    },
    FuncParam(p) {
      return targetName(p.id)
    },
    Variable(v) {
      // Standard library constants just get special treatment
      return targetName(v)
    },
    Function(f) {
      return targetName(f)
    },
    Assignment(s) {
      output.push(`${gen(s.target)} = ${gen(s.source)};`)
    },
    BreakStatement(s) {
      output.push("break;")
    },
    ReturnStatement(s) {
      output.push(`return ${gen(s.value)};`)
    },
    If(s) {
      output.push(`if (${gen(s.condition)}) {`)
      gen(s.block)
      if (s.elseifs) {
        gen(s.elseifs)
      }
      if (s.elseStatement) {
        gen(s.elseStatement)
      }
      output.push(`}`)
    },
    ElseIf(s) {
      output.push(`} else if (${gen(s.condition)}) { `)
      gen(s.block)
    },
    Else(s) {
      output.push(`} else {`)
      gen(s.block)
    },
    WhileStatement(s) {
      output.push(`while (${gen(s.test)}) {`)
      gen(s.body)
      output.push("}")
    },
    PrintStatement(s) {
      output.push(`console.log(${gen(s.argument)})`)
    },
    Conditional(e) {
      return `((${gen(e.test)}) ? (${gen(e.consequent)}) : (${gen(
        e.alternate
      )}))`
    },
    BinaryExpression(e) {
      let op = { "==": "===", "!=": "!==" }[e.op] ?? e.op
      if (op == "=") {
        op = "==="
      }
      return `(${gen(e.left)} ${op} ${gen(e.right)})`
    },
    UnaryExpression(e) {
      return `${e.op}(${gen(e.operand)})`
    },
    SubscriptExpression(e) {
      return `${gen(e.array)}[${gen(e.index)}]`
    },
    CringeArray(e) {
      return `[${gen(e.values).join(",")}]`
    },
    //for some reason when there's no comment here, we get an uncovered line
    Call(c) {
      const targetCode = `${gen(c.callee)}(${gen(c.args).join(", ")})`
      // Calls in expressions vs in statements are handled differently
      if (c.callee instanceof Type || c.callee.type.returnType !== Type.VOID) {
        return targetCode
      }
      output.push(`${targetCode};`)
    },
    Number(e) {
      return e
    },
    BigInt(e) {
      return e
    },
    Boolean(e) {
      return e
    },
    String(e) {
      return e
    },
    Array(a) {
      return a.map(gen)
    },
  }

  gen(program)
  return output.join("\n")
}
