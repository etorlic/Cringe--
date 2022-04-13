// import assert from "assert"
// import ast from "../src/ast.js"
// import analyze from "../src/analyzer.js"
// import * as core from "../src/core.js"

// // Programs that are semantically correct
// const semanticChecks = [
//   ["variable declarations", 'int x == 5;; x--;; x++;;'],
//   ["initialize with empty array", "int[] emptyList == [];;"],
//   ["assign arrays", "int[][] nonEmptyList == [[1,2],[3,4]];;"],
//   ["initialize with empty optional", "let a = no int;"],
//   ["return", "flossin boolin f:boolin x: { dab based;; }"],
//   ["assign optionals", "int a == 3;; int b==1;;a==b;;b==a;;"],
//   ["return in nested if", "flossin  boolin f:boolin x: {vibeCheck:isBased: {dab based;;}}"],
//   ["break in nested if", "infiniteLoop :based: {vibeCheck:isBased: {break;;}}"],
//   ["long if", "vibeCheck:isBased: {retweet:vibeCheck:;;} badVibes {retweet:badVibes:;;}"],
//   ["else if", "vibeCheck:isBased: {retweet:vibeCheck:;;} recount:isBased: {dab based;;} badVibes {retweet:badVibes:;;}"],
//   ["conditionals with ints", "retweet: based ? 8 : 5:;;"],
//   ["conditionals with floats", "retweet: based ? 8.2 : 5.4:;;"],
//   ["conditionals with strings", 'retweet: 1<2 ? "x" : "y":;;'],
//   ["||", "retweet: based || 1<2 || !based:;;"],
//   ["&&", "print(true&&1<2&&false&&!true);"],
//   ["bit ops", "retweet: :1&2: | :9^3::;;"],
//   ["relations", 'retweet: 1<=2 && "x">"y" && 3.5<1.2 :;;'],
//   ["ok to == arrays", "retweet: [1]=[5,3]:;;"],
//   ["ok to != arrays", "retweet: [1]!=[5,3]:;;"],
//   ["shifts", "retweet:1<<3<<5<<8>>2>>0:;;"],
//   ["arithmetic", "int x==1;;retweet:2*3+5**-3/2-5%8:;;"],
//   ["subscript exp", "int a==[1,2];; retweet:a:[0]::;;"],
//   ["assigned functions", "flossin boolin f:boolin x: { retweet:3:;;} int g==f;; g==f;;"],
//   ["call of assigned functions", "flossin boolin f:boolin x: { retweet:3:;;} int g==f;; g==:based:;;"],
//   ["call of assigned function in expression","flossin boolin f:boolin x: { retweet:3:;;} int g==f;; retweet:g:1,based::;;f==g;;"],
// ]

