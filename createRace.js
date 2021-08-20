const createRace = async() => {
    
    const myScript = (funcao) => {
        const promise = new Promise((resolve, reject) => {
                resolve(funcao)
        })
        return promise
    }

    const maxDuration = (tempo) => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Sem internet, ou site indisponivel")
            }, tempo)
        })
        return promise
    }

    return {
        async start(funcao, tempo) {
            return await Promise.race([myScript(funcao), maxDuration(tempo)]).then((data) => {
                return data
            })
        }
    }

}

module.exports = {
    createRace
}
