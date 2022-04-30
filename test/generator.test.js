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
      x_1++;
      x_1--;
      let y_2 = true;
      y_2 = (((5 ** -(x_1)) / -(100)) > -(x_1));
      console.log(((y_2 && y_2) || ((x_1 * 2) !== 5)));
    `,
  },
  {
    name: "if",
    source: `
      pog x == 0;;
      vibeCheck:x = 0: { retweet:"1":;; }
      vibeCheck:x = 0: { retweet:1:;; } badVibes { retweet:2:;; }
      vibeCheck:x = 0: { retweet:1:;;} recount :x = 2: { retweet:3:;;}
      vibeCheck:x = 0: { retweet:1:;;} recount :x = 2: { retweet:3:;;} badVibes { retweet:4:;; }
    `,
    expected: dedent`
      let x_1 = 0;
      if ((x_1 === 0)) {
        console.log("1");
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else {
        console.log(2);
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else {
        if ((x_1 === 2)) {
          console.log(3);
        }
      }
      if ((x_1 === 0)) {
        console.log(1);
      } else
        if ((x_1 === 2)) {
          console.log(3);
        } else {
          console.log(4);
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
      pog z == 0.5;;
      flossin void f: double x, boolin y: {
        retweet:based = baed:;;
        dab based;;
      }
      flossin boolean g:: {
        dab unbased;;
      }
      f:z, g:::;;
    `,
    expected: dedent`
      let z_1 = 0.5;
      function f_2(x_3, y_4) {
        console.log(based === based);
        return true;
      }
      function g_5() {
        return false;
      }
      f_2(z_1, g_5());
    `,
  },
  {
    name: "arrays",
    source: `
      boolin[] a == [based, unbased, based];;
      pog[] b == [10, 40 - 20, 30];;
      retweet:a[1] + b[2]:;;
    `,
    expected: dedent`
      let a_1 = [true,false,true];
      let b_2 = [10,20,30];
      console.log(a_1[1] + b_2[2]);
    `,
  },
  //   {
  //     name: "standard library",
  //     source: `
  //       let x = 0.5;
  //       print(sin(x) - cos(x) + exp(x) * ln(x) / hypot(2.3, x));
  //       print(bytes("∞§¶•"));
  //       print(codepoints("💪🏽💪🏽🖖👩🏾💁🏽‍♀️"));
  //     `,
  //     expected: dedent`
  //       let x_1 = 0.5;
  //       console.log(((Math.sin(x_1) - Math.cos(x_1)) + ((Math.exp(x_1) * Math.log(x_1)) / Math.hypot(2.3,x_1))));
  //       console.log([...Buffer.from("∞§¶•", "utf8")]);
  //       console.log([...("💪🏽💪🏽🖖👩🏾💁🏽‍♀️")].map(s=>s.codePointAt(0)));
  //     `,
  //   },
]

describe("The code generator", () => {
  for (const fixture of fixtures) {
    it(`produces expected js output for the ${fixture.name} program`, () => {
      const actual = generate(optimize(analyze(ast(fixture.source))))
      assert.deepEqual(actual, fixture.expected)
    })
  }
})
