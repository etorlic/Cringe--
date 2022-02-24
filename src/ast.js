import fs from "fs"
import ohm from "ohm-js"
import * as core from "./core.js"

const cringeMMGrammar = ohm.grammar(fs.readFileSync("src/cringe--.ohm"))

const astBuilder = cringeMMGrammar.createSemantics().addOperation("ast", {
  Program(body) {
    return new core.Program(body.ast())
  },
  Statement_declaration(type, id, _eq, initializer, _semicolon) {
    return new core.VariableDeclaration(type.ast(), id.ast(), initializer.ast())
  },
  Statement_If(_vibeCheck, _open, condition, _close, block, elseifs, elseStatement) {
      return new core.If(condition.ast(), block.ast(), elseifs.asIteration().ast(), elseStatement.ast())
  }, 
  Statement_ElseIf(_recount, _open, condition, _close, block) {
      return new core.ElseIf(condition, block)
  }, 
  Statement_Else(_badVibes, block) {
    return new core.Else(block)
  }, 
  Statement_fundec(_fun, type, id, _open, params,  _close, block) {
    return new core.FunctionDeclaration(type.ast(), id.ast(), params.asIteration().ast(), block.ast())
  },
  Statement_assign(id, _eq, expression, _semicolon) {
    return new core.Assignment(id.ast(), expression.ast())
  },
  Statement_while(_while, _open, exp, _close, block) {
    return new core.WhileStatement(exp.ast(), block.ast())
  },
  Statement_return(_return, exp, _semicolon) {
    return new core.ReturnStatement(exp.ast())
  },
  Statement_print(_print, argument, _semicolon) {
    return new core.PrintStatement(argument.ast())
  },
  Block(_open, body, _close) {
    return body.ast()
  },
  Exp_unary(op, operand) {
    return new core.UnaryExpression(op.ast(), operand.ast())
  },
  Exp_ternary(test, _questionMark, consequent, _colon, alternate) {
    return new core.Conditional(test.ast(), consequent.ast(), alternate.ast())
  },
  Exp1_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp2_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp3_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp4_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp5_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp6_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp7_parens(_open, expression, _close) {
    return expression.ast()
  },
  Call(id, _left, args, _right) {
    return new core.Call(id.ast(), args.asIteration().ast())
  },
  Type_array(type, _open, _close) {
    return new core.Type(type.ast())
  },
  Type(id) {
    return new id.ast()
  },
  Array(_open, values, _close) {
    return new core.Array(values.asIteration().ast())
  },
  id(_first, _rest) {
    return new core.Token("Id", this.source)
  },
  true(_) {
    return new core.Token("Bool", this.source)
  },
  false(_) {
    return new core.Token("Bool", this.source)
  },
  num(_whole, _point, _fraction, _e, _sign, _exponent) {
    return new core.Token("Num", this.source)
  },
  _terminal() {
    return new core.Token("Sym", this.source)
  },
  _iter(...children) {
    return children.map(child => child.ast())
  },
})

export default function ast(sourceCode) {
  const match = bellaGrammar.match(sourceCode)
  if (!match.succeeded()) core.error(match.message)
  return astBuilder(match).ast()
}