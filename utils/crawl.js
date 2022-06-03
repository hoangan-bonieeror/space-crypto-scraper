const axios = require('axios')
const cheerio = require('cheerio')

const properties = [
    'rank',
    'name',
    'price',
    '24h',
    '7d',
    'marketCap',
    'volume',
    'circulatingSupply'
]

const crawl = async (url) => {
    const { data } = await axios.get(url)
    const $ = cheerio.load(data)
    const elementSelector = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr'
    const coinOutput = []
    $(elementSelector).each((index, row) => {
        let keyIdx = 0
        const coinObj = {}


        if(index <= 8) { // Get top 8 rank cyptocurrency
            $(row).children().each((indexChild, column) => {
                if($(column).text()){ 
                    switch (keyIdx) {
                        case 1 :
                            coinObj[properties[keyIdx]] = $('p:first-child', $(column).html()).text()
                            break;
                        case 5 :
                            coinObj[properties[keyIdx]] = $('span:nth-child(2)', $(column).html()).text()
                            break;
                        case 6 :
                            coinObj[properties[keyIdx]] = $('div:nth-child(1) > a > p', $(column).html()).text()
                            break;
                        default :
                            coinObj[properties[keyIdx]] = $(column).text()
                            break;
                    }
                    keyIdx++
                }
            })

            coinOutput.push(coinObj)
        } 
    })
    return coinOutput
}

const handleLang = (url, lang='') => {
    if(lang.length !== 0) return url + lang
    return url
}

module.exports = {
    handleLang,
    crawl
}