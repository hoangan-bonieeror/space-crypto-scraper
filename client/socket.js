module.exports = (httpServer, client) => {
    const { Server } = require('socket.io')
    const io = new Server(httpServer)

    io.on('connection', async (socket) => {
        const responseFromDB = await client.query('SELECT * FROM crypto')
        socket.emit('loadData', responseFromDB.rows)

        const refreshData = setInterval(async () => {
            socket.emit('refreshData', responseFromDB.rows)
        }, 10000)

        socket.on('disconnect', () => {
            clearInterval(refreshData)
        })
    })
}