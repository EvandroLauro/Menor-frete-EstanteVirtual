const axios = require('axios');
const cheerio = require('cheerio');
const {passIsbnForObj, createValidation} = require('../checkISBN.js');
//const {passIsbnForObj, select, format, classification} = require('../checkISBN.js')

describe("Passando a lista de ISBN para um objeto mais organizado", () => {    
    test("testando", () => {
        let list = ['64646464', '978-8575228050', '978-8573076103', '6586057043'];
        let object = {
            0 : '64646464',
            1 : '978-8575228050',
            2 : '978-8573076103',
            3 : '6586057043'
        };
        expect(passIsbnForObj(list)).toEqual(object);
    })
})

describe("Validando ISBN", () => {
    test("testando", async () => {
        let isbns = {
            0 : '64646464',
            1 : '978-8575228050',
            2 : '978-8573076103',
            3 : '6586057043'
        };
        let result = {
            invalido: { '64646464': 'Nenhum resultado para 64646464.' },
            valido: {
                '978-8575228050': '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
                '978-8573076103': '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
                '6586057043': '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043'
            }
        };
        let data = [];
        for (i in isbns) { // Não utilizei um Promise.all com map aqui pois eu acho que assim fica mais legível
            let html = await axios.get("https://amazon.com.br/s?k=".concat(isbns[i]));
            jest.setTimeout(100000);
            data.push(cheerio.load(html.data));
        }
        const validation = createValidation();
        expect(validation.start(isbns, data)).toEqual(result);
    }, 100000)
})

/*
describe("Organizando dados obtidos pela raspagem para classificação", () => {
    test("testando", async () => {
        let isbns = ['64646464', '978-8575228050', '978-8573076103', '6586057043'];
        let links = ['Nenhum resultado para 64646464.', '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
                     '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
                     '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043'];
        let result = [];
        for (i in isbns) { // Não utilizei um Promise.all com map aqui pois eu acho que assim fica mais legível
            let html = await axios.get("https://amazon.com.br/s?k=".concat(isbns[i]));
            jest.setTimeout(100000);
            result.push(cheerio.load(html.data));
        }
        expect(select(result)).toEqual(links);
    }, 100000)
})

describe("Formata dados organizado pela função organizingDataForClassification", () => {
    test("testando", () => {
        let unreadable = ["/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056/ref=sr_1_1?dchild=1&keywords=978-8575228050&qid=1628516868&sr=8-1",
                          "/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100/ref=sr_1_1?dchild=1&keywords=978-8573076103&qid=1628516873&sr=8-1&ufe=app_do%3Aamzn1.fos.6a09f7ec-d911-4889-ad70-de8dd83c8a74",
                          "/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043/ref=sr_1_1?dchild=1&keywords=6586057043&qid=1628516878&sr=8-1&ufe=app_do%3Aamzn1.fos.6d798eae-cadf-45de-946a-f477d47705b9"
                        ];
        let formatted = ["/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056",
                         "/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100",
                         "/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043"
                        ];
        unreadable.map((u, i) => [expect(format(u)).toEqual(formatted[i])]);
    })
})

describe("Valida os dados organizado", () => {
    test("testando", () => {
        let isbns = {
            0 : '64646464',
            1 : '978-8575228050',
            2 : '978-8573076103',
            3 : '6586057043'
        };
        let links = ['Nenhum resultado para 64646464.',
            '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
            '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
            '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043'
        ];
        let result = {
            invalido: { '64646464': 'Nenhum resultado para 64646464.' },
            valido: {
                '978-8575228050': '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
                '978-8573076103': '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
                '6586057043': '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043'
            }
        };
        expect(classification(isbns, links)).toEqual(result);
    })
})
*/