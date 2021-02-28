const { Client } = require('./packages/core/dist/index')
const { WSModule } = require('./packages/ws/dist/index')
const i = require('worker_threads')

const client = new Client({ token: 'NzQ5Mzg0Mjc5NzU4MzQwMjE3.X0rMfw.v9wo9aU6ABThnM6W9wdwwydvtTo' })
client.use(new WSModule({ shards: 1, file: __filename }))

client.start()