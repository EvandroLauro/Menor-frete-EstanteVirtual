const {createRunScraping} = require('./createRunSCRAPING')
const imageDownloader = require('node-image-downloader')

var inputIsbn  = ['64646464', '978-8575228050', '978-8573076103', '6586057043']

const passInputIsbnInObj = (array) => {
    let i = 0
    return array.reduce((acc ,val) => {
        const obj = {...acc , [i] : val};
        i++
        return obj;
    }, {})
}

const checkIsbn = async(isbns) => {
    const run = await createRunScraping()
    const dataObtainedByScraping = await run.runScraping("https://amazon.com.br/s?k=", isbns)
    const dataAnalyzed = analyzesDataObtainedByScraping(dataObtainedByScraping)
    return validatingIsbn(isbns, dataAnalyzed)
}

const analyzesDataObtainedByScraping = ($) => {
    let result = []
    for (let i = 0; i < $.length; i++) {
        $[i]('.s-no-outline').each((i, element) => {
            const link = $[i](element).attr("href")
            result.push(link)
        })
        $[i]('.a-size-medium').each((i, element) => {
            const fail = $[i](element).text()
            if (fail == 'Nenhum resultado para ') {
                result.push(fail)
            }
        })
    }
    return result
}

const validatingIsbn = (chave, valor) => { 
    console.log(valor)
    chave = Object.values(chave)
    let invalidos = {}, validos = {}
    for (let i = 0; i < valor.length; i++) { 
        if (valor[i] == 'Nenhum resultado para ') { // tentar colocar esse if num ternario
            let invalido = {
                [chave[i]] : `${valor[i]}${chave[i]}`
            }
            Object.assign(invalidos, invalido)
        } else {
            let valido = {
                [chave[i]] : valor[i]
            }
            Object.assign(validos, valido)
        }
    }
    let result = Object.assign({invalido : invalidos}, {valido : validos})
    return result
}

//checkIsbn(passInputIsbnInObj(inputIsbn))

/*
module.exports = {
    checkIsbn, 
}
*/

// Exportado para pagina de test
module.exports = { 
    passInputIsbnInObj
}

