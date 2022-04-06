import React from "react";

import "./Examples.css";

const Examples = (props) => {
  const { cringeMode } = props;
  return (
    <div className="Examples">
      <table id="examples">
        <thead>
          <tr>
            <th>Language Comparisons</th>
            <th>Javascript</th>
            <th>Cringe--</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hello World</td>
            <td>
              <pre>console.log("Hello, World!")</pre>
            </td>
            <td>
              <pre>retweet:"Hello, World!":;;</pre>
            </td>
          </tr>
          <tr>
            <td>Declarations</td>
            <td>
              <pre>x = true</pre>
            </td>
            <td>
              <pre>boolin x == based;;</pre>
            </td>
          </tr>
          <tr>
            <td>Conditionals</td>
            <td>
              <pre>
                let x = 5<br></br>
                if (x==5) {"{"}
                <br></br>
                {"  console.log(x)"}
                <br></br>
                {"}"}
              </pre>
            </td>
            <td>
              <pre>
                int x == 5;;
                <br></br>
                vibeCheck :x=5: {"{"}
                <br></br>
                {"  retweet:x:;;"}
                <br></br>
                {"}"}
              </pre>
            </td>
          </tr>
          <tr>
            <td>Loops</td>
            <td>
              <pre>
                let x = 0<br></br>
                {"while (x<10) {"}
                <br></br>
                {"  console.log(x)"}
                <br></br>x = x + 1<br></br>
                {"}"}
              </pre>
            </td>
            <td>
              <pre>
                int x == 0;;<br></br>
                {"infiniteLoop :x<10: { "}
                <br></br>
                {"  retweet:x:"}
                <br></br>
                {"  x == x + 1 ;;"}
                <br></br>
                {"}"}
              </pre>
            </td>
          </tr>
          <tr>
            <td>Data Structures</td>
            <td>
              <pre>
                let emptyList = []<br></br>
                let nonEmptyList = [1,2,3,4]
              </pre>
            </td>
            <td>
              <pre>
                int[] emptyList == [];;<br></br>
                int[] nonEmptyList == [1,2,3,4];;
              </pre>
            </td>
          </tr>
          <tr>
            <td>Functions</td>
            <td>
              <pre>
                {"function exampleFunction(vibe) {"}
                <br></br>
                {"  if (vibe) {"}
                <br></br>
                {"    return true"}
                <br></br>
                {"  } else {"}
                <br></br>
                {"    return false"}
                <br></br>
                {"  }"}
                <br></br>
                {"}"}
              </pre>
            </td>
            <td>
              <pre>
                {"flossin boolin exampleFunction:boolin vibe: {"}
                <br></br>
                {"  vibeCheck :vibe=based: {"}
                <br></br>
                {"    dab based;;"}
                <br></br>
                {"  } badVibes {"}
                <br></br>
                {"    dab unbased;;"}
                <br></br>
                {"  }"}
                <br></br>
                {"}"}
              </pre>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Examples;
