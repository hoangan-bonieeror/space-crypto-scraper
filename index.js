const express = require('express')
const path = require('path')
const http = require('http')

const socketServer = require('./client/socket')
const refreshData = require('./utils/refresh')
const client = require('./utils/db_connection')

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3000

app.use('/client', express.static(path.join(__dirname, './public')))

setInterval(() => {
    refreshData(client);
    console.log('Refresh data...')
}, 10000) // 

socketServer(server, client);

app.get('/api/price-feed', async (req,res) => {
    try {
        const responseFromDB = await client.query('SELECT * FROM crypto')

        if(responseFromDB.rows[0]) res.status(200).json({
            code : 200,
            status : 'Success',
            data : responseFromDB.rows
        })
    } catch (error) {
        throw new Error(error)
    }
})

server.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
