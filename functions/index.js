const functions = require('firebase-functions')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const express = require('express')
const bodyParser = require('body-parser')

admin.initializeApp(functions.config().firebase)

const app = express()
const main = express()

main.use('/api/v1', app)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'API with firebase functions'
  })
})

exports.webApi = functions.https.onRequest(main)
