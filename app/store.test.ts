import * as store from "./store"
// @ponicode
describe("store.configuredStore", () => {
    test("0", () => {
        let callFunction: any = () => {
            store.configuredStore(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
