import assert from "assert/strict"
import util from "util"
import ast from "../src/ast.js"

const source = `boolean x == true;;x == !x;;vibeCheck :x=5: { retweet:x:;; }recount :x=6: { retweet:x:;; }badVibes{ retweet:x:;; }int x == 0;;infiniteLoop :x<10: { retweet:x:;;x == x + 1;;}flossin boolin exampleFunction:boolin vibe: { dab vibe;; }`

const expected = `   1 | Program statements=[#2,#3,#5,#13,#14,#19]
   2 | VariableDeclaration type=(Id,"boolean") variable=(Id,"x") initializer=(Id,"true")
   3 | Assignment target=(Id,"x") source=#4
   4 | UnaryExpression op=(Sym,"!") operand=(Id,"x")
   5 | If condition=#6 block=[#7] elseifs=[#8] elseStatement=#11
   6 | BinaryExpression op=(Sym,"=") left=(Id,"x") right=(Int,"5")
   7 | PrintStatement argument=(Id,"x")
   8 | ElseIf condition=#9 block=[#10]
   9 | BinaryExpression op=(Sym,"=") left=(Id,"x") right=(Int,"6")
  10 | PrintStatement argument=(Id,"x")
  11 | Else block=[#12]
  12 | PrintStatement argument=(Id,"x")
  13 | VariableDeclaration type=(Id,"int") variable=(Id,"x") initializer=(Int,"0")
  14 | WhileStatement test=#15 body=[#16,#17]
  15 | BinaryExpression op=(Sym,"<") left=(Id,"x") right=(Int,"10")
  16 | PrintStatement argument=(Id,"x")
  17 | Assignment target=(Id,"x") source=#18
  18 | BinaryExpression op=(Sym,"+") left=(Id,"x") right=(Int,"1")
  19 | FunctionDeclaration type=(Sym,"boolin") id=(Id,"exampleFunction") params=[#20] body=[#21]
  20 | FuncParam type=(Sym,"boolin") id=(Id,"vibe")
  21 | ReturnStatement value=(Id,"vibe")`


describe("The AST generator", () => {
  it("produces the expected AST for all node types", () => {
    assert.deepEqual(util.format(ast(source)), expected)
  })
})
