const { crawl , handleLang } = require('../utils/crawl')

module.exports = (httpServer) => {
    const { Server } = require('socket.io')
    const io = new Server(httpServer)

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
}