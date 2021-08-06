const axios = require('axios')
const cheerio = require('cheerio')
const {passInputIsbnInObj, organizingDataForClassification} = require('../checkISBN.js')

describe("Passando a lista de ISBN para um objeto mais organizado", () => {    
    test("Saida", () => {
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

describe('Organizando dados obtidos pela raspagem para classificação ', () => {
    test("testando", async () => {
        let isbns = ['64646464', '978-8575228050', '978-8573076103', '6586057043']
        let links = ['Nenhum resultado para ', '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
                '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
                '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043']
        let result = [];
        for (i in isbns) { // Não utilizei um Promise.all com map aqui pois eu acho que assim fica mais legível
            let html = await axios.get("https://amazon.com.br/s?k=".concat(isbns[i]))
            jest.setTimeout(100000)
            result.push(cheerio.load(html.data))
        }
        expect(organizingDataForClassification(result)).toEqual(links)
    }, 100000)
})