// // Programs that are syntactically correct but have semantic errors
// // const semanticErrors = [
// //   ["non-distinct fields", "struct S {x: boolean x: int}", /Fields must be distinct/],
// //   ["non-int increment", "let x=false;x++;", /an integer, found boolean/],
// //   ["non-int decrement", 'let x=some[""];x++;', /an integer, found [string]?/],
// //   ["undeclared id", "print(x);", /Identifier x not declared/],
// //   ["redeclared id", "let x = 1;let x = 1;", /Identifier x already declared/],
// //   ["recursive struct", "struct S { x: int y: S }", /must not be recursive/],
// //   ["assign to const", "const x = 1;x = 2;", /Cannot assign to constant x/],
// //   ["assign bad type", "let x=1;x=true;", /Cannot assign a boolean to a int/],
// //   ["assign bad array type", "let x=1;x=[true];", /Cannot assign a \[boolean\] to a int/],
// //   ["assign bad optional type", "let x=1;x=some 2;", /Cannot assign a int\? to a int/],
// //   ["break outside loop", "break;", /Break can only appear in a loop/],
// //   [
// //     "break inside function",
// //     "while true {function f() {break;}}",
// //     /Break can only appear in a loop/,
// //   ],
// //   ["return outside function", "return;", /Return can only appear in a function/],
// //   [
// //     "return value from void function",
// //     "function f() {return 1;}",
// //     /Cannot return a value here/,
// //   ],
// //   [
// //     "return nothing from non-void",
// //     "function f(): int {return;}",
// //     /should be returned here/,
// //   ],
// //   ["return type mismatch", "function f(): int {return false;}", /boolean to a int/],
// //   ["non-boolean short if test", "if 1 {}", /a boolean, found int/],
// //   ["non-boolean if test", "if 1 {} else {}", /a boolean, found int/],
// //   ["non-boolean while test", "while 1 {}", /a boolean, found int/],
// //   ["non-integer repeat", 'repeat "1" {}', /an integer, found string/],
// //   ["non-integer low range", "for i in true...2 {}", /an integer, found boolean/],
// //   ["non-integer high range", "for i in 1..<no int {}", /an integer, found int\?/],
// //   ["non-array in for", "for i in 100 {}", /Array expected/],
// //   ["non-boolean conditional test", "print(1?2:3);", /a boolean, found int/],
// //   ["diff types in conditional arms", "print(true?1:true);", /not have the same type/],
// //   ["unwrap non-optional", "print(1??2);", /Optional expected/],
// //   ["bad types for ||", "print(false||1);", /a boolean, found int/],
// //   ["bad types for &&", "print(false&&1);", /a boolean, found int/],
// //   ["bad types for ==", "print(false==1);", /Operands do not have the same type/],
// //   ["bad types for !=", "print(false==1);", /Operands do not have the same type/],
// //   ["bad types for +", "print(false+1);", /number or string, found boolean/],
// //   ["bad types for -", "print(false-1);", /a number, found boolean/],
// //   ["bad types for *", "print(false*1);", /a number, found boolean/],
// //   ["bad types for /", "print(false/1);", /a number, found boolean/],
// //   ["bad types for **", "print(false**1);", /a number, found boolean/],
// //   ["bad types for <", "print(false<1);", /number or string, found boolean/],
// //   ["bad types for <=", "print(false<=1);", /number or string, found bool/],
// //   ["bad types for >", "print(false>1);", /number or string, found bool/],
// //   ["bad types for >=", "print(false>=1);", /number or string, found bool/],
// //   ["bad types for ==", "print(2==2.0);", /not have the same type/],
// //   ["bad types for !=", "print(false!=1);", /not have the same type/],
// //   ["bad types for negation", "print(-true);", /a number, found boolean/],
// //   ["bad types for length", "print(#false);", /Array expected/],
// //   ["bad types for not", 'print(!"hello");', /a boolean, found string/],
// //   ["non-integer index", "let a=[1];print(a[false]);", /integer, found boolean/],
// //   ["no such field", "struct S{} let x=S(); print(x.y);", /No such field/],
// //   ["diff type array elements", "print([3,3.0]);", /Not all elements have the same type/],
// //   ["shadowing", "let x = 1;\nwhile true {let x = 1;}", /Identifier x already declared/],
// //   ["call of uncallable", "let x = 1;\nprint(x());", /Call of non-function/],
// //   [
// //     "Too many args",
// //     "function f(x: int) {}\nf(1,2);",
// //     /1 argument\(s\) required but 2 passed/,
// //   ],
// //   [
// //     "Too few args",
// //     "function f(x: int) {}\nf();",
// //     /1 argument\(s\) required but 0 passed/,
// //   ],
// //   [
// //     "Parameter type mismatch",
// //     "function f(x: int) {}\nf(false);",
// //     /Cannot assign a boolean to a int/,
// //   ],
// //   [
// //     "function type mismatch",
// //     `function f(x: int, y: (boolean)->void): int { return 1; }
// //      function g(z: boolean): int { return 5; }
// //      f(2, g);`,
// //     /Cannot assign a \(boolean\)->int to a \(boolean\)->void/,
// //   ],
// //   ["bad call to stdlib sin()", "print(sin(true));", /Cannot assign a boolean to a float/],
// //   ["Non-type in param", "let x=1;function f(y:x){}", /Type expected/],
// //   ["Non-type in return type", "let x=1;function f():x{return 1;}", /Type expected/],
// //   ["Non-type in field type", "let x=1;struct S {y:x}", /Type expected/],
// // ]

// // Test cases for expected semantic graphs after processing the AST. In general
// // this suite of cases should have a test for each kind of node, including
// // nodes that get rewritten as well as those that are just "passed through"
// // by the analyzer. For now, we're just testing the various rewrites only.

// const Int = core.Type.INT

// const varX = Object.assign(new core.Variable("x", false), { type: Int })

// const letX1 = new core.VariableDeclaration(varX, 1n)
// const assignX2 = new core.Assignment(varX, 2n)

// const functionF = new core.FunctionDeclaration(
//   Object.assign(new core.Function()))

// const graphChecks = [
//   ["Variable created & resolved", "int x==1; x==2;;", [letX1, assignX2]],
//   ["functions created & resolved", "flossin boolin f:boolin x: { dab based;;", [functionF]],
// ]

// describe("The analyzer", () => {
//   for (const [scenario, source] of semanticChecks) {
//     it(`recognizes ${scenario}`, () => {
//       assert.ok(analyze(ast(source)))
//     })
//   }
//   // for (const [scenario, source, errorMessagePattern] of semanticErrors) {
//   //   it(`throws on ${scenario}`, () => {
//   //     assert.throws(() => analyze(ast(source)), errorMessagePattern)
//   //   })
//   // }
//   for (const [scenario, source, graph] of graphChecks) {
//     it(`properly rewrites the AST for ${scenario}`, () => {
//       assert.deepStrictEqual(analyze(ast(source)), new core.Program(graph))
//     })
//   }
// })