const axios = require('axios');
const cheerio = require('cheerio');
const {infoBooks} = require('../selectsBookRelatedToISBN.js');

describe("Selecionando nome do livro, autor e caminho da onde a capa do livo vai ser salva no computador", () => {
    test("test", async () => {

        const isbns = {
            "inexistente": { '64646464': 'Nenhum resultado para 64646464.' },
            "existente": {
                '6550440181': '/T%C3%A9cnicas-Invas%C3%A3o-Aprenda-t%C3%A9cnicas-invas%C3%B5es/dp/6550440181',
                'B075JMXJLH' : '/PROCRASTINA%C3%87%C3%83O-cient%C3%ADfico-sobre-procrastinar-definitivamente-ebook/dp/B075JMXJLH'

            }
        };

        const obj = {
            '6550440181': {
                "bookname": 'Técnicas de Invasão: Aprenda as técnicas usadas por hackers em invasões reais',
                "autor": ' Bruno Fraga',
                "url": 'downloads\\41ZLzHFZIYL._SY344_BO1,204,203,200_.jpg'
            }, 
            "B075JMXJLH": {
                "bookname": 'PROCRASTINAÇÃO: Guia científico sobre como parar de procrastinar (definitivamente)',
                "autor": 'Lilian Soares  ',
                "url": 'downloads\\41cWJnvAy7L._SY346_.jpg'
            }
        };

        let result = {};
        for (i in isbns.existente) { // Não utilizei um Promise.all com map aqui pois eu acho que assim fica mais legível
            let html = await axios.get("https://amazon.com.br".concat(isbns.existente[i]));
            jest.setTimeout(100000);
            let data = cheerio.load(html.data);
            result[i] = data;
        }
        const select = await infoBooks(); 
        await expect(select.start(result)).resolves.toEqual(obj);
    }, 100000);
})