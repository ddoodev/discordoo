const child_process = require('child_process')

const secret = process.env.SECRET
const key = child_process.execSync('git log -1 --pretty=%B').toString()
const value = child_process.execSync('git log -1 --pretty=%h').toString()

console.log('writing', { key, value })

const https = require('https')
const data = JSON.stringify({
  hash: { key, value }
})

const options = {
  hostname: 'ddoo.dev',
  port: 443,
  path: '/map',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': secret
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)
  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})
req.write(data)
req.end()