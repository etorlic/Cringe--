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
  If(_vibeCheck, _open, condition, _close, block, elseifs, elseStatement) {
    return new core.If(
      condition.ast(),
      block.ast(),
      elseifs.ast(),
      elseStatement.ast()[0] ?? null
    )
  },
  ElseIf(_recount, _open, condition, _close, block) {
    return new core.ElseIf(condition.ast(), block.ast())
  },
  Else(_badVibes, block) {
    return new core.Else(block.ast())
  },
  Statement_fundec(_fun, type, id, _open, params, _close, block) {
    return new core.FunctionDeclaration(
      type.ast(),
      id.ast(),
      params.asIteration().ast(),
      block.ast()
    )
  },
  FuncParam(type, id) {
    return new core.FuncParam(type.ast(), id.ast())
  },
  Statement_assign(id, _eq, expression, _semicolon) {
    return new core.Assignment(id.ast(), expression.ast())
  },
  Statement_while(_while, _open, exp, _close, block) {
    return new core.WhileStatement(exp.ast(), block.ast())
  },
  Statement_break(_break, _semicolon) {
    return new core.BreakStatement()
  },
  Statement_return(_return, exp, _semicolon) {
    return new core.ReturnStatement(exp.ast())
  },
  Statement_call(call, _semicolons) {
    return call.ast()
  },
  Statement_print(_retweet, _open, argument, _close, _semicolon) {
    return new core.PrintStatement(argument.ast())
  },
  Block(_open, body, _close) {
    return body.ast()
  },
  Exp_conditional(test, _questionMark, consequent, _colon, alternate) {
    return new core.Conditional(test.ast(), consequent.ast(), alternate.ast())
  },
  Exp1_or(left, _ops, right) {
    const operands = [left.ast(), ...right.ast()]
    return operands.reduce((x, y) => new core.BinaryExpression("||", x, y))
  },
  Exp1_and(left, _ops, right) {
    const operands = [left.ast(), ...right.ast()]
    return operands.reduce((x, y) => new core.BinaryExpression("&&", x, y))
  },
  Exp1a_bitor(left, _ops, right) {
    const operands = [left.ast(), ...right.ast()]
    return operands.reduce((x, y) => new core.BinaryExpression("|", x, y))
  },
  Exp1a_bitxor(left, _ops, right) {
    const operands = [left.ast(), ...right.ast()]
    return operands.reduce((x, y) => new core.BinaryExpression("^", x, y))
  },
  Exp1a_bitand(left, _ops, right) {
    const operands = [left.ast(), ...right.ast()]
    return operands.reduce((x, y) => new core.BinaryExpression("&", x, y))
  },
  Exp2_binary(left, op, right) {
    return new core.BinaryExpression(op.ast(), left.ast(), right.ast())
  },
  Exp2a_shift(left, op, right) {
    return new core.BinaryExpression(op.sourceString, left.ast(), right.ast())
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
  Exp6_unary(op, operand) {
    return new core.UnaryExpression(op.ast(), operand.ast())
  },
  Exp7_parens(_open, expression, _close) {
    return expression.ast()
  },
  Exp7_subscript(array, _left, subscript, _right) {
    return new core.SubscriptExpression(array.ast(), subscript.ast())
  },
  Call(id, _left, args, _right) {
    return new core.Call(id.ast(), args.asIteration().ast())
  },
  Type_array(type, _open, _close) {
    return new core.ArrayType(type.ast())
  },
  CringeArray(_open, values, _close) {
    return new core.CringeArray(values.asIteration().ast())
  },
  int(_) {
    return core.Type.INT
  },
  string(_) {
    return core.Type.STRING
  },
  double(_) {
    return core.Type.DOUBLE
  },
  boolean(_) {
    return core.Type.BOOLEAN
  },
  true(_) {
    return new core.Token("Bool", this.source)
  },
  false(_) {
    return new core.Token("Bool", this.source)
  },
  id(_first, _rest) {
    return new core.Token("Id", this.source)
  },
  intlit(_digits) {
    return new core.Token("Int", this.source)
  },
  doublelit(_whole, _point, _fraction, _e, _sign, _exponent) {
    return new core.Token("Double", this.source)
  },
  stringlit(_openQuote, _chars, _closeQuote) {
    return new core.Token("String", this.source)
  },
  _terminal() {
    return new core.Token("Sym", this.source)
  },
  _iter(...children) {
    return children.map((child) => child.ast())
  },
})

export default function ast(sourceCode) {
  const match = cringeMMGrammar.match(sourceCode)
  if (!match.succeeded()) core.error(match.message)
  return astBuilder(match).ast()
}
