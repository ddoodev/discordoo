const fetch = require('node-fetch')
const child_process = require('child_process')
const apiURL = 'https://ddoo.dev/map'

const secret = process.env.SECRET
const key = child_process.execSync('git log -1 --pretty=%B').toString()
const value = child_process.execSync('git log -1 --pretty=%h').toString()

console.log({ key, value })

async function run() {
  const resp = await fetch(apiURL, { 
    method: 'POST', 
    headers: {
      Authorization: secret.toString(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hash: { key, value }
    })
  })

  if(resp.status != 200) {
    throw new Error(`failed with code ${resp.status} - ${await resp.text()}`)
  } else {
    console.log(`success with code ${resp.status}`)
  }
}

run()