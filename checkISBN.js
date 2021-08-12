const {createRunScraping} = require('./createRunSCRAPING')

//var inputIsbn = ['978-8573076103']
var inputIsbn  = ['64646464', '978-8575228050', '978-8573076103', '6586057043']

/**
 *  Passando a lista de ISBN para um objeto"
 * 
 * @method passInputIsbnInObj
 * @param {Array} isbns Sera convertido em objeto
 * @returns {Object} Array convertido
 */

const passInputIsbnInObj = (isbns) => {
    const obj = {}
    for (let i = 0; i < isbns.length; i++) {
        obj[[i]] = isbns[i];
    }
    return obj
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

/**
 * "Classifica os dados entre invalido e valido"
 * 
 * @method validatingIsbn
 * @param {Object} isbns 
 * @param {Array} links 
 * @returns {Object}
 */
const validatingIsbn = (isbns, links) => {
    const valido = {}, invalido = {};
    let isbn = Object.values(isbns)
    for (let i = 0; i < links.length; i++) {
        const categoria = links[i] === `Nenhum resultado para ${isbn[i]}.` ? invalido : valido;
        categoria[isbn[i]] = links[i];
    }
    return {invalido, valido}
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
    organizingDataForClassification,
    formatOrganizingDataForClassification,
    validatingIsbn
}


