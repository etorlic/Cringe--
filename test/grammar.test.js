import assert from "assert"
import ast from "../src/ast.js"

// Programs expected to be syntactically correct
const syntaxChecks = [
  ["a simple string literal", 'retweet:"Hello, World!":;;'],
  ["variable declarations", "pog x == 5;;"],
  ["array declarations", "retweet:[1,2,3]:;;"],
  ["function with one param", "flossin boolin f:boolin x: { dab based;; }"],
  ["if", "vibeCheck :x=5: {dab x;;}"],
  ["else", "vibeCheck :x=5: {dab based;;} badVibes {dab unbased;;}"],
  ["elseif", "vibeCheck:x=5:{dab x;;}recount:x=6:{dab based;;}"],
  ["a simple While", "infiniteLoop :x<=5: {dab based;;}"],
  ["boolean literals", "boolin x == based || unbased;;"],
  ["declare characters variables", "car a == r;;"],
  ["declare Strings variables", "manyCars a == Hello;;"],
  ["declare int variables", "pog a == 3;;"],
  ["arithmetic", "dab 2 * x + 3 / 5 - -1 % 7 ** 3 ** 3;;"],
  ["comment", "retweet:0:;; // this is a comment\n"],
  ["comments with no text", "retweet:1:;;//\nretweet:0:;;//"],
  ["conditional", "pog x == based ? 4 : 2;;"],
  ["parentheses", "retweet:83 * ::::::::-:13 / 21::::::::: + 1 - 0:;;"],
  ["shifts", "dab 3 << 5 >> 8 << 13 >> 21;;"],
  ["while with empty block", "infiniteLoop :based: {}"],
  ["while with one statement block", "infiniteLoop :based: { pog x == 1;; }"],
  ["nonempty array literal", "retweet:[1, 2, 3]:;;"],
  ["all numeric literal forms", "retweet:8*89.123*1.3E5*1.3E+5*1.3E-5:;;"],
  ["relational operators", "retweet:1<2||1<=2||1=2||1!=2||1>=2||1>2:;;"],
  ["bitwise ops", "dab :1|2|3: + :4^5^6: + :7&8&9:;;"],
  ["ands can be chained", "retweet:1 && 2 && 3 && 4 && 5:;;"],
  ["ors can be chained", "retweet:1 || 2 || 3 || 4 || 5:;;"],
  ["unary op", "boolean x == true;;x == !x;;"],
  ["call in exp", "retweet:5 * f:4::;;"],
  ["call in statement", "pog x == 1;;\nf:100:;;\nretweet:1:;;"],
  ["array type for param", "flossin pog[] f:pog[] arr: { dab arr;; }"],
  ["multiple statements", "retweet:1:;;\nnx==5;;\ndab 4;;"],
]

// Programs with syntax errors that the parser will detect
const syntaxErrors = [
  ["non-letter in an identifier", "pog ab😭c = 2;;", /Line 1, col 7:/],
  ["malformed number", "pog x == 2.;;", /Line 1, col 12:/],
  [
    "a float with an E but no exponent",
    "pog x == 5E * 11;;",
    /Line 1, col 11:/,
  ],
  ["a missing right operand", "pog x == 5 - ;;", /Line 1, col 14:/],
  ["a non-operator", "retweet:7 * ::2 _ 3::;;", /Line 1, col 17:/],
  ["an expression starting with a :", "dab :;;", /Line 1, col 6:/],
  ["a statement starting with expression", "x * 5;;", /Line 1, col 3:/],
  ["an illegal statement on line 2", "retweet:5:;;\nx * 5;;", /Line 2, col 3:/],
  ["a statement starting with a :", "retweet:5:;;\n:", /Line 2, col 1:/],
  ["an expression starting with a *", "pog x == * 71;;", /Line 1, col 10:/],
  ["mixing ands and ors", "retweet:1 && 2 || 3:;;", /Line 1, col 16:/],
  ["mixing ors and ands", "retweet:1 || 2 && 3:;;", /Line 1, col 16:/],
  ["associating relational operators", "retweet:1<2<3:;;", /Line 1, col 12:/],
  ["while without braces", "infiniteLoop based {dab:2:;;}", /Line 1, col 14/],
  ["if without braces", "vibeCheck 4 = 4 { }", /Line 1, col 11/],
  ["unbalanced brackets", "flossin f::, pog[;;", /Line 1, col 10/],
  ["empty array without type", "[] v == [];;", /Line 1, col 1/],
  ["bad array literal", "retweet:[1,2,]:;;", /Line 1, col 14/],
  ["empty subscript", "retweet:a[]:;;", /Line 1, col 11/],
  ["true is not assignable", "based == 1;;", /Line 1, col 1/],
  ["false is not assignable", "unbased == 1;;", /Line 1, col 1/],
  ["no-paren function type", "flossin pog f(pog i) {}", /Line 1, col 14/],
  [
    "string lit with unknown escape",
    'retweet:"ab\\zcdef":;;',
    /Line 1, col 13/,
  ],
  ["array expression without elements", "pog[] a == [];;", /Line 1, col 13/],
]

describe("The parser", () => {
  for (const [scenario, source] of syntaxChecks) {
    it(`recognizes ${scenario}`, () => {
      assert(ast(source))
    })
  }
  for (const [scenario, source, errorMessagePattern] of syntaxErrors) {
    it(`throws on ${scenario}`, () => {
      assert.throws(() => ast(source), errorMessagePattern)
    })
  }
})
