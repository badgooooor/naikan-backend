const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

var serviceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://naikan-87838.firebaseio.com"
});

const app = express()
const main = express()

const pixelsRoute = require('./api/pixels')
const snapshotsRoute = require('./api/snapshots')

main.use('/api/v1', app)
main.use(cors())
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'API with firebase functions'
  })
})

app.use('/pixels', pixelsRoute)
app.use('/snapshots', snapshotsRoute)

exports.webApi = functions.https.onRequest(main)
