import assert from "assert"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"
import * as core from "../src/core.js"

// Programs that are semantically correct
const semanticChecks = [
  ["variable declarations and assignments", "pog x == 5;; pog y == 0;; x==y;;"],
  ["assign arrays", "pog[][] nonEmptyList == [[1,2],[3,4]];;"],
  ["return", "flossin boolin f:boolin x: { dab based;; }"],
  ["assign variables", "pog a == 3;; pog b==1;;a==b;;b==a;;"],
  [
    "return in nested if",
    "flossin  boolin f:boolin x: {boolin isBased == based;; vibeCheck:isBased: {dab based;;}}",
  ],
  [
    "break in nested if",
    "infiniteLoop :based: {boolin isBased == based;; vibeCheck:isBased: {break;;}}",
  ],
  [
    "long if",
    "boolin isBased == based;; vibeCheck:isBased: {retweet:based:;;} badVibes {retweet:unbased:;;}",
  ],
  [
    "else if",
    "boolin isBased == based;; vibeCheck:isBased: {retweet:based:;;} recount:isBased: {retweet:based:;;} badVibes {retweet:unbased:;;}",
  ],
  ["conditionals with ints", "retweet: based ? 8 : 5:;;"],
  ["conditionals with doubls", "retweet: based ? 8.2 : 5.4:;;"],
  ["conditionals with strings", 'retweet: 1<2 ? "x" : "y":;;'],
  ["||", "retweet: based || 1<2 || !based:;;"],
  ["&&", "retweet:based&&1<2&&unbased&&!based:;;"],
  ["bit ops", "retweet: :1&2: | :9^3::;;"],
  ["relations", 'retweet: 1<=2 && "x">"y" && 3.5<1.2 :;;'],
  ["ok to == arrays", "retweet: [1]=[5,3]:;;"],
  ["ok to != arrays", "retweet: [1]!=[5,3]:;;"],
  ["shifts", "retweet:1<<3<<5<<8>>2>>0:;;"],
  ["arithmetic", "pog x==1;;retweet:2*3-x+5**-3/2-5%8:;;"],
  ["subscript exp", "pog a==[1,2];; retweet:a[0]:;;"],
  [
    "assigned functions",
    "flossin pog f:boolin x: { dab 3;;} pog g==f;; g==f;;",
  ],
  [
    "call of assigned functions",
    "flossin pog f:boolin x: { dab 3;;} pog g==f;; g:based:;;",
  ],
  [
    "call of assigned function in expression",
    "flossin pog f:pog x, boolin y: { dab 3;;} pog g==f;; retweet:g:1,based::;;f==g;;",
  ],
]

