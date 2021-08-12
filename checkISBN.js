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
    return isbns.reduce((acc, elem) => {
        const obj = {...acc, [i] : elem}
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
const organizingDataForClassification = ($) => { // função com condicional ternário           
    return $.map(elem => elem('.s-no-outline').length > 0 ? 
        formatOrganizingDataForClassification(elem('.s-no-outline').attr("href")) : 
        elem('.a-size-medium').text()
    )
}

/**
 * Formatando o html organizado que sera validado
 * 
 * @method formatOrganizingDataForClassification
 * @param {String} link Sera formatado 
 * @returns {String} Formatado
 */
const formatOrganizingDataForClassification = (link) => { 
    return link.split('/')
        .filter((elem, index) => index > 0 && index <= 3)
        .map((elem) => '/'.concat(elem))
        .toString()
        .replace(/,/g, '')
}

function validatingIsbn(isbns, links) {
    const valido = {}, invalido = {};
    let isbn = Object.values(isbns)
    for (let i = 0; i < links.length; i++) {
        const categoria = links[i] === `Nenhum resultado para ${isbn[i]}.` ? invalido : valido;
        categoria[isbn[i]] = links[i];
    }
    return {invalido, valido}
}
/*
const validatingIsbn = (isbns, links) => {
    let invalidos = {}, validos = {}
    return Object.values(isbns).reduce((obj, isbn, index) => {
        let result 
        if (links[index] == `Nenhum resultado para ${[isbn]}.`) {
            let invalido = Object.assign(invalidos, {[isbn] : links[index]})
            result = {...obj, invalido}
        } else {
            let valido = Object.assign(validos, {[isbn] : links[index]})
            result = {...obj, valido}
        }
        return result
    }, {})
}
*/
/*
const validatingIsbn = (chave, links) => { 
    chave = Object.values(chave)
    let invalidos = {}, validos = {}
    for (let i = 0; i < links.length; i++) { 
        if (links[i] == `Nenhum resultado para ${chave[i]}.`) { // tentar colocar esse if num ternario
            let invalido = {
                [chave[i]] : `${links[i]}`
            }
            Object.assign(invalidos, invalido)
        } else {
            let valido = {
                [chave[i]] : links[i]
            }
            Object.assign(validos, valido)
        }
    }
    return Object.assign({invalido : invalidos}, {valido : validos})
}
*/

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
    organizingDataForClassification,
    formatOrganizingDataForClassification,
    validatingIsbn
}


