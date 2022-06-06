const express = require('express')
const path = require('path')
const http = require('http')

const { crawl , handleLang } = require('./utils/crawl')
const socketServer = require('./client/socket')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use('/client', express.static(path.join(__dirname, './public')))

socketServer(server);

app.get('/api/price-feed', async (req,res) => {
    const data = await crawl(handleLang('https://coinmarketcap.com/', 'vi'))
    res.status(200).json(data)
})

server.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
