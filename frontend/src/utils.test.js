/* eslint-disable */
const utils = require("./utils")
// @ponicode
describe("utils.getAge", () => {
    test("0", () => {
        let result = utils.getAge("01/13/2020")
        expect(result).toBe(1)
    })
})
