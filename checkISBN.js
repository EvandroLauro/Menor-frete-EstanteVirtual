const {createRunScraping} = require('./createRunSCRAPING')

//var inputIsbn = ['978-8573076103']
var inputIsbn  = ['64646464', '978-8575228050', '978-8573076103', '6586057043']

/**
 *  Passando a lista de ISBN para um objeto"
 * 
 * @method passInputIsbnInObj
 * @param {Array} isbns Sera convertido em objeto
 * @returns {Objeto} Array convertido
 */
const passInputIsbnInObj = (isbns) => {
    let i = 0
    return isbns.reduce((acc, val) => {
        const obj = {...acc, [i] : val}
        i++
        return obj
    }, {})
}

const checkIsbn = async(isbns) => {
    const run = await createRunScraping()
    const dataObtainedByScraping = await run.runScraping("https://amazon.com.br/s?k=", isbns)
    const dataAnalyzed = organizingDataForClassification(dataObtainedByScraping)
    return validatingIsbn(isbns, dataAnalyzed)
}

/**
 *  Organizando o html obtido pelo scraping para validação
 * 
 * @method organizingDataForClassification
 * @param {Array} $ Sera organizado
 * @returns {Array} Organizado
 */
const organizingDataForClassification = ($) => { // aqui utilizamos condicional ternário           
    return $.map(elem => elem('.s-no-outline').length > 0 ? 
        formatOrganizingDataForClassification(elem('.s-no-outline').attr("href")) : 
        elem('.a-size-medium').text()
    )
}

const formatOrganizingDataForClassification = (link) => { 
    return link.split('/')
        .filter((elem, index) => index > 0 && index <= 3)
        .map((elem) => '/'.concat(elem))
        .toString()
        .replace(/,/g, '')
}

const validatingIsbn = (chave, valor) => { 
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
    console.log(result)
    return result
}

//checkIsbn(passInputIsbnInObj(inputIsbn))

/*

// Modulo que realmente sera consumido
module.exports = {
    checkIsbn, 
}
*/

// Exportado para pagina de test
module.exports = { 
    passInputIsbnInObj,
    organizingDataForClassification
}