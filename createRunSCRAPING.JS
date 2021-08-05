const axios = require('axios')
const cheerio = require('cheerio')
const {checkDns} = require('./checkDNS')
const {createRace} = require('./createRACE')

const createRunScraping = async() => {

    const scrapingRun = async(urlFixo, urlMovel) => {
        const waitingTime = 15000
        const result = []
        for (i in urlMovel) {
            const urlMovelX = urlMovel[i] // isbn[i] fica indefindo quando passa pelo checkDns em diante, o jeito de arrumar o bug foi passar isbn[i] a outra variavel
            while (true) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    await checkDns()
                    await new Promise(resolve => setTimeout(resolve, 500))
                    const race = await createRace() // tentar eternizar esse codigo onde ele é chamado
                    await new Promise(resolve => setTimeout(resolve, 500))
                    const resultado = await race.start(scraping(urlFixo, urlMovelX), waitingTime)
                    await new Promise(resolve => setTimeout(resolve, 500))
                    if (resultado != "Sem internet, ou site indisponivel") {
                        result.push(resultado)
                        break
                    }
                } catch {
                    console.log('Sem Internet')
                    await new Promise(resolve => setTimeout(resolve, 2000))
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500))
        return result
    }

    const scraping = async(urlFixo, urlMovel) => {
        const result = await axios.get(urlFixo + urlMovel)
        await new Promise(resolve => setTimeout(resolve, 500))
        return cheerio.load(result.data)       
    }
   
    return {
        runScraping(urlFixo, urlMovel) {
            return scrapingRun(urlFixo, urlMovel)
        }
    }
}

module.exports = {
    createRunScraping
}