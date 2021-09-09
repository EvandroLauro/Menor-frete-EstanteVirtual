const axios = require('axios');
const cheerio = require('cheerio');
const {selectNames} = require('../selectsBookRelatedToISBN.js');

describe("Selecionando nome do livro, autor e caminho da onde a capa do livo vai ser salva no computador", () => {
    test("test", async () => {

        const isbns = {
            "inexistente": { '64646464': 'Nenhum resultado para 64646464.' },
            "existente": {
                '6550440181': '/T%C3%A9cnicas-Invas%C3%A3o-Aprenda-t%C3%A9cnicas-invas%C3%B5es/dp/6550440181',
                '8575224743': '/Express%C3%B5es-Regulares-Uma-Abordagem-Divertida/dp/8575224743',
                '8525063096': '/Livro-Filosofia-V%C3%A1rios-Autores/dp/8525063096',
                '0399501487': '/Lord-Flies-William-Golding/dp/0399501487',
                '8535932879': '/Pequeno-manual-antirracista-Djamila-Ribeiro/dp/8535932879',
                '978-8575228050': '/Problemas-Cl%C3%A1ssicos-Ci%C3%AAncia-Computa%C3%A7%C3%A3o-Python/dp/8575228056',
                '978-8573076103': '/Padr%C3%B5es-Projetos-Solu%C3%A7%C3%B5es-Reutiliz%C3%A1veis-Orientados/dp/8573076100',
                '6586057043': '/Migrando-Sistemas-Monol%C3%ADticos-Para-Microsservi%C3%A7os/dp/6586057043',
                '978-8535929881': '/Cosmos-Carl-Sagan/dp/8535929886',
                '978-9588931623': '/Homo-deus-Yuval-Noah-Harari/dp/8535928197',
                'B0108F7GT4' : '/poder-a%C3%A7%C3%A3o-Fa%C3%A7a-ideal-papel-ebook/dp/B0108F7GT4',
                'B07662PR6N' : '/sutil-arte-ligar-se-ebook/dp/B07662PR6N',
                'B08QQ9CQYB' : '/Who-cares-Pedro-Cerize-ebook/dp/B08QQ9CQYB',
                'B07MTRGXFC' : '/Cria%C3%A7%C3%A3o-riqueza-metodologia-enriquec%C3%AA-lo-objetivos-ebook/dp/B07MTRGXFC',
                'B075JMXJLH' : '/PROCRASTINA%C3%87%C3%83O-cient%C3%ADfico-sobre-procrastinar-definitivamente-ebook/dp/B075JMXJLH'
            }
        };

        const obj = {
            '6550440181': {
                "bookname": 'Técnicas de Invasão: Aprenda as técnicas usadas por hackers em invasões reais',
                "autor": ' Bruno Fraga',
                "imagem": '41ZLzHFZIYL._SY344_BO1,204,203,200_.jpg'
            },
            '8575224743': {
                "bookname": 'Expressões Regulares: Uma Abordagem Divertida',
                "autor": ' Aurelio Marinho Jargas',
                "imagem": '41zwWQrTnIL._SY344_BO1,204,203,200_.jpg'
            },
            '8525063096': {
                "bookname": 'O livro da filosofia',
                "autor": ' Vários autores',
                "imagem": '61lA9xD1+4L._SX258_BO1,204,203,200_.jpg'
            },
            '0399501487': {
                "bookname": 'Lord of the Flies',
                "autor": ' InglêsWilliam Golding',
                "imagem": '51eeAWItwbL._SY344_BO1,204,203,200_.jpg'
            },
            '8535932879': {
                "bookname": 'Pequeno manual antirracista',
                "autor": ' Djamila Ribeiro',
                "imagem": '51MIiyfps7L._SX342_BO1,204,203,200_.jpg'
            },
            '978-8575228050': {
                "bookname": 'Problemas Clássicos de Ciência da Computação com Python',
                "autor": ' David Kopec',
                "imagem": '41N8ARiA-yL._SY344_BO1,204,203,200_.jpg'
            },
            '978-8573076103': {
                "bookname": 'Padrões de Projetos: Soluções Reutilizáveis de Software Orientados a Objetos',
                "autor": ' Erich Gamma',
                "imagem": '51bO3rI8hEL._SX348_BO1,204,203,200_.jpg'
            },
            '6586057043': {
                "bookname": 'Migrando Sistemas Monolíticos Para Microsserviços: Padrões Evolutivos Para Transformar seu Sistema Monolítico',
                "autor": ' Sam Newman',
                "imagem": '51kKwi26xXL._SX357_BO1,204,203,200_.jpg'
            },
            '978-8535929881': {
                "bookname": 'Cosmos',
                "autor": ' Carl Sagan',
                "imagem": '51Pk+rtecoL._SY344_BO1,204,203,200_.jpg'
            },
            '978-9588931623': {
                "bookname": 'Homo Deus',
                "autor": ' Yuval Noah Harari',
                "imagem": '41bUl4cVKsL._SX346_BO1,204,203,200_.jpg'
            },
            "B0108F7GT4": {
                "bookname": 'O poder da ação: Faça sua vida ideal sair do papel',
                "autor": 'Paulo Vieira',
                "imagem": '518iuvQqW6S._SY346_.jpg'
            },
            "B07662PR6N": {
                "bookname": 'A sutil arte de ligar o f*da-se',
                "autor": 'Mark Manson  ',
                "imagem": '5144Ghp-b8L._SY346_.jpg'
            },
            "B08QQ9CQYB": {
                "bookname": 'Who cares?',
                "autor": 'Pedro  Cerize',
                "imagem": '41sPeoIpd-L._SY346_.jpg'
            },
            "B07MTRGXFC": {
                "bookname": 'Criação de riqueza: Uma metodologia simples e poderosa que vai enriquecê-lo e fazer você atingir seus objetivos',
                "autor": 'Paulo Vieira',
                "imagem": '51AeW7GrkTL._SY346_.jpg'
            },
            "B075JMXJLH": {
                "bookname": 'PROCRASTINAÇÃO: Guia científico sobre como parar de procrastinar (definitivamente)',
                "autor": 'Lilian Soares  ',
                "imagem": '41cWJnvAy7L._SY346_.jpg'
            }
        };

        let result = {};
        for (i in isbns.existente) { // Não utilizei um Promise.all com map aqui pois eu acho que assim fica mais legível
            let html = await axios.get("https://amazon.com.br".concat(isbns.existente[i]));
            jest.setTimeout(100000);
            let data = cheerio.load(html.data);
            result[i] = data;
        }
        const select = selectNames(); // vou mudar o nome dessa function para selectNames 
        expect(select.start(result)).toEqual(obj);
    }, 100000);
})