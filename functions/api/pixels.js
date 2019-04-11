const express = require('express')
const admin = require('firebase-admin')
const firebaseHelper = require('firebase-functions-helper')
const router = express.Router()

const db = admin.firestore()
const pixelsCollections = 'pixels'

function getToday() {
  let today = new Date()
  let year = today.getFullYear().toString()
  let rawMonth = (today.getMonth() + 1)
  let month = (rawMonth > 10) ? rawMonth.toString() : ("0" + rawMonth.toString())  
  let rawDate = today.getDate()
  let date = (rawDate > 10) ? rawDate.toString() : ("0" + rawDate.toString())
  return parseInt(year+month+date)
}

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Pixels routes'
  })
})

router.get('/getAll', (req, res) => {
  firebaseHelper.firestore
    .backup(db, pixelsCollections)
    .then(data => res.status(200).send(data))
    .catch((err) => {
      console.log(err)
      res.status(400)
    })
})

// TODO : Query pixel in each month.

// TODO : Get today pixel.
router.get('/todayPixel/:date', (req, res) => {
  let queryArray = [['date','==', parseInt(req.params.date)]]

  firebaseHelper.firestore
    .queryData(db, pixelsCollections, queryArray)
    .then(data => res.status(200).send(data))
    .catch(err => {
      console.log(err)
      res.status(400)
    })
})

// TODO : Make date string for storing :: FORMAT "YYYYMMDDHHMM" get from Date()
router.post('/todayPixel', (req, res) => {
  let today = getToday()
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

// TODO : Add new pixel at past date.

// TODO : Update today pixel.

module.exports = router
