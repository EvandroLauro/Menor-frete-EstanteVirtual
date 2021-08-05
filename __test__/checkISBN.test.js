const {passInputIsbnInObj} = require('../checkISBN.js')

describe("Passando a lista de ISBN, para um objeto mais organizado", () => {
    test("testando", () => {
        let lista = ['64646464', '978-8575228050', '978-8573076103', '6586057043']
        let objeto = {
            0 : '64646464',
            1 : '978-8575228050',
            2 : '978-8573076103',
            3 : '6586057043'
        }
        expect(passInputIsbnInObj(lista)).toEqual(objeto)
    })
})

