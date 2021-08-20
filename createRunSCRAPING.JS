const axios = require('axios')
const cheerio = require('cheerio')
const {checkDns} = require('./checkDNS')
const {createRace} = require('./createRACE')

const createScraping = async() => { 
    
    const controllerScraping = async(urlFixo, urlMovel) => {
        const waitingTime = 15000
        const result = []
        for (i in urlMovel) {
            const urlMovelX = urlMovel[i]
            while (true) {
                try {
                    await new Promise(resolve => setTimeout(resolve, 500))
                    await checkDns()
                    await new Promise(resolve => setTimeout(resolve, 500))
                    const race = await createRace() 
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
        start(urlFixo, urlMovel) {
            return controllerScraping(urlFixo, urlMovel)
        }
    }
}

module.exports = {
    createScraping
}