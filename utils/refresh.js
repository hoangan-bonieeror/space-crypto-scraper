const { crawl , handleLang } = require('./crawl')

const refreshData = async (client) => {
    try {
        const data = await crawl(handleLang('https://coinmarketcap.com/', 'vi'))

        const insertString = 'INSERT INTO crypto(name, price, day, week, market_cap, volume, circulating_supply) VALUES($1, $2, $3, $4, $5, $6, $7)';
        const updateString = "UPDATE crypto SET price='value_price', day='value_day', week='value_week', market_cap='value_marketCap', volume='value_volume', circulating_supply='value_circulatingSupply', updateat=CURRENT_TIMESTAMP WHERE name='value_name'";
    
        let valueArr = []
        for(let item of data) {
            const { name, price, day, week, marketCap, volume, circulatingSupply } =  item;
            const checkExistString = `SELECT * FROM crypto WHERE name='${name}'`
            const responseFromDB = await client.query(checkExistString);

            (responseFromDB.rows[0])
            ? valueArr.push(item)
            : valueArr.push([name, price, day, week, marketCap, volume, circulatingSupply])
        }
    
        valueArr.length !== 0 && valueArr.forEach(item => {
            if(Array.isArray(item)) {
                client.query(insertString, item, (err) => {
                    if(err) throw new Error(err)
                })
            } else { // the item is an object
                let configString = updateString;
    
                for(const [key, value] of Object.entries(item)) {
                    configString = configString.replace(`value_${key}`, value)
                }

                client.query(configString, (err) => {
                    if(err) throw new Error(err);
                })
            }
        });
    } catch (error) {
        throw new Error(error)
    }
}

module.exports = refreshData;