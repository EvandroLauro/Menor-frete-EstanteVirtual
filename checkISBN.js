const {createScraping} = require('./createRunSCRAPING')

//var inputIsbn = ['978-8573076103']
var inputIsbn  = ['64646464', '978-8575228050', '978-8573076103', '6586057043']

/**
 *  Passando a lista de ISBN para um objeto"
 * 
 * @method passIsbnForObj
 * @param {Array} isbns Sera convertido em objeto
 * @returns {Object} Array convertido
 */
const passIsbnForObj = (isbns) => {
    const obj = {};
    for (let i = 0; i < isbns.length; i++) {
        obj[[i]] = isbns[i];
    }
    return obj;
}

const checkIsbn = async(isbns) => {
    const scraping = await createScraping();
    const data = await scraping.start("https://amazon.com.br/s?k=", isbns);
    const classification =  createClassification();
    const result = classification.start(isbns, data);
    return result
}

/**
 * Classifica o ISBN passado
 *
 * @method createClassification
 * @param {Object} isbns Sera usado de id no obj
 * @param {Array} data Sera classificado ou considerado desclassificado
 * @returns {Object} classificação concluída
 */
const createClassification = () => {

    const classification = (isbns, data) => {
        const links = select(data);
        const classificado = {}, desclassificado = {};
        let isbn = Object.values(isbns);
        for (let i = 0; i < links.length; i++) {
            const categoria = links[i] === `Nenhum resultado para ${isbn[i]}.` ? desclassificado : classificado;
            categoria[isbn[i]] = links[i];
        }
        return {desclassificado, classificado};
    }

    const select = ($) => {      
        return $.map(elem => elem('.s-no-outline').length > 0 ? format(elem('.s-no-outline').attr("href")) : elem('.a-size-medium').text());
    }
    
    const format = (link) => { 
        return link.split('/')
            .filter((elem, index) => index > 0 && index <= 3)
            .map((elem) => '/'.concat(elem))
            .toString()
            .replace(/,/g, '');
    }
    
    return {
        start(isbns, data) {
            return classification(isbns, data);
        }
    };

}

//checkIsbn(passIsbnForObj(inputIsbn))

module.exports = {
    passIsbnForObj,
    createClassification
}

/*
const checkIsbn = async(isbns) => {
    const scraping = await createScraping();
    const data = await scraping.start("https://amazon.com.br/s?k=", isbns);
    const selected = select(data);
    const result = classification(isbns, selected);
    return result
}

/**
 *  Organizando o html obtido pelo scraping para validação
 * 
 * @method select
 * @param {Array} $ Sera organizado
 * @returns {Array} Organizado
 */
/*
const select = ($) => { // função com condicional ternário           
    return $.map(elem => elem('.s-no-outline').length > 0 ? format(elem('.s-no-outline').attr("href")) : elem('.a-size-medium').text());
}

/**
 * Formatando o html organizado que sera validado
 * 
 * @method format
 * @param {String} link Sera formatado 
 * @returns {String} Formatado
 */
/*
const format = (link) => { 
    return link.split('/')
        .filter((elem, index) => index > 0 && index <= 3)
        .map((elem) => '/'.concat(elem))
        .toString()
        .replace(/,/g, '');
}

/**
 * Classifica os dados entre invalido e valido
 * 
 * @method classification
 * @param {Object} isbns 
 * @param {Array} links 
 * @returns {Object}
 */
/*
const classification = (isbns, links) => {
    const valido = {}, invalido = {};
    let isbn = Object.values(isbns);
    for (let i = 0; i < links.length; i++) {
        const categoria = links[i] === `Nenhum resultado para ${isbn[i]}.` ? invalido : valido;
        categoria[isbn[i]] = links[i];
    }
    return {invalido, valido};
}

// Exportado para pagina de test

module.exports = { 
    passIsbnForObj,
    select,
    format,
    classification,
}
//checkIsbn(passIsbnForObj(inputIsbn))
*/