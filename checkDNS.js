const accessDns = require('dns')

class StatusDns {                        	
    constructor(condicao) {
        this.condicao = condicao              
    }
    set setDNS(valor) {
        this.status = valor
    }
    get getDNS() {
        return this.status
    }
}

const statusDns = new StatusDns()

const checkDns = async() => {
    const url = "amazon.com"
    while (true) {
        await dns(url)
        await new Promise(resolve => setTimeout(resolve, 1000))
        if(statusDns.getDNS == true) {
            break
        }
        console.log("Tente restabelecer sua conexão")
        await new Promise(resolve => setTimeout(resolve, 500))
        console.log('Aguardando a conexão ficar estável')
        await new Promise(resolve => setTimeout(resolve, 10000))
    }
}

const dns = async(url) => { 
    accessDns.lookup(url, (err, addresses, family) => { verificaDNS(url, addresses)})
}

const verificaDNS = (addresses) => {
    if(addresses != undefined){
        statusDns.setDNS = true // colocar ternario aqui
    }else{
        statusDns.setDNS = false
    }
}

module.exports = {
    checkDns
}