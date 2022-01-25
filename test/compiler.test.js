import assert from "assert/strict"
import { add } from "../src/language.js"

describe("The compiler has an add function", () => {
  describe("has an add function", () => {
    it("should return 10 when adding 5 and 5", () => {
      assert.deepEqual(add(5, 5), 10)
    })
  })
})
