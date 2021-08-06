const {createRunScraping} = require('./createRunSCRAPING')

const selectsBookRelatedToIsbn = async(isbnValido) => {
    console.log('selectsBookRelatedToIsbn')
    const run = await createRunScraping()
    const dataObtainedByScraping = await run.runScraping("https://amazon.com.br", isbnValido)
    const analyzes = analyzesDataObtainedByScraping()
    const dataAnalyzed = analyzes.analyzesData(dataObtainedByScraping)
    return validatingBookRelatedToIsbn(isbnValido, dataAnalyzed)
}

const analyzesDataObtainedByScraping = () => {
    
    const dataAnalyzes = (valor) => {
        let result = []
        for (let i = 0; i < valor.length; i++) {
            result.push([getBookAutorOnAmazon(valor[i]), getBookNameOnAmazon(valor[i])])
        }
        return result
    }

    // Esse codigo vai entrar aqui no meio
    /*
    const imageDownloader = require('node-image-downloader')
                        V
                        V
    for (let i = 0; i < $.length; i++) {
        $[i]('.s-image').each((i, element) => { // talvez a class seja diferente, verificar no html da pagina
            const link = $[i](element).attr("src") 
            imageDownloader({
                imgs: [
                    {
                        uri: link
                    }
                ], dest: './downloads', })
                .then((info) => {
                    console.log('all done', info)
                })
                .catch((error, response, body) => {
                    console.log('something goes bad!')
                    console.log(error)
            })
            result.push(link)
        })
    }
    */

    const getBookNameOnAmazon = ($) => {
        let result 
        $('.a-size-extra-large').each((i, element) => {
            const nameBook = $(element).text()
            result = nameBook.replace(/(\r\n|\n|\r)/gm, "")
        })
        return result
    }
    
    const getBookAutorOnAmazon = ($) => {
        let result 
        $('#bylineInfo').each((i, element) => {
            const texto = $(element).text()
            result = formatterUsedByGetBookAutorOnAmazon(texto)
        })
        return result
    }
    const formatterUsedByGetBookAutorOnAmazon = (texto) => {
        let result 
        const valoresQueServiraDeReferenciaParaRemoverOsIndesajado = ["›", ","]
        let textoPréFormatadoTexto = texto.replace(/(\r\n|\n|by|por|Kindle|Edition|Format:|eBook|Kindle|Formato:|Author|Autor|[(\)])/gm, "")
        let posiçãoReferencia = textoPréFormatadoTexto.indexOf(valoresQueServiraDeReferenciaParaRemoverOsIndesajado[0])
        if (posiçãoReferencia == -1) {
            posiçãoReferencia = textoPréFormatadoTexto.indexOf(valoresQueServiraDeReferenciaParaRemoverOsIndesajado[1])
        }
        const iniciodDoTexto = 0
        if (posiçãoReferencia == -1) {
            posiçãoReferencia = posiçãoReferencia.length
        }
        result = textoPréFormatadoTexto.slice(iniciodDoTexto, posiçãoReferencia);
        return result
    }

    return { 
        analyzesData(valor) {
            return dataAnalyzes(valor)
        }
    }
}

const validatingBookRelatedToIsbn = (chave, valor) => {
    let key = Object.keys(chave)
    let invalidos = {}, validos = {}
    for (let i = 0; i < valor.length; i++) {
        if (valor[i][0] == undefined) {
            let invalido = { [key[i]] : {
                    autor : valor[i][0],
                    book : valor[i][1]
                }
            }
            Object.assign(invalidos, invalido)
        } else {
            let valido = { [key[i]] : {
                    autor : valor[i][0],
                    book : valor[i][1]
                }
            }
            Object.assign(validos, valido)
        }
    }
    let result = Object.assign({invalido : invalidos}, {valido : validos})
    return result
}

module.exports = {
    selectsBookRelatedToIsbn
}
