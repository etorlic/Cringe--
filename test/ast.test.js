import assert from "assert/strict"
import util from "util"
import ast from "../src/ast.js"

const source = `retweet:!1:;;int x == 5;;int x == 5;;vibeCheck :x=5: { retweet:x:;; }int x == 0;;infiniteLoop :x<10: { retweet:x:;;x == x + 1;;}flossin boolin exampleFunction:boolin vibe: { dab vibe;; }`

const expected = `   1 | Program statements=[#2,#4,#5,#6,#9,#10,#15]
   2 | Call callee=(Id,"retweet") args=[#3]
   3 | BinaryExpression op=(Sym,"!") left=(Num,"1") right=undefined
   4 | VariableDeclaration type=(Sym,"int") variable=(Id,"x") initializer=(Num,"5")
   5 | VariableDeclaration type=(Sym,"int") variable=(Id,"x") initializer=(Num,"5")
   6 | If condition=#7 block=[#8] elseifs=null elseStatement=null
   7 | BinaryExpression op=(Sym,"=") left=(Id,"x") right=(Num,"5")
   8 | Call callee=(Id,"retweet") args=[(Id,"x")]
   9 | VariableDeclaration type=(Sym,"int") variable=(Id,"x") initializer=(Num,"0")
  10 | WhileStatement test=#11 body=[#12,#13]
  11 | BinaryExpression op=(Sym,"<") left=(Id,"x") right=(Num,"10")
  12 | Call callee=(Id,"retweet") args=[(Id,"x")]
  13 | Assignment target=(Id,"x") source=#14
  14 | BinaryExpression op=(Sym,"+") left=(Id,"x") right=(Num,"1")
  15 | FunctionDeclaration type=(Sym,"boolin") id=(Id,"exampleFunction") params=(Sym,"boolin") body=(Id,"vibe")`

describe("The AST generator", () => {
  it("produces the expected AST for all node types", () => {
    assert.deepEqual(util.format(ast(source)), expected)
  })
})
