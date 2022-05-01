import assert from "assert/strict"
import ast from "../src/ast.js"
import analyze from "../src/analyzer.js"
import optimize from "../src/optimizer.js"
import generate from "../src/generator.js"

function dedent(s) {
  return `${s}`.replace(/(?<=\n)\s+/g, "").trim()
}

const fixtures = [
  {
    name: "small",
    source: `
      pog x == 3 * 7;;
      x == x + 1;;
      x == x - 1;;
      boolin y == based;;
      y == 5 ** -x / -100 > - x || unbased;;
      retweet::y && y: || unbased || :x*2: != 5:;;
    `,
    expected: dedent`
      let x_1 = 21;
      x_1 = (x_1 + 1);
      x_1 = (x_1 - 1);
      let y_2 = true;
      y_2 = (((5 ** -(x_1)) / -(100)) > -(x_1));
      console.log(((y_2 && y_2) || ((x_1 * 2) !== 5)))
    `,
  },
  {
    name: "if",
    source: `
      pog x == 0;;
      vibeCheck:x = 0: { retweet:1:;; }
      vibeCheck:x = 0: { retweet:1:;; } badVibes { retweet:2:;; }
      vibeCheck:x = 0: { retweet:1:;;} recount :x = 2: { retweet:3:;;}
      vibeCheck:x = 0: { retweet:1:;;} recount :x = 2: { retweet:3:;;} badVibes { retweet:4:;; }
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
        console.log(1)
      }
      
      if ((x_1 === 0)) {
        console.log(1)
      } else {
        console.log(2)
      }

      if ((x_1 === 0)) {
        console.log(1)
      } else if ((x_1 === 2)) { 
        console.log(3)
      }

      if ((x_1 === 0)) {
        console.log(1)
      } else if ((x_1 === 2)) { 
        console.log(3)
      } else {
          console.log(4)
      }
    `,
  },
  {
    name: "while",
    source: `
      pog x == 0;;
      infiniteLoop:x < 5: {
        pog y == 0;;
        infiniteLoop:y < 5: {
          retweet:x * y:;;
          y == y + 1;;
          break;;
        }
        x == x + 1;;
      }
    `,
    expected: dedent`
      let x_1 = 0;
      while ((x_1 < 5)) {
        let y_2 = 0;
        while ((y_2 < 5)) {
          console.log((x_1 * y_2))
          y_2 = (y_2 + 1);
          break;
        }
        x_1 = (x_1 + 1);
      }
    `,
  },
  {
    name: "functions",
    source: `
      pog a == 0.5;;
      flossin boolin f:dublin x, boolin y: {
        retweet:based = based:;;
        dab based;;
      }
      flossin boolin g:dublin z: {
        dab unbased;;
      }
      boolin b == g:a:;;
      f:a, b:;;
    `,
    expected: dedent`
      let a_1 = 0.5;
      function f_2 (x_3, y_4) {
        console.log((true === true))
        return true;
      }
      function g_5 (z_6) {
        return false;
      }
      let b_7 = g_5(a);
      f_2(a_1, b_2);
    `,
  },
  {
    name: "arrays",
    source: `
      pog[] a == [30, 20, 10];;
      pog[] b == [10, 40 - 20, 30];;
      retweet:a[1] + b[1]:;;
    `,
    expected: dedent`
      let a_1 = [30,20,10];
      let b_2 = [10,20,30];
      console.log((a_1[1] + b_2[1]))
    `,
  },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(ast(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
