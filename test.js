const WSClient = require('./dist/src/ws/WSClient').default
const client = new WSClient('NzQ5Mzg0Mjc5NzU4MzQwMjE3.X0rMfw.RMDCsCcLI4fBNyNeh3SBHACpLB4', {
  compress: false
})

client.createShard(1)