// Programs that are syntactically correct but have semantic errors
const semanticErrors = [
  ["add to an non int", "boolin x==unbased;;x==x+1;;", /a number or string/],
  ["non-int decrement", 'manyCars x=="Test";;x==x-1;;', /a number/],
  ["undeclared id", "retweet:x:;;", /Identifier x not declared/],
  [
    "redeclared id",
    "pog x == 1;;pog x == 1;;",
    /Identifier x already declared/,
  ],
  [
    "assign bad type",
    "pog x==1;;x==based;;",
    /Cannot assign a boolin to a pog/,
  ],
  [
    "assign array to non array",
    "pog x==1;;x==[1,2];;",
    /Cannot assign a \[pog\] to a pog/,
  ],
  [
    "assign bad array type",
    'pog[] x==[1];;x==["hello"];;',
    /Cannot assign a \[manyCars\] to a \[pog\]/,
  ],
  ["break outside loop", "break;;", /Break can only appear in a loop/],
  [
    "break inside function",
    "infiniteLoop:based: {flossin pog f:: {break;;}}",
    /Break can only appear in a loop/,
  ],
  [
    "return outside function",
    "dab based;;",
    /Return can only appear in a function/,
  ],
  [
    "return type mismatch",
    "flossin pog f:: {dab unbased;;}",
    /Return type does not match declared function type/,
  ],
  ["non-boolean short if test", "vibeCheck:1: {}", /Expected a boolean/],
  ["non-boolean if test", "vibeCheck:1: {} badVibes {}", /Expected a boolean/],
  ["non-boolean while test", "infiniteLoop:1: {}", /Expected a boolean/],
  ["non-boolean conditional test", " retweet:1?2:3:;;", /Expected a boolean/],
  [
    "diff types in conditional arms",
    " retweet:based ? 1:based:;;",
    /not have the same type/,
  ],
  ["bad types for ||", " retweet:unbased||1:;;", /Expected a boolean/],
  ["bad types for &&", " retweet:unbased&&1:;;", /Expected a boolean/],
  [
    "bad types for ==",
    " retweet:unbased=1:;;",
    /Operands do not have the same type/,
  ],
  [
    "bad types for !=",
    " retweet:unbased!=1:;;",
    /Operands do not have the same type/,
  ],
  ["bad types for +", " retweet:unbased+1:;;", /Expected a number or string/],
  ["bad types for -", " retweet:unbased-1:;;", /Expected a number/],
  ["bad types for *", " retweet:unbased*1:;;", /Expected a number/],
  ["bad types for /", " retweet:unbased/1:;;", /Expected a number/],
  ["bad types for **", " retweet:unbased**1:;;", /Expected a number/],
  ["bad types for <", " retweet:unbased<1:;;", /Expected a number or string/],
  ["bad types for <=", " retweet:unbased<=1:;;", /Expected a number or string/],
  ["bad types for >", " retweet:unbased>1:;;", /Expected a number or string/],
  ["bad types for >=", " retweet:unbased>=1:;;", /Expected a number or string/],
  ["bad types for ==", " retweet:2=2.0:;;", /not have the same type/],
  ["bad types for !=", " retweet:unbased!=1:;;", /not have the same type/],
  ["bad types for negation", " retweet:-based:;;", /Expected a number/],
  ["bad types for not", ' retweet:!"hello":;;', /Expected a boolean/],
  [
    "non-integer index",
    "pog[] a==[1];; retweet:a[unbased]:;;",
    /Expected an integer/,
  ],
  [
    "diff type array elements",
    " retweet:[3,3.0]:;;",
    /Not all elements have the same type/,
  ],
  [
    "shadowing",
    "pog x == 1;;\ninfiniteLoop: based: {pog x == 1;;}",
    /Identifier x already declared/,
  ],
  [
    "call of uncallable",
    "pog x == 1;;\n retweet:x:::;;",
    /Call of non-function/,
  ],
  [
    "Too many args",
    "flossin pog f: pog x: {dab 5;;}\nf:1,2:;;",
    /1 argument\(s\) required but 2 passed/,
  ],
  [
    "Too few args",
    "flossin pog f: pog x: {dab 5;;}\nf::;;",
    /1 argument\(s\) required but 0 passed/,
  ],
  [
    "Parameter type mismatch",
    "flossin pog f:pog x: {dab 5;;}\nf:unbased:;;",
    /Cannot assign a boolin to a pog/,
  ],
  [
    "function param type mismatch",
    `flossin pog f:pog x: { dab 1;; }
     flossin pog g: boolin z:{ dab 5;; }
     f==g;;`,
    /Cannot assign a \(boolin\)->pog to a \(pog\)->pog/,
  ],
  [
    "function return type mismatch",
    `flossin pog f:pog x: { dab 1;; }
     flossin boolin g: pog z:{ dab unbased;; }
     f==g;;`,
    /Cannot assign a \(pog\)->boolin to a \(pog\)->pog/,
  ],
]

// Test cases for expected semantic graphs after processing the AST. In general
// this suite of cases should have a test for each kind of node, including
// nodes that get rewritten as well as those that are just "passed through"
// by the analyzer. For now, we're just testing the various rewrites only.

const Int = core.Type.INT

const varX = Object.assign(new core.Variable("x", false), { type: Int })

const letX1 = new core.VariableDeclaration(core.Type.INT, varX, 1n)
const assignX2 = new core.Assignment(varX, 2n)

const functionF = new core.FunctionDeclaration(
  Object.assign(new core.Function())
)

describe("The analyzer", () => {
  for (const [scenario, source] of semanticChecks) {
    it(`recognizes ${scenario}`, () => {
      assert.ok(analyze(ast(source)))
    })
  }
  for (const [scenario, source, errorMessagePattern] of semanticErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => analyze(ast(source)), errorMessagePattern)
    })
  }
})
