const express = require('express')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const router = express.Router()

const db = admin.firestore()
const pixelsCollections = 'pixels'

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Pixels routes'
  })
})

router.post('/newTodayPixel', (req, res) => {
  let today = admin.firestore.Timestamp.now()
  let todayPixel = {
    angry: req.body.angry,
    confuse: req.body.confuse,
    happy: req.body.happy,
    passive: req.body.passive,
    sad: req.body.sad,
    finalEmotion: req.body.finalEmotion,
    date: today
  }
  firebaseHelper.firestore
    .createNewDocument(db, pixelsCollections, todayPixel)
    .then(docRef => res.status(200).send({
      message: 'Create today pixel!',
      pixel: todayPixel
    }))
    .catch((err) => {
      console.log(err)
      res.error(400).send({
        error: err
      })
    })
})

module.exports = router
