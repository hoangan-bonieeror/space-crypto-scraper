const express = require('express')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const { crawl , handleLang } = require('./utils/crawl')

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = process.env.PORT || 3000

app.use('/client', express.static(path.join(__dirname, './public')))

io.on('connection', async (socket) => {
    const data = await crawl(handleLang('https://coinmarketcap.com/', 'vi'))
    socket.emit('loadData', data)

    const refreshData = setInterval(async () => {
        socket.emit('refreshData', await crawl(handleLang('https://coinmarketcap.com/', 'vi')))
    }, 5000)

    socket.on('disconnect', () => {
        clearInterval(refreshData)
    })
})

app.get('/api/price-feed', async (req,res) => {
    const data = await crawl(handleLang('https://coinmarketcap.com/', 'vi'))
    res.status(200).json(data)
})

server.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
