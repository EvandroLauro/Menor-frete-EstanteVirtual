const {createScraping} = require('./createRunSCRAPING')
const imageDownloader = require('node-image-downloader')

const isbn = {
    desclassificado: { '64646464': 'Nenhum resultado para 64646464.' },
    classificado: {
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
}


const selectBooks = async(isbn) => {
    const scraping = await createScraping();
    const data = await scraping.start("https://amazon.com.br", isbn.classificado, "selectBooks");
    const analyzes = createAnalysis();
    const desclassificado = isbn.desclassificado;
    const classificado = analyzes.start(data);
    const result = {desclassificado, classificado};
    console.log(result)
}

const createAnalysis = () => {
    
    const analysis = (data) => {
    
        let chave = Object.keys(data);
        data = Object.values(data);
        const bookname = selectBookName(data);
        const autor = selectAutor(data);
        const img = selectImg(chave, data);
        let classificado = {};
        for (let i = 0; i < chave.length; i++) {
            classificado[chave[i]] = {
                bookname :bookname[i],
                autor : autor[i],
                imagem : img[i]
            }
        }
        return classificado;
    }

    const selectBookName = (data) => {
        return  data.map(elem => elem('.a-size-extra-large').text().replace(/(\r\n|\n|\r)/gm, ""));
    }

    const selectAutor = (data) => {
        return  data.map(elem => formatAutor(elem('#bylineInfo').text()));
    }

    const selectImg = (chave, data) => {
        let result = [];
        for (let i = 0; i < chave.length; i++) {
            let r;
            if (chave[i][0] == "B") {
                let link = data[i]('#leftCol img:eq(1)').attr("src");
                downloaderImg(link);
                r = link.replace("https://m.media-amazon.com/images/I/", "");
            } else {
                let link = Object.keys(JSON.parse(data[i]('#img-canvas img').attr("data-a-dynamic-image")))[0]
                downloaderImg(link);
                r = link.replace("https://images-na.ssl-images-amazon.com/images/I/", "");
            }
            result.push(r);
        }   
        return result;
    }

    const formatAutor = (texto) => {
        const valoresQueServiraDeReferenciaParaRemoverOsIndesajado = ["›", ","];
        let textoPréFormatadoTexto = texto.replace(/(\r\n|\n|Edição|Português|by|por|Kindle|Edition|Format:|eBook|Kindle|Formato:|Author|Autor|[(\)])/gm, "");
        let posiçãoReferencia = textoPréFormatadoTexto.indexOf(valoresQueServiraDeReferenciaParaRemoverOsIndesajado[0]);
        if (posiçãoReferencia == -1) {
            posiçãoReferencia = textoPréFormatadoTexto.indexOf(valoresQueServiraDeReferenciaParaRemoverOsIndesajado[1]);
        }
        const iniciodDoTexto = 0;
        if (posiçãoReferencia == -1) {
            posiçãoReferencia = posiçãoReferencia.length;
        }
        return textoPréFormatadoTexto.slice(iniciodDoTexto, posiçãoReferencia);
    }

    const downloaderImg = (link) => {
        imageDownloader({
            imgs: [
                {
                    uri: link
                }
            ], dest: './downloads', })
            .then((info) => {
                console.log('all done', info);
            })
            .catch((error, response, body) => {
                console.log('something goes bad!');
                console.log(error);
        });
    }

    return { 
        start(data) {
            return analysis(data);
        }
    };
}

selectBooks(isbn)
/*
module.exports = {
    selectsBookRelatedToIsbn
}
*/
